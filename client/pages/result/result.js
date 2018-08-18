// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        pic: 'http://yanxuan.nosdn.127.net/d5d41841136182bf49c1f99f5c452dd6.png',
        title: '趣味粉彩系列记忆棉坐垫趣味粉趣味粉彩',
        id: 10,
        price: 122,
        count: 1,
        checked: false,
      },
      {
        pic: 'http://yanxuan.nosdn.127.net/d5d41841136182bf49c1f99f5c452dd6.png',
        title: '趣味粉彩系列记忆棉坐垫趣味粉趣味粉彩',
        id: 20,
        price: 122,
        count: 2,
        checked: true,
      },
    ],
  },

  remove(e) {
    console.log(e)
    let { id } = e.currentTarget.dataset
    let { items } = this.data
    const that = this
    wx.showActionSheet({
      itemList: ['删除此商品'],
      success(res) {
        if (res.tapIndex === 0) {
          const index = items.findIndex(item => {
            return item.id === id
            console.log(item.id)
          })
          items.splice(index, 1)
          that.setData({ items })
          wx.showToast({
            title: `删除成功`,
          })
        }
      },
    })
  },
  onLoad: function (options) {
  
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