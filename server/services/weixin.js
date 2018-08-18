const rp = require('request-promise')
const md5 = require('md5')
const crypto = require('crypto')
const config = require('../config')
const tenpay = require('tenpay')


async function decryptUserInfoData(sessionKey, encryptedData, iv) {
  // base64 decode
  const _sessionKey = Buffer.from(sessionKey, 'base64');
  encryptedData = Buffer.from(encryptedData, 'base64');
  iv = Buffer.from(iv, 'base64');
  let decoded = '';
  try {
    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', _sessionKey, iv);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedData, 'binary', 'utf8');
    decoded += decipher.final('utf8');

    decoded = JSON.parse(decoded);
  } catch (err) {
    return '';
  }

  if (decoded.watermark.appid !== config.appId) {
    return '';
  }

  return decoded;
}


const wpayConfig = {
  appid: config.appId,
  mchid: config.mch_id,
  partnerKey: config.partner_key,
  notify_url: config.notify_url,
  spbill_create_ip: '127.0.0.1',
}

const wpay =  tenpay.init(wpayConfig)


module.exports = {
  decryptUserInfoData,
  // createUnifiedOrder,
  wpay,
}

//
// async function createUnifiedOrder(payInfo){
//   const WeiXinPay = require('weixinpay')
//   const weixinpay = new WeiXinPay({
//     appid: config.appId,
//     openid: payInfo.openId,
//     mch_id: config.mch_id,
//     partner_key: config.partner_key,
//   })
//
//   return new Promise((resolve, reject) => {
//     weixinpay.createUnifiedOrder({
//       body: payInfo.body || '付款测试',
//       out_trade_no: payInfo.out_trade_no || '20180704',
//       total_fee: payInfo.total_fee || 0.01,
//       spbill_create_ip: payInfo.spbill_create_ip || '127.0.0.1',
//       notify_url: config.notify_url,
//       trade_type: 'JSAPI'
//     }, (res) => {
//       if (res.return_code === 'SUCCESS' && res.result_code === 'SUCCESS') {
//         const returnParams = {
//           'appid': res.appid,
//           'timeStamp': parseInt(Date.now() / 1000) + '',
//           'nonceStr': res.nonce_str,
//           'package': 'prepay_id=' + res.prepay_id,
//           'signType': 'MD5',
//         };
//         const paramsStr = `appId=${returnParams.appid}&nonceStr=${returnParams.nonceStr}&package=${returnParams.package}&signType=${returnParams.signType}&timeStamp=${returnParams.timeStamp}&key=` + config.partner_key
//
//         returnParams.paySign = md5(paramsStr).toUpperCase()
//         resolve(returnParams)
//       } else {
//         reject(res)
//       }
//     })
//   })
// }
