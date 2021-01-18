// pages/initiate_sharing/initiate_sharing.js
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
    shareCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 数据
    var _this = this
    let is_share = options.is_share || 0;
    let shareId = options.shareId || null;
    if (is_share == 1) {  //判断是分享列表页进入
      _this.setData({ is_share: true })
    }
    _this.setData({
      shareId: shareId
    })
    doPost('/wx/familyMemberShare/shareInfo', {
      "inmap": {
        "startMemberId": options.startMemberId,
        "createUserId": app.globalData.userInfo.userid,
        'familyId': options.familyId,
        "id":shareId
      }
    }, function (res) {
      if(res.code==0){
        let desc = res.data.desc;
        let desc2 = desc.slice(0, 12) + '\n' + desc.slice(12); //向第十二个字加换行符
        _this.setData({
          shareInfo: res.data,
          shareCode: res.data.shareCode,
          desc2:desc2,
          startMemberId: options.startMemberId,
        });
      }
    })
  },
  //复制提取码
  copy_code: function () {
    let _this = this;
    copy_code(_this.data.shareCode);
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
  onShareAppMessage: function () {
    // return sharePage(this.data.shareInfo.desc, this.data.shareInfo.id)
    return{
      title: this.data.desc2,
      imageUrl: "https://miniprogram.mmxp5000.com/attachment/images/share_image.png",
      path: "/pages/extraction_code/extraction_code?id=" + this.data.shareInfo.id + '&startMemberId=' + this.data.startMemberId,
    }
  }
})