// pages/extraction_code/extraction_code.js
import {
  extendObj, is_empty, is_number, doPost, sharePage, copy_code
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss,
    value: '',      //提取码初始值
    headImg: '',
    is_ok:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let shareInfo = options.scene || options.id + '_' + options.startMemberId;
    doPost('/wx/familyMemberShare/shareShow', {
      "inmap": {
        "shareInfo": shareInfo
      }
    }, function (res) {
      console.log(res)
      if(res.code==0){
        _this.setData({
          data: res.data,
          headImg: res.data.cereatorUser.headImg || config.baseOss + '/attachment/images/share_image.png',
        })
      }else{
        _this.setData({
          is_ok:false
        })
      }
    })
  },

  tqm: function (e) {
    let _this = this;
    console.log(e);
    _this.setData({ value: e.detail.value })
  },

  //验证提取码是否正确，正确则跳转home页
  yz_tqm: function () {
    let _this = this;
    let data = _this.data.data;
    doPost('/wx/familyMemberShare/verifyShareCode', {
      "inmap": {
        "id": _this.data.data.id,
        "shareCode": _this.data.value,
        "startMemberId": _this.data.data.startMemberId,
      }
    }, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '验证通过',
          icon: 'none',
          duration: 2000
        });
        wx.redirectTo({
          url: '../editjiapu/editjiapu?showType=share&userId=' + data.startMemberId + '&shareId=' + data.id + '&familyId=' + data.familyId + '&shareCode=' + _this.data.value,
        })
      } else {
        wx.showToast({
          title: '提取码错误',
          icon: 'none',
          duration: 2000
        });
      }
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