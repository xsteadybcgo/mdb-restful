const Router = require('@koa/router')
// const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
const { tokenSecret } = require('../../config')
const { find, fundById, create, updateById, deleteById, login, checkOwner } = require('../controllers/users')

const router = new Router({ prefix: '/users' })

// const auth = async (ctx, next) => {
//     const { authorization = '' } = ctx.request.header
//     const token = authorization.replace('Bearer ', '')
//     try {
//         const user = jsonwebtoken.verify(token, tokenSecret)
//         ctx.state.user = user;
//     } catch (error) {
//         ctx.throw(401, error.message)
//     }
//     await next()
// }

const auth = jwt({ secret: tokenSecret })

router.get('/', find)

router.get('/:id', fundById)

router.post('/', create)

router.patch('/:id', auth, checkOwner, updateById)

router.delete("/:id", auth, checkOwner, deleteById)

router.post('/login', login)

module.exports = router