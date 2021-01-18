// pages/setting/setting.js
import {
  extendObj, is_empty, is_number, doUpload
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss,
    alert: null,
    setting:{
      space:1,
      avatar:app.globalData.userInfo.avatarUrl,
    },
    is_ok:false
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
    _this.data.alert = _this.selectComponent("#alert");
  },
  changeAvatar:function(){
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths[0]
        if (tempFilePath) {
          _this.data.alert.imageSelect(tempFilePath, true, function (tImageFile) {
            //上传文件到服务器功能开始
            doUpload('/user/uploadHeadImg', 'headImg', tImageFile, {
              userId: app.globalData.userInfo.userid
            }, function (res) {
              if (res.code == 0) {
                app.globalData.userInfo.avatarUrl = res.data;
                _this.setData({
                  ['setting.avatar']: res.data
                })
                wx.showToast({
                  title: '头像更改成功',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                _this.data.alert.tips(res.msg, 2000);
              }
            })
          });
        } else {
          _this.data.alert.tips("请选择图片", 2000);
        }
      }
    })
  },
  logout: function () {
    app.globalData.userInfo.userid = "";
    app.globalData.userInfo.account = "";
    app.globalData.userInfo.mobile = "";
    app.globalData.userInfo.nickName = "";
    //app.globalData.userInfo.avatarUrl = "";
    wx.redirectTo({
      url: '../login/login'
    })
  },

  //页面跳转
  taoZhuan:function(e){
    console.log(e);
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  //是否公开
  changeSpace:function(e){
    let _this = this;
    console.log(e);
    let value = e.detail.value;
    _this.setData({
      setting:{
        space: value,
        avatar:app.globalData.userInfo.avatarUrl,
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
    var _this = this;
    _this.setData({
      alert: _this.selectComponent("#alert"),
      setting: {
        avatar: app.globalData.userInfo.avatarUrl,
      },
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
})