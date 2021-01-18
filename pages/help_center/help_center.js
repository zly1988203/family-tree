// pages/help_center/help_center.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  commonProblem:function(){
    wx.navigateTo({
      url: '../article/article?title=常见问题库&url=/user/operatePoint&params=' + JSON.stringify({
        "inmap": {
          "pointId": 10000,
          "userId": app.globalData.userInfo.userid,
        }
      }),
    })
  },
  operatorIntro: function () {
    wx.navigateTo({
      url: '../article/article?title=操作说明&url=/user/operatePoint&params=' + JSON.stringify({
        "inmap": {
          "pointId": 10001,
          "userId": app.globalData.userInfo.userid
        }
      }),
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