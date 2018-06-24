// const rp = require('request-promise');
const crypto = require('crypto');
const config = require('./config')

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


module.exports = {
  decryptUserInfoData
}
