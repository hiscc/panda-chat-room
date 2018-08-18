// cops/pay/pay.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    allcount: {
      type: Number,
      value: 0,
    },
    allchecked: {
      type: Boolean,
      value: false,
    },
    allcost: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    checked(){
      let { allchecked, src, allcost } = this.data
      allchecked = !allchecked
      this.setData({allchecked})
      allchecked ? this.setData({ src: '../../imgs/checked.svg' }) : this.setData({ src: '../../imgs/unchecked.svg' })
      this.triggerEvent('checked', {  allon: allchecked })
    },
    pay(){
      console.log('asasa')
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: '',
        paySign: '',
      })
    }
  }
})
