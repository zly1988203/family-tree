// pages/share/share.js
import {
  extendObj, is_empty, is_number, doPost, copy_code
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss: config.baseOss,
    sharelist:[],
    search_form:{
      keywords:"",
    },
    page:1,
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
    };
    //获取手机屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 375 / clientWidth;
        let height = clientHeight * ratio;
        _this.setData({
          height: height-140
        });
      }
    });
    _this.share_list();
  },
  // 数据
  share_list: function () {
    var _this = this
    doPost('/wx/familyMemberShare/dataList', {
      "inmap": {
        "createUserId": app.globalData.userInfo.userid,
        "startMemberName":'',
        "pageNum": _this.data.page,    //页码
      }
    }, function (res) {
      _this.setData({
        sharelist: res.data
      });
    })
  },
  //获取搜索内容
  input:function(e){
    let _this = this;
    _this.setData({
      startMemberName: e.detail.value
    });
  },
  //点击搜索
  searchShare:function(){
    let _this = this;
    doPost('/wx/familyMemberShare/dataList', {
      "inmap": {
        "createUserId": app.globalData.userInfo.userid,
        "startMemberName": _this.data.startMemberName,
        "pageNum": 1,    //页码
      }
    }, function (res) {
      _this.setData({
        sharelist: res.data
      });
    })
  },
  copy_code: function (e) {
    let _this = this;
    var code = e.currentTarget.dataset.code
    copy_code(code);
  },
  //重置提取码
  resetToken: function (e) {
    var _this = this;
    var idx = parseInt(e.currentTarget.dataset.id);
    var shareItem = _this.data.sharelist.list[idx]
    wx.showModal({
      title: '提示',
      content: '是否要重置提取码',
      success: function (res) {
        if (res.confirm){
          if (shareItem) {
            doPost('/wx/familyMemberShare/resetShareCode', {
              "inmap": {
                "id": shareItem.id,
                "createUserId": app.globalData.userInfo.userid,
              }
            }, function (res) {
              console.log(res);
              if (res.code == 0) {
                wx.showToast({
                  title: '重置成功',
                  icon: 'success',
                  duration: 2000
                });
                _this.share_list();
              } else {

              }
            })
          }
        } else if (res.cancel){
          
        }
      }
    })
  },
  //取消
  cancelShare: function (e) {
    var _this = this;
    var idx = parseInt(e.currentTarget.dataset.id);
    var shareItem = _this.data.sharelist.list[idx]
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success:function(res){
        if (res.confirm) {
          if (shareItem) {
            doPost('/wx/familyMemberShare/cancelShare', {
              "inmap": {
                "id": shareItem.id,
                "createUserId": app.globalData.userInfo.userid,
              }
            }, function (res) {
              console.log(res);
              if (res.code == 0) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000
                });
                _this.share_list();
              } else {

              }
            })
          }
        } else if (res.cancel) {
        }
      }
    })
  },
  //分享
  shareShare: function (e) {
    var _this = this;
    var idx = parseInt(e.currentTarget.dataset.id);
    var shareItem = _this.data.sharelist.list[idx];
    wx.navigateTo({
      url: '../initiate_sharing/initiate_sharing?is_share=1&startMemberId=' + shareItem.startMemberId + '&familyId=' + shareItem.familyId,
    })
  },
  //上拉加载
  bindscrolltolower:function(e){
    let _this = this;
    let page = _this.data.page;
    page++;
    _this.setData({is_ok:true})
    doPost('/wx/familyMemberShare/dataList', {
      "inmap": {
        "createUserId": app.globalData.userInfo.userid,
        "startMemberName": _this.data.startMemberName,
        "pageNum": _this.data.page,    //页码
      }
    }, function (res) {
      _this.setData({
        sharelist: res.data,
        page: page,
        is_ok: false
      });
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