const Answer = require('../models/Answers')

class AnswerController {
    async create(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
            questionId: { type: 'string', required: true }
        })

        const Answer = await new Answer({
            ...ctx.request.body,
            Answerer: ctx.state.user._id,
            questionId: ctx.params.questionId
        }).save()
        ctx.body = Answer
    }

    async delete(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id)
        ctx.status = 204
    }

    async find(ctx) {
        const { per_page = 10, page = 1 } = ctx.query
        const pages = Math.max(page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Answer
            .find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage)
            .skip(pages * perPage)
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query
        const selectFields = fields.split(';').filter(v => v).map(v => ' +' + v).join('')
        const Answer = await Answer.findById(ctx.params.id).select(selectFields).populate('Answerer')
        ctx.body = Answer
    }

    async update(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: false }
        })
        await ctx.state.Answer.update(ctx.request.body)
        ctx.body = ctx.state.Answer // 更新前的，可以在这里合并返回最新的
    }

    async checkAnswerExist(ctx, next) {
        const Answer = await Answer.findById(ctx.params.id).select('+Answerer')
        if (!Answer) {
            ctx.throw(404, '答案不存在！')
        }
        if (ctx.params.questionId && ctx.params.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有子答案')
        }
        ctx.state.Answer = Answer
        await next()
    }

    // 保证操作人权限
    async checkAnswerer(ctx, next) {
        const { Answer, user } = ctx.state
        if (Answer.Answerer.toString() !== user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
}

module.exports = new AnswerController()