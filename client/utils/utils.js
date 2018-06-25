import {doLogin} from '../services/user'

// login 函数，用于获取 code
function login(){
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
          resolve(res)
      },
      fail:  (err) => {
        reject(err)
      },
    })
  })
}

// getUserInfo 函数，用于获取用户信息
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

//  网络请求函数，封装微信请求
//  某些路由需要更高的安全性需要强制校验「后台与微信服务器登录校验，用于校验当前用户是否被伪造」，login 参数默认为 false
function p({url, data = {}, method="GET", login = false}){
  if(login){
    return doLogin().then(() => {
      return p({url, data, method})
    })
  } else {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method,
        data: data,
        header: {
          'Content-Type': 'application/json',
          'accessToken': wx.getStorageSync('accessToken'),
        },
        success: (res) => {
          resolve(res)
          console.log(res)
        },
        fail: (err) => {
          reject(err)
          console.log(err)
        }
      })
    })
  }

}

// 登录态检查函数，用于判定小程序端的 session 是否过期
function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 通用指示器
function showToast({msg, status = 0}) {
  let icon = status ? 'success' : 'loading'
  wx.showToast({
    title: msg,
    icon: icon,
    duration: 1000,
    // image: '/static/images/icon_error.png'
  })
}


export { login, getUserInfo, p, checkSession, showToast}