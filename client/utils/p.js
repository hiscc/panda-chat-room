import { doLogin } from '../services/user'

//  网络请求函数，封装微信请求
//  某些路由需要更高的安全性需要强制校验「后台与微信服务器登录校验，用于校验当前用户是否被伪造」，login 参数默认为 false
function p({ url, data = { }, method = "GET", login = false }) {
  if (login) {
    return doLogin().then((user) => {
      return p({ url, data, method })
    })
  } else {
    return new Promise((resolve, reject) => {
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
          // console.log(res)
        },
        fail: (err) => {
          reject(err)
          // console.log(err)
        }
      })
    })
  }

}

export default p