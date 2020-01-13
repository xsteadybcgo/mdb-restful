const Topic = require('../models/topics')
const User = require('../models/users')
const Question = require('../models/questions')

class Topics {
    async find(ctx) {
        const { per_page = 10, page = 1 } = ctx.query
        const pages = Math.max(page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        ctx.body = await Topic.find()
            .limit(perPage)
            .skip(pages * perPage)
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query
        const selectTopics = fields.split(';').filter(v => v).map(v => ' +' + v).join('')
        const topic = await Topic.findById(ctx.params.id).select(selectTopics)
        ctx.body = topic
    }

    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const topic = await new Topic(ctx.request.body).save()
        ctx.body = topic
    }

    async updateById(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        ctx.body = topic // 更新前的，可以在这里合并返回最新的
    }

    async checkTopicExist(ctx, next) {
        const topic = await Topic.findById(ctx.params.id)
        if (!topic) { ctx.throw(404, '话题不存在！') }
        await next()
    }

    async listFollowers(ctx) {
        const users = await User.find({ followingTopics: ctx.params.id })
        ctx.body = users
    }

    async listQuestions(ctx) {
        const question = await Question.find({ topics: ctx.params.id })
        ctx.body = question
    }
}

module.exports = new Topics()