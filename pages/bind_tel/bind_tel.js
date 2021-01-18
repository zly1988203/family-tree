// pages/bind_tel/bind_tel.js
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
    is_ok:true,
    code:'',
    mobile:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let tel = options.tel;
    let mob = tel.slice(0,3) + '****' + tel.slice(7);
    _this.setData({ mob: tel==''?'未绑定手机':mob});
  },
  //输入手机号码
  tel_num:function(e){
    this.setData({ mobile:e.detail.value});
  },

  //输入验证码
  code:function(e){
    this.setData({ code: e.detail.value });
  },

  //用户点击获取验证码并60s倒计时
  sendCode:function(){
    let _this = this;
    var time = 60;
    let mobile = _this.data.mobile
    if (/^1[3456789]\d{9}$/.test(mobile)){
      doPost('/user/sendSMS ', {
        "inmap": {
          "mobile": mobile,
        }
      }, function (res) {
        if(res.code==0){
          console.log(res)
          showToast('短信验证码发送成功')
          _this.setData({
            sendCode: '60秒',
            is_ok: false
          })
          var Interval = setInterval(function () {
            time--;
            if (time > 0) {
              _this.setData({
                sendCode: time + '秒'
              })
            } else {
              clearInterval(Interval);
              _this.setData({
                is_ok: true
              })
            }
          }, 1000)
        }else{
          showToast(res.code)
        }
      });
    }else{
      showToast('手机号格式不正确');
    }

  },

  //绑定手机号
  btns:function(){
    let _this = this;
    if (_this.data.mobile == '') {
      showToast('请输入手机号码')
      return
    }
    if (_this.data.code==''){
      showToast('请输入验证码')
      return
    }
    doPost('/user/bindMobile ', {
      "inmap": {
        "id": app.globalData.userInfo.userid,
        "code": _this.data.code,
        "mobile": _this.data.mobile,
      }
    }, function (res) {
      console.log(res)
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000
      })
      if(res.code==0){
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
    });
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