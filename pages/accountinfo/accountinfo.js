// pages/accountinfo/accountinfo.js
import {
  extendObj, is_empty, is_number,doPost
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    accountinfo:{
      name:"",
      mobile:"",
      birthday:"",
      sex:"",
      email:"",
    }
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
    var _this = this
    doPost('/user/getAccountDetail', { "inmap": { "id": app.globalData.userInfo.userid } }, function (res) {
      if (res.code == 0) {
        _this.setData({
          accountinfo: {
            nickName: res.data.fullName ? res.data.fullName :app.globalData.userInfo.nickName,
            account: res.data.account ? res.data.account :app.globalData.userInfo.account,
            mobile: res.data.mobile ? res.data.mobile :app.globalData.userInfo.mobile,
            familyid: res.data.familyId ? res.data.familyId :app.globalData.userInfo.familyid,
            childOrder: res.data.childOrder ? res.data.childOrder :app.globalData.userInfo.childOrder,
          }
        })
      } else {
        _this.setData({
          accountinfo: {
            nickName: app.globalData.userInfo.nickName ? app.globalData.userInfo.nickName : '',
            account: app.globalData.userInfo.account ? app.globalData.userInfo.account : '',
            mobile: app.globalData.userInfo.mobile ? app.globalData.userInfo.mobile : '',
            familyid: app.globalData.userInfo.familyid ? app.globalData.userInfo.familyid : '',
            childOrder: app.globalData.userInfo.childOrder ? app.globalData.userInfo.childOrder : '',
          }
        })
      }
    })
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