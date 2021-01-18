// pages/changeaccount/changeaccount.js
import {
  extendObj, is_empty, is_number, doPost
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss,
    accountlist:[],

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
    _this.setData({ userid: app.globalData.userInfo.userid})
    _this.shuju();
  },
  shuju:function(){
    let _this = this;
    doPost("/user/getSwithAccountList", {
      "inmap": {
        "userId": app.globalData.userInfo.userid, //用户id
      }
    }, function (res) {
      console.log(res);
      _this.setData({
        accountlist:res.data,
        userid: app.globalData.userInfo.userid
      })
    });
  },
  //切换用户
  changeSelectAccount:function(e){
    var _this = this
    var idx = e.currentTarget.dataset.id
    let accountlist = _this.data.accountlist;
    if (accountlist[idx].id == app.globalData.userInfo.userid){

    }else{
      app.globalData.userInfo.userid = accountlist[idx].id;
      app.globalData.userInfo.nickName = accountlist[idx].fullName;
      app.globalData.userInfo.account = accountlist[idx].account;
      app.globalData.userInfo.mobile = accountlist[idx].mobile;
      app.globalData.userInfo.familyid = accountlist[idx].familyId;
      wx.showToast({
        title: '切换成功',
        icon:'none',
        duration:2000,
      })
      _this.shuju();
      setTimeout(function () {
        // 这里就是处理的事件
        wx.redirectTo({
          url: '../home/home',
        })
      }, 2000);
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