// pages/goodDetail/index.js
var WxParse = require('../../lib/wxParse/wxParse.js');
Page({

  data: {
    id: 55,
    pic: 'http://yanxuan.nosdn.127.net/d5d41841136182bf49c1f99f5c452dd6.png',
    title: '趣味粉彩系列记忆棉坐',
    subTitle: '趣味粉彩系列记忆棉坐垫趣味粉彩系列记忆棉坐垫',
    price: 98,
    count: 1,
    checked: true,

    sel: 0,
    goodDetail: 'fd',
  },
  selType(e){
    console.log(e)
    let {sel} = this.data
    const type = e.currentTarget.dataset.type
    this.setData({sel: type})
  },
  selNumber(e){
    let { count } = this.data
    const type = e.currentTarget.dataset.operate
    
    switch (type){
      case 'plus':
      this.setData({count: count + 1})
      break;
      case 'minus':
        count > 1 ? this.setData({ count: count - 1 }): count
        break;
    }
  },
  countInput(e){
    let { count } = this.data
    const counts = e.detail.value
    this.setData({ count: counts })
  },
  countFirm(e){
    let { count } = this.data
    const counts = e.detail.value
    ~~counts == 0 ? this.setData({count: 1}): this.setData({count: ~~counts}) 
  },
  star(){
    wx.showToast({
      title: '收藏成功',
    })
  },
  buy(){
    wx.navigateTo({
      url: '../../pages/buy/buy',
    })
  },
  lookup(){
    wx.switchTab({
      url: '../../pages/cart/cart',
    })
  },

  addCart(){
    let cart = wx.getStorageSync('cart') || []
    let {id, pic, title, subTitle, price, count, checked} = this.data
    let newitem = { id, pic, title, subTitle, price, count, checked} 
    cart.push(newitem)
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入购物车成功',
      duration: 500,
    })
    this.loadCart()
  },
  loadCart(){ 
    let cartCount = this.data
    let cart = wx.getStorageSync('cart') || []
    let cartall = cart.reduce((acc, val) => {
        return acc += val.count
    }, 0)
    this.setData({ cartCount: cartall})
  },
  onLoad: function (options) {
    console.log(options)
    const {id, price} = options
    this.setData({id: ~~id, price: ~~price})
    this.loadCart()
    var article = `<p><img src="http://yanxuan.nosdn.127.net/3b31b3c57a7d7f42b13711bd1438d555.jpg" _src="http://yanxuan.nosdn.127.net/3b31b3c57a7d7f42b13711bd1438d555.jpg" style=""/></p><p><img src="http://yanxuan.nosdn.127.net/e92d9bad2a0339a81b47835f5530a358.jpg" _src="http://yanxuan.nosdn.127.net/e92d9bad2a0339a81b47835f5530a358.jpg" style=""/></p><p><img src="http://yanxuan.nosdn.127.net/edabc81fa6c7e66fe1698949f3b2b9f4.jpg" _src="http://yanxuan.nosdn.127.net/edabc81fa6c7e66fe1698949f3b2b9f4.jpg" style=""/></p><p><img src="http://yanxuan.nosdn.127.net/3444f640ec6ff6d6a8bcc3ce0f28848f.jpg" _src="http://yanxuan.nosdn.127.net/3444f640ec6ff6d6a8bcc3ce0f28848f.jpg" style=""/></p><p><img src="http://yanxuan.nosdn.127.net/317ebb6f899631d1ed52759c14170a39.jpg" _src="http://yanxuan.nosdn.127.net/317ebb6f899631d1ed52759c14170a39.jpg" style=""/></p><p><img src="http://yanxuan.nosdn.127.net/8f17af0ae3d56d482cec4105d390730a.jpg" _src="http://yanxuan.nosdn.127.net/8f17af0ae3d56d482cec4105d390730a.jpg" style=""/></p><p><img src="http://yanxuan.nosdn.127.net/345a9aba507ca86b34c37c29956eeb83.jpg" _src="http://yanxuan.nosdn.127.net/345a9aba507ca86b34c37c29956eeb83.jpg" style=""/></p><p><img src="http://yanxuan.nosdn.127.net/38b5c26064c4ea16ce3380bd69d2a671.jpg" _src="http://yanxuan.nosdn.127.net/38b5c26064c4ea16ce3380bd69d2a671.jpg" style=""/></p>`
;
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    // var that = this;
    WxParse.wxParse('article', 'html', article, this, 0);
    // this.setData({ article})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // wx.showToast({
      //   title: '分享成功',
      // })
      console.log(res)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }
})