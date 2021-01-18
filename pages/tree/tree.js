// pages/tree/tree.js
import {
  extendObj, is_empty, doPost
} from "../../utils/util.js"
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
const config = require("../../config.js")
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss
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
    
    //var jiapu_data = null;
    //var subTree = new MemberTree(source_data.data.offset, source_data.data.members);
    //if (userId) {
    //  jiapu_data = subTree.getTargetMember(userId);
    //} else { // 否则使用始祖用户
    //  jiapu_data = subTree.getAncestor();
    //}
    _this.data.jiapu = _this.selectComponent("#jiapu")
    _this.data.jiapu.init({
      userId: app.globalData.userInfo.userid,
      familyid:app.globalData.userInfo.familyid,
      name_width: 80,
      name_height: 20,
      name_fontsize: 12,
      space_width: 20,
      space_height: 30,
      line_width:1,
      line_color:"#7e5a44",
      levels: 5,
      showtype: "first",
      tap:function(member){
        _this.data.jiapu.showDetailInfo(member)
      },
      dbtap:function(member){
        _this.data.jiapu.init({userId:member.id})
      },
      longtap:function(member){},
      edittap:function(member){
      },
      addtap:function(member,type){
      },
      deltap:function(member){
      },
      sharetap:function(member){
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