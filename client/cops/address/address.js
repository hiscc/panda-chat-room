// cops/address/address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      name: {
        type: String,
        value: '',
      },
      phone: {
        type: Number,
        value: '',
      },
      province: {
        type: String,
        value: '',
      },
      street: {
        type: String,
        value: '',
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
    nameFirm(e){
      let { name } = this.data
      let nameInput = e.detail.value
      console.log(e)
      this.setData({name: nameInput})
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
    save(){
      let {name, phone, province, street} = this.data
      console.log(this.data)
    },
  }
})
