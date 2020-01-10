const Router = require('@koa/router')
const jwt = require('koa-jwt')
const { tokenSecret } = require('../../config')
const {
    find,
    findById,
    create,
    updateById,
    deleteById,
    login,
    checkOwner,
    listFollowing,
    listFollowers,
    checkUserExist,
    follow,
    unfollow
} = require('../controllers/users')

const router = new Router({ prefix: '/users' })

const auth = jwt({ secret: tokenSecret })

router.get('/', find)

router.get('/:id', findById)

router.post('/', create)

router.patch('/:id', auth, checkOwner, updateById)

router.delete("/:id", auth, checkOwner, deleteById)

router.post('/login', login)

router.get('/:id/following', listFollowing)

router.get('/:id/followers', listFollowers)

router.put('/following/:id', auth, checkUserExist, follow)

router.delete('/following/:id', auth, checkUserExist, unfollow)

module.exports = router