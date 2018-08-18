import * as utils from '../utils/utils'

import { config } from '../config.js'

function doLogin(){
  // 封装登录函数，登录路径为 /user/login
  // 登录成功,设置缓存
  let code = null

  return new Promise( (resolve, reject) => {
    return utils.login().then( res => {
      code = res.code
      return utils.getUserInfo()
    }).then( userInfo => {
      p({
        url: config.host + '/user/login',
        data: {code: code, userInfo: userInfo},
        method: 'POST',
      }).then( user => {

        wx.setStorageSync('userInfo', user.data.userInfo);
        wx.setStorageSync('accessToken', user.data.accessToken);
          resolve(user)
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
  })
}

function checkLogin() {
  // 检查登录态
  // 从未登录过的返回 false
  // 已经登录过，但是 session 过期的自动重新登录
  // 在 p 请求时已经封装了检查登录的逻辑，所以在以后需要检查登录态的请求时直接修改 p 的 login 参数为 true 即可。
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('accessToken')) {

      utils.checkSession().then(() => {
        resolve(true);
      }, () => {
        doLogin()
        console.log('session outdate')
        reject(false);
      }).catch((err) => {
        console.log('err')
        reject(err);
      });

    } else {
      reject(false)
    }
  });
}
  function p({url, data={}, method='GET'}){
    return new Promise(function(resolve, reject){
      wx.request({
        url: url,
        method: method,
        data: data,
        header: {
          'content-type': 'application/json',
          'accessToken': wx.getStorageSync('accessToken'),
        },
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

export { doLogin, checkLogin}
