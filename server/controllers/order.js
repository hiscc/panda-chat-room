const Models = require('../models/index.js')
const weixin = require('../services/weixin.js')

module.exports = {
    pay: async (ctx) => {
        payInfo = {
            body: 'product msg',
            out_trade_no: '6number',
            total_fee: 1,
            spbill_create_ip: '127.0.0.2',
            openid: 'owVRN5eiC4hBSrkteGAFOh2gKfEU',
        }

        const payParams = await weixin.wpay.getPayParams(payInfo)
        ctx.body = payParams
    },
    find: async (ctx) => {
        const id = ctx.params.id
        payInfo = {
            // body: 'product msg',
            out_trade_no: `${id}number`,
            // total_fee: 1,
            // spbill_create_ip: '127.0.0.1',
            // openId: 'owVRN5eiC4hBSrkteGAFOh2gKfEU',
        }
        const order = await weixin.wpay.orderQuery(payInfo)
        console.log(order)
        ctx.body = order
    },
    upload: async (ctx) => {
        console.log(ctx.request.files)
        // console.log(ctx.request.body.fields)
        // ctx.body = 'fdfd'
    }
}
