const app = getApp();
const config = app.config;
const wafer = require('../../vendors/wafer-client-sdk/index');
const AV = require('../../libs/av')

Page({
  data: {
    animate: true,
    num: 0,
    btnStatus: 'connect',
    url: 'wss://' + config.host + '/ws',
    mm: '',
    state: '点击 connect 开始聊天',
    conversations: [],
    user: {},
  },
  // 页面载入检查本地 session， 用来检查到底使哪个 session 过期了
  onShow(){
    this.connect()
    // wafer.request({
    //   url: `https://${config.host}/me`,
    //   success(res){
    //     console.log(res)
    //   },
    //   error(err){
    //     console.log(err)
    //   }
    // })
    // wx.checkSession({
    //   success: function () {
    //     console.log('success session')
    //   },
    //   fail: function () {
    //     console.log('outdate session')
    //     this.login()
    //   }
    // })
  },
  sendImg(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('panda-chat', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            let msg = {}
            msg.url = file.url()
            msg.gallery = true
            wx.sendSocketMessage({
              data: JSON.stringify(msg),
              success() {
                console.info('img success')
              },
              fail() {
                console.info('img fail')
              }
            })
          }
          ).catch(console.error);
      }
    })
  },
  socketOpen: false,
  send() {
    let msg = {}
    const mm = this.data.mm
    if (mm == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'loading',
        duration: 1000
      })
      return false
    }

    let that = this
    msg.content = mm
    msg = JSON.stringify(msg)
    wx.sendSocketMessage({
      data: msg,
      success() {
        that.setData({ mm: '' })
      },
      fail() {
        console.log('send msg fail')
      }
    });

  },
  // 封装所有信息更新操作
  pushMsg(msg, ad) {
    let conversations = this.data.conversations
    let num = this.data.num

    conversations.push(msg)
    this.setData({ conversations })
    num = ad
    this.setData({ num: ad })
  },

  // 绑定输入值到 mm
  bindKeyInput({ detail: { value } }) {
    let mm = this.data.mm
    this.setData({ mm: value })
  },

  // 连接按钮点击逻辑
  connect() {
    this.setData({
      connecting: true,
      state: '.....'
    });
    this.listen()
    this.login()
    this.setData({ btnStatus: 'success' })
  },

  // 监听所有 WebSockets 信息
  listen() {
    const that = this
    // 监听连接，在 Websockets 开启时更新状态
    wx.onSocketOpen(() => {
      this.socketOpen = true;
      this.setData({
        connecting: false,
        state: 'WebSocket 连接成功'
      });
      console.info('WebSocket 已连接');
    });

    // 监听服务器发来的所有信息，Websockets 信息编码为 JSON ，需要在客户端解码
    wx.onSocketMessage((message) => {
      message.data = JSON.parse(message.data)
      // 服务器端 session 会有过期时间「默认 24 小时」， 而本地 session 未过期导致 session 不一致，我们需要清除 session 重新请求
      if(message.data.error){
        wafer.clearSession()
        that.login()
      }
      this.pushMsg(message.data, message.data.id)
    });

    // 监听关闭，在 Websockets 关闭时更新状态
    wx.onSocketClose((res) => {
      this.setData({ btnStatus: 'connect', state: 'WebSocket 连接断开' })
      console.info('WebSocket 已关闭');
      console.log(res)
    });
    // 监听错误，在 Websockets 发生错误时更新状态
    wx.onSocketError(() => {
      setTimeout(() => {
        this.setData({
          state: 'WebSocket 连接建立失败',
          btnStatus: 'connect'
        });
      });
      console.error('WebSocket 错误');
    });
  },

  // 客户端登录使服务器获取 session 
  login() {
    wafer.setLoginUrl(`https://${config.host}/login`)

    wafer.login({
      success: () => {
        const header = wafer.buildSessionHeader();
        const query = Object.keys(header).map(key => `${key}=${encodeURIComponent(header[key])}`).join('&');
        wx.connectSocket({
          url: `${this.data.url}?${query}`,
          header
        });
      },
      fail: (err) => {
        this.setData({
          state: err.message || err
        });
      }
    })
  },

  // 可手动选择关闭连接
  close() {
    this.socketOpen = false;
    wx.closeSocket();
  },
  onShareAppMessage: function (res) {
    return {
      title: '熊猫 WebSockets 聊天室',
      path: '/pages/chat/chat',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});