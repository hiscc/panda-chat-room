const Router = require('koa-router')
const router = new Router()
const user = require('./user')
const order = require('./order')

// 总路由配置
router.use('/user', user.routes())
router.use('/order', order.routes())

module.exports = router
