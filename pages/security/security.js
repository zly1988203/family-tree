// pages/security/security.js
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
    showOldpwd:false,
    showNewpwd:false,
    security:{
      oldpwd:"",
      newpwd:"",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  editSubmit:function(){
    var _this=this
    if (_this.data.security.oldpwd==''){
     showToast("请输入原密码")
      return
    }
    if (_this.data.security.newpwd == '') {
      showToast("请输入新密码")
      return
    }
    if (_this.data.security.newpwd.length < 6) {
      showToast("请输入六位以上的密码")
      return}
    if(!_this.data.postFlag){
      _this.data.postFlag = true;
      doPost("/user/updatePassword",{"inmap":{"id":app.globalData.userInfo.userid,"oldPwd":_this.data.security.oldpwd,"newPwd":_this.data.security.newpwd}},function(res){
        if(res.code==0){
          wx.showToast({
            title: "密码修改成功",
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
             delta:1
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