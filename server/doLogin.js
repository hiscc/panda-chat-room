const rp = require('request-promise');
const crypto = require('crypto');
const config = require('./config')
const weixin = require('./weixin')
const token = require('./token')

// 封装一个登陆中间件，用于向微信服务器换取用户信息
async function doLogin(ctx, next) {
  if (ctx.url === '/login') {

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

    if (!sessionData.openid) {
      throw Error('登录失败 openid')
    }

    const sha1 = crypto.createHash('sha1').update(userInfo.rawData + sessionData.session_key).digest('hex');
    if (userInfo.signature !== sha1) {
      throw Error('登录失败 sha1')
    }
    const weixinUserInfo = await weixin.decryptUserInfoData(sessionData.session_key, userInfo.encryptedData, userInfo.iv);

    const sessionKey = await token.create(weixinUserInfo)

    ctx.state.user = {
      accessToken: sessionKey,
      userInfo: weixinUserInfo
    }
    return next()

  } else {
    next()
  }
}


module.exports = doLogin
