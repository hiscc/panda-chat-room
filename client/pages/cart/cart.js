// pages/cart/cart.js
import { doLogin, checkLogin } from '../../services/user'
import p from '../../utils/p'
import pay from '../../services/pay'

import { config } from '../../config.js'
Page({

  data: {
    buy: true,
    count: 1,
    items: [],

    allcost: 0,
    allcount: 0,
    allchecked: false,
  },

  // 支付函数，未具体封装
  pay(){
      pay({
        url: `${config.host}/order/pay`,
        method: 'GET'
      }).then(res => {
          console.log(res)
      }).catch(err => {
        console.log('支付失败')
        wx.showToast({
          title: '支付失败',
          icon: 'loading'
        })
      })
      
  },

  // 单个商品的选中状态切换
  itemcheck(e){
      let {id, operate} = e.currentTarget.dataset
      let { items } = this.data

      let cart = wx.getStorageSync('cart') || []

      items.map(item => {
        if(item.id === ~~id){
          item.checked = !item.checked
        }
      })
      cart.map(item => {
        if (item.id === ~~id) {
          item.checked = !item.checked
        }
      })
      this.setData({items})
      wx.setStorageSync('cart', cart)

      this.updateCart()
  },

  // 单个商品的数量加减 1 变化
  itemnumber(e){
    let { id, operate } = e.currentTarget.dataset
    let { items } = this.data
    let cart = wx.getStorageSync('cart') || []

    items.map(item => {
      if (item.id === ~~id) {
        switch (operate) {
          case 'plus':
            item.count = ~~item.count + 1
            this.setData({ items })
            break;
          case 'minus':
            if (item.count > 1) {
              item.count = ~~item.count - 1
              this.setData({ items })
            }
            break;
        }
      }
    })

    cart.map(item => {
      if (item.id === ~~id) {
        switch (operate) {
          case 'plus':
            item.count = ~~item.count + 1
            wx.setStorageSync('cart', cart)
            break;
          case 'minus':
            if (item.count > 1) {
              item.count = ~~item.count - 1
              wx.setStorageSync('cart', cart)
            }
            break;
        }
      }
    })
    this.updateCart()
  },

  // 单个商品的数量输入变化
  iteminput(e){
    let { value, } = e.detail
    let { id } = e.target.dataset.id
    let { items } = this.data
    items.map(item => {
      if (item.id === ~~id) {
        item.count = ~~value
      }
    })
  },

  // 单个商品的数量输入变化 2 ，在输入框失焦时判断数量是否合理
  itemfirm(e){
    let { value } = e.detail
    let count = ~~value
    let { id } = e.target.dataset
    let { items } = this.data

    let cart = wx.getStorageSync('cart') || []

    items.map(item => {
      if (item.id === ~~id) {
        count < 1? item.count = 1 : item.count = count
      }
    })
    cart.map(item => {
      if (item.id === ~~id) {
        count < 1 ? item.count = 1 : item.count = count
      }
    })
    this.setData({ items: items })
    wx.setStorageSync('cart', cart)

    this.updateCart()
  },

  // 商品全选后的状态变更
  allchecked(e){
    const { allon } = e.detail
    let { items, allcost, allcount, allchecked} = this.data
    let cart = wx.getStorageSync('cart') || []

    if(allchecked){
      items.map((item) => {
        allchecked = false
        item.checked = false
        allcost = 0
        allcount = 0
      })

      cart.map(item => {
        item.checked = false
      })
    } else {
      items.map((item) => {
        allchecked = true
        item.checked = true
        allcost += item.price * item.count
        allcount += item.count
      })

      cart.map(item => {
        item.checked = true
      })
    }
    this.setData({ items, allchecked, allcost, allcount})
    wx.setStorageSync('cart', cart)
  },

  // 购物车状态更新后的重载函数
  updateCart(){
    let { items, allcost, allcount, allchecked } = this.data
    allcost = 0
    allcount = 0
    items.map(item => {
      if (item.checked === true) {
        allcost += item.price * item.count
        allcount += item.count
      } else {
        allcost = allcost
        allcount = allcount
      }
    })

    // 空数组清零
    if(items.length > 0){
      items.every(this.everyChecked) ? allchecked = true : allchecked = false
    } else {
      allchecked = false
    }
    this.setData({ items, allcost, allcount, allchecked })
  },

  everyChecked(item){
      return item.checked == true
  },


  // 商品删除操作
  remove(e){
    console.log(e)
    let { id } = e.currentTarget.dataset
    let { items } = this.data
    let cart = wx.getStorageSync('cart') || []
    const that = this
    wx.showActionSheet({
      itemList: ['删除此商品'],
      success(res){
        if(res.tapIndex === 0) {
          const index = items.findIndex(item => {
            return item.id === id
            console.log(item.id)
          })
          items.splice(index, 1)

          cart.splice(index, 1)
          wx.setStorageSync('cart', cart)

          that.updateCart()
          that.setData({ items })
          wx.showToast({
            title: `删除成功`,
          })
        }
      },
    })
  },

  // 购物车商品列表校正函数
  refreshCart(){
    let cart = wx.getStorageSync('cart') || []
    const res = []
    // 购物车数组按 id 分组
    const groups = cart.reduce((acc, cur) => {
      (acc[cur.id] = acc[cur.id] || []).push(cur)
      return acc
    }, {})
    // 计算每个商品的数量并构建数组
    for (let item in groups) {
      let itemcount = 0
      groups[item].map(it => {
        itemcount += it.count
      })
      console.log(itemcount)
      groups[item][0].count = itemcount
      res.push(groups[item][0])
    }
    console.log(groups)
    wx.setStorageSync('cart', res)
  },

  // 从缓存内拉取商品
  cartData(){
    let cart = wx.getStorageSync('cart') || []
    this.setData({items: cart})
  },
  
  onLoad(options){
    this.refreshCart()
    this.cartData()
    this.updateCart()
  },
  onReady: function () {
  
  },

  onShow: function () {
    this.refreshCart()
    this.cartData()
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  }
})