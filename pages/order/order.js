// pages/order/order.js
import {
  extendObj, is_empty, doPost, createOrder, getOrderInfo
} from "../../utils/util.js"
const app = getApp()
const config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [
      {
        id: "",
        goodsname: "商品1",
        goodsnum: 1,
        price: 9.99
      },
      {
        id: "",
        goodsname: "商品2",
        goodsnum: 3,
        price: 9.99
      },
      {
        id: "",
        goodsname: "商品3",
        goodsnum: 1,
        price: 9.99
      },
      {
        id: "",
        goodsname: "商品4",
        goodsnum: 2,
        price: 9.99
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
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