const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const { tokenSecret } = require('../../config')

class Users {
    async find(ctx) {
        ctx.body = await User.find()
    }

    async fundById(ctx) {
        const user = await User.findById(ctx.params.id)
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
            password: { type: 'string', required: false }
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
        const token = jsonwebtoken.sign({ name, _id }, tokenSecret, { expiresIn: '1h' })
        ctx.body = { token }
    }
}

module.exports = new Users()