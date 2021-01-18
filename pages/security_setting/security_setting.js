// pages/security_setting/security_setting.js
import {
  extendObj, is_empty, is_number, doPost, showToast
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let tel = app.globalData.userInfo.mobile;
    let nickName = app.globalData.userInfo.nickName;
    _this.setData({ nickName: nickName, tel: tel==''?'未绑定手机':tel})
  },
  //绑定微信获取用户信息
  bindWeChat:function(e){
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '是否确认绑定微信',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          doPost("/wx/user/bindAccount", {
            openId: app.globalData.userInfo.openid, //微信openIdf
            id: app.globalData.userInfo.userid, //用户id
            bindFlag: 1 + '', //绑定标识
          }, function (res) {
            console.log(res)
            if (res.code == 0) {
              showToast('绑定微信成功')
            } else {
              showToast(res.msg)
            }
          })
        } else if (res.cancel) {

        }
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
})