import p from '../utils/p';
import {
  config
} from '../config.js';

function pay({
  url,
  data = {},
  method = "POST",
  login = false
}) {
  return new Promise((resolve, reject) => {
    p({
      url: url,
      method: method,
      data: data,
      login: true
    }).then(res => {
      const data = res.data
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        'success': function(res) {
          resolve(res);
        },
        'fail': function(res) {
          reject(res);
        },
        'complete': function(res) {
          reject(res);
        }
      })
    })
  })
}

export default pay