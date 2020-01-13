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
    unfollow,
    followTopic,
    unfollowTopic,
    listFollowingTopics,
    listQuestions,
    likeAnswer,
    unlikeAnswer,
    listLikingAnswers,
    dislikeAnswer,
    undislikeAnswer,
    listDislikingAnswers,
    collectAnswer,
    uncollectAnswer,
    listCollectingAnswers
} = require('../controllers/users')

const { checkTopicExist } = require('../controllers/topics')
const { checkAnswerExist } = require('../controllers/answers')
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

router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)

router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)

router.get('/:id/followingTopics', listFollowingTopics)

router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer)

router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer)

router.get('/:id/likingAnswers', listLikingAnswers)

router.put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer)

router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer)

router.get('/:id/dislikingAnswers', listDislikingAnswers)

router.get('/:id/questions', listQuestions)

router.put('/collectingAnswers/:id', auth, checkAnswerExist, collectAnswer)

router.delete('/collectingAnswers/:id', auth, checkAnswerExist, uncollectAnswer)

router.get('/:id/listcollectingAnswers', listCollectingAnswers)


module.exports = router