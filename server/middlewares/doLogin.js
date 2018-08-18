const rp = require('request-promise')
const crypto = require('crypto')
const config = require('../config')
const weixin = require('../services/weixin')
const token = require('../services/token')

// 封装一个登陆中间件，用于向微信服务器换取用户信息
async function doLogin(ctx, next) {

    const {
      code,
      userInfo,
    } = ctx.request.body


    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: {
        grant_type: 'authorization_code',
        js_code: code,
        appid: config.appId,
        secret: config.appSecrct,
      }
    }

    let sessionData = await rp(options)
    sessionData = JSON.parse(sessionData)
    console.log(sessionData)

    if (!sessionData.openid) {
      throw Error('登录失败 openid')
    }

    //校验对比用户信息
    const sha1 = crypto.createHash('sha1').update(userInfo.rawData + sessionData.session_key).digest('hex');
    if (userInfo.signature !== sha1) {
      throw Error('登录失败 sha1')
    }
    const weixinUserInfo = await weixin.decryptUserInfoData(sessionData.session_key, userInfo.encryptedData, userInfo.iv);

    // 把用户信息挂载在 ctx.state 下以便在 login 路由上使用
    ctx.state.user = {
      userInfo: weixinUserInfo
    }
    return next()

}


module.exports = doLogin
