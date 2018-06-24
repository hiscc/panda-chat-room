import * as utils from '../utils/utils'
const { config } = getApp()

function doLogin(){
  // 封装登录函数，登录路径为 /login
  // 登录成功设置缓存
  let code = null

  return new Promise( (resolve, reject) => {
    return utils.login().then( res => {
      code = res.code
      return utils.getUserInfo()
    }).then( userInfo => {
      utils.p({
        url: config.host + '/login',
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
      reject(false);
    }
  });
}

export { doLogin, checkLogin}