const Question = require('../models/questions')
const User = require('../models/users')

class QuestionController {
    async create(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false }
        })
        const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save()
        ctx.body = question
    }

    async delete(ctx) {
        await Question.findByIdAndRemove(ctx.params.id)
        ctx.status = 204
    }

    async find(ctx) {
        const { per_page = 10, page = 1 } = ctx.query
        const pages = Math.max(page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Question
            .find({ $or: [{ title: q }, { description: q }] })
            .limit(perPage)
            .skip(pages * perPage)
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query
        const selectFields = fields.split(';').filter(v => v).map(v => ' +' + v).join('')
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
        ctx.body = question
    }

    async update(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: false },
            description: { type: 'string', required: false }
        })
        await ctx.state.question.update(ctx.request.body)
        ctx.body = ctx.state.question // 更新前的，可以在这里合并返回最新的
    }

    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner')
        if (!question) { ctx.throw(404, '问题不存在！') }
        ctx.state.question = question
        await next()
    }

    // 保证操作人权限
    async checkQuestioner(ctx, next) {
        const { question, user } = ctx.state
        if (question.questioner.toString() !== user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
}

module.exports = new QuestionController()