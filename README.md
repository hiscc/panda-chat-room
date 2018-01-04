# panda-chat-room
小程序版 websocket 聊天室。 从服务器到小程序客户端配置基础教程。

在本教程内我们将在小程序内实现一个基本的 websocket 聊天室， 计划实现以下功能：

1. 微信用户登录「 小程序 session 管理 」☑️
1. 用户间文本交流 「 websocket 实现 」☑️
1. 用户间发送图片等富媒体信息 「 文件的储存及相关逻辑 」
1. 其它好玩儿的东西

## 此分支为小程序端基础配置教程
查看服务器端配置可以切换到 server 分支

``git checkout server``

我们在此先要理解小程序端为何无法实现 session， 以及如何在小程序实现 websocket 连接。

小程序并非嵌套在微信内的 html5 网页， 它并不是从 url 访问到的。 我们只能自己实现类似会话的东西， 好在官方已经提供了相应的套件来实现 session。 即 [wafer-client-sdk](https://github.com/tencentyun/wafer-client-sdk) 和 node 中间件 [wafer-node-session](https://github.com/tencentyun/wafer-node-session), 我们依照文档就能简单地实现 session。

在服务器端我们使用了 ws 包来实现 websocket。 没有使用 socket.io 的原因是 socket.io 需要客户端有额外的脚本才能实现通信。


在小程序端我们也引入 wafer-client-sdk 套件使服务器可以获取 session。

主要逻辑分为几个简单函数， 当然你需要先配置请求的服务器域名和小程序账号密码。

````js
// 引入 session 套件， 里面封装了 wx.login， wx.getUserInfo 等操作
const wafer = require('../../vendors/wafer-client-sdk/index')

// 用于登录使服务器获得 session， 然后服务器返回的 session 里就会包含用户信息了， 用来在 websocket 里返回发信息用户的头像 url
function login(){
  .....
}

// 用于有新信息时更新数据， msg 指信息， ad 指 websocket 传回的信息 id， 用于 scroll-into-view 滚动
pushMsg(msg, ad) {
  .....
}

// 用于监听 websocket 连接
listen(){
  .....
}

//  用于小程序发送 websocket 信息
send(){
  .....
}
````

基本就是这些， 关于 websocket 通信过程是这样的：

1. 客户端发送信息给服务器 m1
1. 服务器收到信息后根据条件返回给客户端 m2
1. 每个客户端收到 m2 后更新视图

当然最开始是要与服务器端 websocket 连接的， 只有每个连接了的客户端才可以交流信息。
