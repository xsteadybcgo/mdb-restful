const Router = require('@koa/router')
const jwt = require('koa-jwt')
const { tokenSecret } = require('../../config')
const {
    find,
    findById,
    create,
    updateById,
    checkTopicExist,
    listFollowers
} = require('../controllers/topics')

const router = new Router({ prefix: '/topics' })

const auth = jwt({ secret: tokenSecret })

router.get('/', find)

router.post('/', auth, create)

router.get('/:id', checkTopicExist, findById)

router.patch('/:id', auth, checkTopicExist, updateById)

// 获取话题粉丝列表
router.get('/:id/followers', checkTopicExist, listFollowers)

module.exports = router