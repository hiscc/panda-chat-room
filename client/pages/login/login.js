// pages/login/login.js
import { login, getUserInfo, p, checkSession, showToast} from '../../utils/utils'
import { doLogin, checkLogin } from '../../services/user'

import {config} from '../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  login(){
      doLogin().then( res => {
          console.log(res)
          showToast({msg: '注册登录成功', status: 1})
      }).catch(err => {
        console.log('no auth')
        showToast({msg: '请注册登录'})
      })
      // checkSession().then( res => {
      //   console.log(res)
      // })
      // p({
      //   url: config.host,
      // }).then((res) => {
      //   console.log(res)
      // })
  },
  go(){
    // checkLogin().then(res => {
    //   console.log(res)
    // }, err => {
    //   console.log(err)
    // })
      p({
        url: `${config.host}/go`,
        // login: true,
      }).then(res => {
        console.log(res)
      }).catch(err => {
        showToast({ msg: '请注册登录' })
        console.log(err)
      })
  },
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})