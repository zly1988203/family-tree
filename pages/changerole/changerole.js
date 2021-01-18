// pages/changerole/changerole.js
import {
  extendObj, is_empty, is_number
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss,
    rolelist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (is_empty(app.globalData.userInfo.userid)) {
      wx.redirectTo({
        url: '../login/login'
      })
    }
    _this.setData({
      rolelist: [
        {
          userid: "",
          account: 'mmxp10677032',
          nickname: '徐冉洋',
          type:1,
          avatar:'',
          selected: true
        },
        {
          userid: "",
          account: 'mmxp10677030',
          nickname: 'Whitney~',
          type: 2,
          avatar: '',
          selected: false
        },
        {
          userid: "",
          account: 'mmxp10677030',
          nickname: '王熙杰',
          type: 1,
          avatar: '',
          selected: false
        },
      ]
    })

  },
  changeSelectRole: function (e) {
    var _this = this
    var idx = e.currentTarget.dataset.id
    if (typeof (idx) != "undefined") {
      idx = parseInt(idx)
      var role = _this.data.rolelist[idx];
      //切换角色操作
      if (!role.selected) {
        console.log(role);
      }
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
  //onShareAppMessage: function () {

  //}
})