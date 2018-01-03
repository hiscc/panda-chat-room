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
