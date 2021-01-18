// pages/article/article.js
import {
  extendObj, is_empty, is_number, doPost
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    text:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if(!is_empty(options.title)){
      _this.setData({
        title: options.title
      })
    }
    if (!is_empty(options.url)) {
      let params = is_empty(options.params)?{}:options.params
      doPost(options.url, params, function (res) {
        _this.setData({ text: res.data })
      })
    }
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