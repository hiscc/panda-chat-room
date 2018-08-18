import { doLogin, checkLogin } from '../../services/user';
import { login, getUserInfo, p, checkSession, showToast } from '../../utils/utils'
Page({

  data: {
    loginStatus: false,
    avatarUrl: '../../imgs/me_0.png',
    nickName: '',
  },

  login() {
    const { avatarUrl, loginStatus, nickName} = this.data
    doLogin().then(res => {
      console.log(res)
      const userInfo = res.data.userInfo
      const {nickName: n, avatarUrl:a } = userInfo
      this.setData({ loginStatus: true, avatarUrl: a, nickName: n})
      showToast({ msg: '注册登录成功', status: 1 })
    }).catch(err => {
      console.log('no auth')
      showToast({ msg: '请注册登录' })
    })
  },
  onLoad: function (options) {
    const that = this
    const { avatarUrl, loginStatus, nickName } = this.data
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        let data = res.data
        const {nickName: n, avatarUrl: a} = data
        that.setData({ loginStatus: true, avatarUrl: a, nickName: n })
      },
    })
  },

  onReady: function () {
  
  },


  onShow: function () {
  
  },


  onHide: function () {
  
  },

  onUnload: function () {
  
  },


  onPullDownRefresh: function () {
  
  },


  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})