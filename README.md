# panda-chat-room
小程序版 websocket 聊天室。 从服务器到小程序客户端配置基础教程。

在本教程内我们将在小程序内实现一个基本的 websocket 聊天室， 计划实现以下功能：

1. 微信用户登录「 小程序 session 管理 」☑️
1. 用户间文本交流 「 websocket 实现 」☑️
1. 用户间发送图片等富媒体信息 「 文件的储存及相关逻辑 」☑️
1. 其它好玩儿的东西

## 此分支为服务器端基础配置教程

在服务器端我们从环境搭建开始，依次安装一些基础软件，配置 nginx 反向代理、 开启 https， 最后构建可用的后端服务。

基于 CentOS 7 操作系统，后端为 NodeJs， 并用 nginx 进行反向代理。 当然你也可以直接在 express 上开启 https， 这里我们试着使用高性能的服务器 nginx 来实现 https 并实现反向代理 「把本地的其它端口映射到服务器的 80 或 443 端口」。

### 1.安装 node、 npm、 nginx 、 mongodb

指定安装 node 8
> curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -

> sudo yum -y install nodejs

> yum install nginx -y

> nginx

安装 mongodb 服务和 mongo 命令行工具
> yum install mongodb-server mongodb -y

设置 mongodb 储存目录
> mkdir -p /data/mongodb

> mkdir -p /data/logs/mongodb

启动 mongodb
> mongod --fork --dbpath /data/mongodb --logpath /data/logs/mongodb/weapp.log



这时就可以启动 nginx 了， 我们在浏览器输入服务器 ip 地址就能看到 nginx 的默认页面了。

### 2.我们在在 CentOS 初始的文件系统内 「/data」创建项目文件夹

> mkdir  /data/weapp && cd /data/weapp

### 3.我们创建配置文件 ``config.js``、 ``app.js``并在 ``config.js`` 内填写小程序的各项配置和数据库的账号密码。

````js
module.exports = {
  serverPort: '8765',
  //换成你自己的小程序账号密码
  appId: 'wx49beb1c106eae363',
  appSecret: '714774d402d2b084371d54cca76901c8',

  // mongodb 数据库账号密码
  mongoHost: '127.0.0.1',
  mongoPort: '27017',
  mongoUser: 'w',
  mongoPass: 'w',
  mongoDb: 'weapp'
}

````

### 4.先在 mongodb 数据库内创建一个用户

> mongo

每条命令后加分号「;」 才有效
> use weapp;

> db.createUser({ user: 'w', pwd: 'w', roles: ['dbAdmin', 'readWrite']});


### 5.安装 express 并编写 ``app.js``

> npm init && npm install express  && touch app.js

[小程序服务端 session 中间件 wafer-node-session](https://github.com/tencentyun/wafer-node-session) 有了这个中间件再配合相应的客户端插件， 小程序就可以实现 session 功能，我们就可以在每个请求内识别登录的用户了。

现在我们搭建基本的 http 服务。

继续安装

> npm install wafer-node-session connect-mongo ws --save

````js


//app.js

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

````

````js
//websocket.js
// 引入 ws 支持 WebSocket 的实现
const WS = require('ws');

// 导出处理方法
exports.listen = listen;


function listen(server, sessionMiddleware) {
    // 创建一个 ws 服务路径为 ／ws
    const wss = new WS.Server({ server, path: '/ws' });

    // 全局变量 id 用于记录信息的 id
    let id = 0

    // 监听 ws 连接
    wss.on('connection', (ws,request) => {

      // 获取 session 信息
        sessionMiddleware(request, null, () => {
            const session = request.session;
            if (!session) {
                ws.send(JSON.stringify(request.sessionError) || "No session avaliable");
                ws.close();
                return;
            }
            console.log(`WebSocket client connected with openId=${session.userInfo.openId}`);

        // num 记录在线客户端的数量
        let num = wss.clients.size

        // 监听客户端发来的每条信息
        ws.on('message', function(message) {

            // 客户端发来的信息已经编码这里进行解码
            message = JSON.parse(message)
            // 信息 id 加一
            id = id + 1

            // 对于所有客户端进行判断， 为了小程序可以分清哪些信息是自己发出的哪些信息是其他人发出的
            wss.clients.forEach(client => {

                // 如果这个客户端不是发信息的客户端， 则标记这条信息为 remote
                if (client !== ws) {
                    message.type = 'remote'
                } else {
                  // 否则标记为 user
                    message.type = 'user'
                }
                // 开始拼接客户端发来的信息

                // 为每条各个客户端发来的信息打 id， 后期用于小程序端的 scroll-into-view 属性的 id， 从而实现有新信息时可以滚动到视窗内
                message.id = id

                // number 用于记录所有在线的客户端数量「用户数量」，number 会附加在每条信息内
                message.number = num
                // 拼接 msg 对象， 再次返回给所有客户端
                let msg = Object.assign({avatarUrl: session.userInfo.avatarUrl}, message)
                // ws 不支持直接发送对象， 我们需要编码成 JSON 再发送
                msg = JSON.stringify(msg)
                // 发送信息给所有客户端
                client.send(msg)
            })

        });

        // 构建一个 message 对象， 在每个新客户端连接的时候直接发送「客户端连接时才发送一次」
        let message = {
            num: num,
            type: 'system'
        }
        message = JSON.stringify(message)
        ws.send(message)
        });


    });
    // 监听错误
    wss.on('error', (err) => {
        console.log(err);
    });

}

````

### 6.配置 nginx 反向代理并开启 https

因为小程序端规定 websocket 需要在 https 之上才能实现， 我们来开启 https。

我们来配置 nginx 设置反向代理。

> cd /etc/nginx/conf.d

> touch ssl.config

> vi ssl.config

不要在 ssl.config 「443」 里开启 websocket， 因为我们的 websocket 是 监听在 http 「80」上的， 所以我们应该在 ``nginx.conf `` 里开启 websocket 才行。

````js
// ssl.config
server {
        listen 443;
        server_name 84249706.poooooo.club; # 我的域名，你需要改为绑定证书的域名

        # ssl 配置

        ssl on;
        ssl_certificate 1_84249706.poooooo.club_bundle.crt;
        ssl_certificate_key 2_84249706.poooooo.club.key; # 改为自己申请得到的 key 文件的名称
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;


        location / {
            # 代理我们的 8765 端口
            proxy_pass http://127.0.0.1:8765;

        }

    }
````

用 ftp 传输工具上传我们的证书到 ``/ect/nginx`` 目录下

接下来我们开启 websocket

我们在 ``etc/nginx/nginx.conf`` 里的 server{ location / {添加如下内容} }

````js
// /etc/nginx/nginx.conf
location / {
    // 添加这些内容
    proxy_pass http://127.0.0.1:8765;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;
}
````
重启 nginx 、 node

> nginx -s reload

> node app

服务器配置完毕


## 注意事项

如果你想依此来构建自己的聊天小程序需要修改小程序端和服务器端的各项配置「小程序安全域名信息、appId、leanCloud 的 appId 和 appKey 以及 leanCloud 文件储存需要的安全域名」

此 demo 中的所有配置信息有可能随时失效

 ****

关于服务器端的配置大家可以参考腾讯云实验室 [基于 CentOS 搭建微信小程序服务](https://cloud.tencent.com/developer/labs/lab/10004), 基本无误， 但在配置 wss 时可能出现 ``shakehand error`` 消息， 是因为 nginx 设置 websocket 的配置文件不对。 因为 websocket 监听的是 http 端口， 所以我们应该在 ``nginx.conf`` 文件里开启 websocket 「具体参考 server 分支下的 ``nginx.conf`` 配置」。
