const Router = require('@koa/router')
const jwt = require('koa-jwt')
const { tokenSecret } = require('../../config')
const {
    find,
    findById,
    create,
    updateById
} = require('../controllers/topics')

const router = new Router({ prefix: '/topics' })

const auth = jwt({ secret: tokenSecret })

router.get('/', find)

router.get('/:id', findById)

router.post('/', auth, create)

router.patch('/:id', auth, updateById)


module.exports = router