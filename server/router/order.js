const Router = require('koa-router')
const order = new Router()
const Order = require('../controllers/order')
const doLogin = require('../middlewares/doLogin')

order.post('/upload',  Order.upload)
order.get('/pay',  Order.pay)
order.get('/find/:id', Order.find)



module.exports = order
