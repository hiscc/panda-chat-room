//app.js
const AV = require('./libs/av')
const wafer = require('./vendors/wafer-client-sdk/index')
// 引入 leanCloud 支持文件储存 https://leancloud.cn/docs/weapp.html#hash799103847
AV.init({
  appId: 'wjwHIjxzCiO2c1QO50HMevCh-gzGzoHsz',
  appKey: 'M3fajs4ucerUF62BKyGUXInj',
})
App({
    config: {
      host: '84249706.poooooo.club'
    },
    globalData: {
      user: "hello it's me"
    }
});
