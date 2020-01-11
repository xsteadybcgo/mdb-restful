const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const Topic = require('../models/topics')
const { tokenSecret } = require('../../config')

class Users {
    async find(ctx) {
        const { per_page = 10, page = 1 } = ctx.query
        const pages = Math.max(page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        ctx.body = await User
            .find({ name: new RegExp(ctx.query.q) }) //模糊搜索
            .limit(perPage)
            .skip(pages * perPage)
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query
        const seletedFields = fields.split(';').filter(v => v).map(f => ' +' + f).join("")
        const populateStr = fields.split(';').filter(v => v).map(f => {
            if (f === 'employments') return 'employments.company employments.job'
            if (f === 'educations') return 'educations.school education.major'
            return f
        }).join(' ')
        const user = await User
            .findById(ctx.params.id)
            .select(seletedFields)
            .populate(populateStr)
        if (!user) ctx.throw(404, '用户不存在')
        ctx.body = user
    }

    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        })
        const { name } = ctx.request.body
        const repeatedUser = await User.findOne({ name })

        if (repeatedUser) ctx.throw(409, '用户已存在')

        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }

    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
        await next()
    }

    async updateById(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false }
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) { ctx.throw(404) }
        ctx.body = user
    }

    async deleteById(ctx) {
        ctx.verifyParams({
            password: { type: 'string', required: true }
        })
        const user = await User.findByIdAndRemove(ctx.params.id)
        if (!user) { ctx.throw(404) }
        ctx.status = 204
    }

    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', require: true },
            password: { type: 'string', require: true }
        })
        const user = await User.findOne(ctx.request.body)
        if (!user) { ctx.throw(401, '用户名密码不正确') }
        const { name, _id } = user
        const token = jsonwebtoken.sign({ name, _id }, tokenSecret, { expiresIn: '24h' })
        ctx.body = { token }
    }

    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if (!user) ctx.throw(404, '用户不存在')
        ctx.body = user.following
    }

    async listFollowers(ctx) {
        const users = await User.find({ following: ctx.params.id })
        ctx.body = users
    }

    async checkUserExist(ctx) {
        // 待修复
        // console.log(mongoose.Types.ObjectId.isValid(ctx.params.id))
        const user = await User.findById(ctx.params.id)
        if (!user) ctx.throw(404, '用户不存在！')
        await next()
    }

    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.following.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }

    async followTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
            me.followingTopics.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async unfollowTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.followingTopics.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }

    async listFollowingTopics(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
        if (!user) ctx.throw(404, '用户不存在')
        ctx.body = user.followingTopics;
    }
}

module.exports = new Users()