const Models = require('../models/index.js')
const token = require('../services/token')

// Models 模型为用户表基本数据结构， token 暴露出 token 相关的加密解密方法
// 用户相关的操作逻辑封装在此控制器内， login 路由会同时处理小程序端的注册与登录操作
// 依据 sequelize 的 findOrCreate 方法来实现注册或登录
module.exports = {
    login: async (ctx) => {
        const { userInfo } = ctx.state.user
        await Models.User.findOrCreate({where: {openId: userInfo.openId},
          defaults: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            country: userInfo.country,
            province: userInfo.province,
            city: userInfo.city,
            gender: userInfo.gender,
            language: userInfo.language,

            openId: userInfo.openId,
            unionId: userInfo.unionId,
          }
        }).spread((user) => {
          const userInfo = {
            nickName: user.nickName,
            avatarUrl: user.avatarUrl,
            userId: user.id
          }
          const accessToken = token.create(userInfo)
          ctx.body = {userInfo, accessToken}
          console.log(userInfo)
        })
    },


    new: async (ctx) => {
        // const user = await Models.User.create({
        //     name: ctx.params.id
        // })
        // console.log(ctx.query)
        ctx.body = 'userInfo'
    },
    findAll:  async (ctx) => {
        const users = await Models.User.findAll()
        ctx.body = users
    }
}
