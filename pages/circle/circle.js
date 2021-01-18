// pages/circle/circle.js
import {
  is_empty
} from "../../utils/util.js"
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
const config = require("../../config.js")
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    if (is_empty(app.globalData.userInfo.userid)) {
      wx.redirectTo({
        url: '../login/login'
      })
    }
    _this.data.jiapu = _this.selectComponent("#jiapu")
    _this.data.jiapu.init({
      userId: app.globalData.userInfo.userid,
      familyid:app.globalData.userInfo.familyid,
      center_circle: {			//中间环
        url: config.baseOss +"/attachment/images/middl_circle.png",
        x: (500 - 288) * 2.4,
        y: (500 - 255) * 2.4,
        w: 528 * 2.4,
        h: 501 * 2.4,
      },
      base_line: {
        url: config.baseOss +"/attachment/images/base_line.png",
        x: (500 - 313) * 2.4 * 0.9,
        y: (500 - 81) * 2.4 * 0.9,
        w: 825 * 2.4 * 0.9,
        h: 159 * 2.4 * 0.9,
      },
      name_width: 90,
      name_height: 60,
      name_fontsize: 16,
      line_width: 2,
      space_width: 120,
      rotateX: 60,
      levels: 5,
      showtype: "first",
      tap:function(member){
        _this.data.jiapu.showDetailInfo(member)
      },
      dbtap:function(member){
        _this.data.jiapu.init({userId:member.id})
      },
      longtap:function(member){},
      edittap:function(member){
      },
      addtap:function(member,type){
      },
      deltap:function(member){
      },
      sharetap:function(member){
      },
    })
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