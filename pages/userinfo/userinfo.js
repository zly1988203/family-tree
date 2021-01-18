// pages/userinfo/uerinfo.js
import {
  extendObj, is_empty, is_number, doPost, showToast
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    postFlag:false,
    userinfo:{
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
    doPost("/user/getUser",{"inmap":{"id":app.globalData.userInfo.userid}},function(res){
      if(res.code==0){
        var member = res.data;
          _this.setData({
            userinfo:{
              name:member.name,
              mobile:member.mobile,
              birthday:member.birthday,
              sex:member.sex=="M"?1:(member.sex=="W"?2:''),
              email:member.email,
            }
          })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
    })

  },
  editSubmit:function(){
    var _this=this
    var member = _this.data.userinfo
    let email_zz = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!email_zz.test(member.email)){
        showToast('请输入正确的邮箱地址')
        return
    }
    var data = {
      "inmap": {
        id:app.globalData.userInfo.userid,
        name:member.name,
        mobile:member.mobile,
        birthday: member.birthday,
        sex:member.sex==1?"M":(member.sex==2?"W":""),
        email:member.email,
      }
    }
    if(!_this.data.postFlag){
      _this.data.postFlag = true;
      doPost("/user/updateUser",data,function(res){
        if(res.code==0){
          //更新全局变量
          app.globalData.userInfo.mobile = member.mobile
          wx.showToast({
            title: "编辑资料成功",
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        }else{
          _this.data.postFlag = false;
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
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
  //onShareAppMessage: function () {

  //}
}, commonMixin))