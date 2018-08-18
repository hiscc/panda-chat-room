// pages/order/order.js
Page({

  data: {
    status: 100,
  },

  onLoad: function (options) {
    console.log(options)
    let status = this.data.status
    let type = options.type
    switch(type){
      case "orderwaitpay":
        this.setData({ status: 100 })
      break
      case "orderwaitget":
        this.setData({ status: 200 })
        break
      default:
        this.setData({ status: 300 })
    }

  },


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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})