const jwt = require('jsonwebtoken')
const config = require('../config')
const secret = config.jwtpassword

// 解析 accessToken 来获取数据库中用户的 id，需要配合数据库
function getUserId(accessToken = '') {
  if (!accessToken) {
    return 0
  }

  const result = parse(accessToken)

  if (!result.userId) {
    return 0
  }
  return result.userId
}

// 创建 jwt
function create(userInfo) {
  const token = jwt.sign(userInfo, secret, )
  return token
}

// 解析 jwt
function parse(token) {
  if (token) {
    try {
      return jwt.verify(token, secret)
    } catch (err) {
      return null
    }
  }
  return null
}

// 验证 jwt
async function verify(token) {
  const result = await parse(token)
  if (!result) {
    return false
  }

  return true
}


module.exports = {
  getUserId,
  create,
  parse,
  verify,
}
