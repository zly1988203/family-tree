// pages/welcome/welcome.js
import {
  extendObj,is_empty
} from "../../utils/util.js"
const computedBehavior = require('miniprogram-computed')
const app = getApp()
const config = require("../../config.js")
Page({
  behaviors: [computedBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    punchList: [{
      "bannerUrl": config.baseOss + "/attachment/images/welcome_bg.jpg",
    }],
    current: 0
  },
  computed: {
    goUrl: (data)=>{
      //return (data.hasUserInfo && data.userInfo.userid) > 0 ? "../index/index" : "../login/login"
      return "../home/home"
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //wx.navigateTo({
    //  url: '../circle/circle'
    //})
    //return false;
    var _this = this;
    var alert = _this.selectComponent("#alert")
    if (!is_empty(app.globalData.userInfo.userid)) {
      wx.redirectTo({
        url: '../home/home',
      })
    } else {
      _this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      app.userInfoReadyCallback = res => {
        if (!is_empty(res.data) && !is_empty(res.data.openId)) {
          app.globalData.userInfo.openid = res.data.openId;
          if (res.code == 0) {
            var ulen = res.data.user.length
            if (ulen == 1) {
              var userinfo = extendObj([{}, userinfo, res.data.user[0]]);
              app.globalData.userInfo = extendObj([{}, app.globalData.userInfo, {
                userid: userinfo.id,
                familyid:userinfo.familyId,
                nickName: userinfo.name ? userinfo.name : app.globalData.userInfo.nickName,
                account: userinfo.account,
                mobile: userinfo.mobile,
                avatarUrl: userinfo.headImg ? userinfo.headImg : app.globalData.userInfo.avatarUrl,
                childOrder: userinfo.childOrder ? userinfo.childOrder : '',
              }])
              wx.redirectTo({
                url: "../home/home",
              })
            }else{
              var list = [];
              for (var i = 0; i < ulen; i++) {
                var userinfo = res.data.user[i];
                list.push({
                  id: userinfo.id,
                  name: userinfo.name,
                  data: userinfo
                })
              }
              alert.list({
                data: list,
                callback: function (obj) {
                  app.globalData.userInfo = extendObj([{}, app.globalData.userInfo, {
                    userid: obj.data.id,
                    familyid:obj.data.familyId,
                    nickName: obj.data.name ? obj.data.name : app.globalData.userInfo.nickName,
                    account: obj.data.account,
                    mobile: obj.data.mobile,
                    avatarUrl: obj.data.headImg ? obj.data.headImg : (app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : config.baseOss + "/attachment/images/avatar-none.png"),
                  }])
                  wx.redirectTo({
                    url: "../home/home"
                  })
                }
              })
            }
          } else {
            wx.redirectTo({
              url: "../home/home"
            })
          }
          _this.setData({
            userInfo: extendObj([{}, _this.userInfo, app.globalData.userInfo]),
            hasUserInfo: true
          })
        }
      }
    }
  },
  currentHandle: function(e) {
    let {
      current
    } = e.detail
    this.setData({
      current
    })
  },
  enterApp: function () {
    var _this = this;
    var goUrl = _this.data.goUrl;
    wx.redirectTo({
      url: goUrl,
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