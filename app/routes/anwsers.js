const Router = require('@koa/router')
const jwt = require('koa-jwt')
const { tokenSecret } = require('../../config')
const {
    find,
    findById,
    create,
    update,
    checkAnswerExist,
    checkAnswerer,
    delete: del
} = require('../controllers/answers')

const router = new Router({ prefix: '/questions/:questionId/answers' })

const auth = jwt({ secret: tokenSecret })

router.get('/', find)

router.post('/', auth, create)

router.get('/:id', checkAnswerExist, findById)

router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update)

router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del)

module.exports = router