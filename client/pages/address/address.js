// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    province: '',
    street: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let address = options
  },

  nameFirm(e) {
    let { name } = this.data
    let nameInput = e.detail.value
    console.log(e)
    this.setData({ name: nameInput })
  },
  phoneFirm(e) {
    let { phone } = this.data
    let phoneInput = e.detail.value
    console.log(e)
    this.setData({ phone: phoneInput })
  },
  provinceFirm(e) {
    let { province } = this.data
    let provinceInput = e.detail.value
    console.log(e)
    this.setData({ province: provinceInput })
  },
  streetFirm(e) {
    let { street } = this.data
    let streetInput = e.detail.value
    console.log(e)
    this.setData({ street: streetInput })
  },
  save() {
    let { name, phone, province, street } = this.data
    console.log(this.data)
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