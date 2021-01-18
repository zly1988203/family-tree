// pages/home/home.js
import {
  extendObj,is_empty
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss,
    search_form:{
      keywords:""
    },
    hot_list:[
      { url: "../search/search?keywords=陈氏家族", keywords: "陈氏家族" },
      { url: "../search/search?keywords=修谱", keywords: "修谱" },
      { url: "../search/search?keywords=叶氏家族", keywords: "叶氏家族" },
      { url: "../search/search?keywords=修家谱", keywords: "修家谱" },
    ],
    addList: [
      {
        imageUrl: config.baseOss + "/attachment/images/home_add_1.jpg",
        hrefUrl:""
      },
      {
        imageUrl: config.baseOss + "/attachment/images/home_add_1.jpg",
        hrefUrl: ""
      },
      {
        imageUrl: config.baseOss + "/attachment/images/home_add_1.jpg",
        hrefUrl: ""
      },
    ],
    current: 0
  },
  currentHandle: function (e) {
    let {
      current
    } = e.detail
    this.setData({
      current
    })
  },
  handleAddTap: function (e) {
    var _this = this;
    var idx = parseInt(e.target.dataset.idx)
    var add = _this.data.addList[idx];
    if (add && add.hrefUrl) {
      wx.redirectTo({
        url: add.hrefUrl,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.selectComponent("#nav-bar").active("home")
    //if (is_empty(app.globalData.userInfo.userid)) {
    //  wx.redirectTo({
    //    url: '../login/login'
    //  })
    //}
    /*
    var alert = _this.selectComponent("#alert")
    alert.payment({
      paytype: 'jsapi',
      ordersn: '123',
      total_fee: 10,
      callback: function(){
        alert.closePayment()//如果是二维码的话需要关闭
      }
    })
    */
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
  //onShareAppMessage: function () {

  //}
}, commonMixin))