// component/navbar/navbar.js
const app = getApp()
const config = require("../../config.js")
var commonMixin = require('../../utils/commonMixin.js')
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
    baseOss: config.baseOss,
    active:""
  },
  /**
   * 组件的方法列表
   */
  methods: Object.assign({
    active: function (name) {
      var _this = this;
      _this.setData({
        active:name
      });
    }
  }, commonMixin)
})
