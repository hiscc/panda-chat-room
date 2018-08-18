const Router = require('koa-router')
const user = new Router()
const User = require('../controllers/user')
const doLogin = require('../middlewares/doLogin')
const koaBody = require('koa-body')

user.post('/login', doLogin, User.login)

user.get('/new', User.new)
user.get('/all',  User.findAll)


module.exports = user
