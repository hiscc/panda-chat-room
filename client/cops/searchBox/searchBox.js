// cops/searchBox/searchBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    searchInput(e){
      console.log(e)
      let input = e.detail.value
    },
    searchFirm(e){
      let input = e.detail.value
      wx.navigateTo({
        url: '../../pages/collection/collection',
      })
    }
  }
})
