// cops/item/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: '../../imgs/unchecked.svg',
    },
    id: {
      type: Number,
      value: 0,
    },
    title: {
      type: String,
      value: '趣味粉彩系列记忆棉坐垫趣味粉趣味粉彩系列记彩趣味粉彩系列记忆棉坐垫趣味记忆棉坐垫趣味'
    },
    pic: {
      type: String,
      value: 'http://yanxuan.nosdn.127.net/d5d41841136182bf49c1f99f5c452dd6.png',
    },
    price: {
      type: Number,
      value: 1234,
    },
    count: {
      type: Number,
      value: 1,
    },
    checked: {
      type: Boolean,
      value: false,
    },

    buy: {
      type: Boolean,
      value: true,
    },

  },
  data: {
 
  },
  methods: {
    check(){
      let { checked, src, id, price } = this.data
      checked = !checked
      checked ? src = '../../imgs/checked.svg' : src = '../../imgs/unchecked.svg'
      this.setData({checked,src})
      this.triggerEvent('check', {itemon: checked, id, price})
    },
    selType(e) {
      console.log(e)
      let { sel } = this.data
      const type = e.currentTarget.dataset.type
      this.setData({ sel: type })
    },
    selNumber(e) {
      let { count, id,  } = this.data
      const type = e.currentTarget.dataset.operate

      switch (type) {
        case 'plus':
          count = ~~count + 1 
          this.setData({ count　})
          break;
        case 'minus':
          count > 1 ? this.setData({ count: ~~count - 1 }) : count
          break;
      }
      this.triggerEvent('selnumber', {count, id})
    },
    countInput(e) {
      let { count, id} = this.data
      const counts = e.detail.value
      this.setData({ count: counts })
    },
    countFirm(e) {
      let { count } = this.data
      const counts = e.detail.value
      ~~counts == 0 ? this.setData({ count: 1 }) : this.setData({ count: ~~counts })
    },
  }
})
