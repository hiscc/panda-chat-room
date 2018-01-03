const express = require('express')

// 引入 http 同时监听 express 和 websocket 的请求
const http = require('http')

// 微信小程序在 node 端的 session 实现中间件
const waferSession = require('wafer-node-session')

// 连接 mongodb 的中间件
const MongoStore = require('connect-mongo')(waferSession)

// 所有配置文件
const config = require('./config')
// 所有 websocket 实现
const websocket = require('./websocket')

const app = express()

// 独立出会话中间件给 express 和 ws 使用
const sessionMiddleware = waferSession({
    appId: config.appId,
    appSecret: config.appSecret,
    loginPath: '/login',
    store: new MongoStore({
        url: `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`
    })
})
app.use(sessionMiddleware)


// 实现一个中间件，对于未处理的请求，都输出 「请求来自 node」
app.use((req, res, next) => {
    res.end('请求来自 node')
});

// 创建 HTTP 服务
const server = http.createServer(app)

// 让 WebSocket 监听 http
websocket.listen(server, sessionMiddleware)

// 启动 HTTP 服务
server.listen(config.serverPort)

// 输出服务器启动日志
console.log(`Server listening at http://127.0.0.1:${config.serverPort}`)
