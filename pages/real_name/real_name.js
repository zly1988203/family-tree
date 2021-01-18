// pages/real_name/real_name.js
import {
  extendObj, is_empty, is_number, doPost, sharePage, copy_code, showToast
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
    name: '',
    sf_code: '',
    z_img: config.baseOss + '/attachment/images/real_name_icon1.png',
    f_img: config.baseOss + '/attachment/images/real_name_icon2.png',
    is_ok: false,
    realyName: '',
    idcard: '',
    exprieTime: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    doPost("/user/queryCertification", {
      "inmap": {
        "userId": app.globalData.userInfo.userid, //用户id
      }
    }, function (res) {
      _this.setData({
        realyName: res.data.realyName == null ? '' : res.data.realyName,
        idcard: res.data.idcard == null ? '' : res.data.idcard,
        exprieTime: res.data.exprieTime == null ? '' : res.data.exprieTime,
        idcardFrontUrl: res.data.idcardFrontUrl == null ? '' : res.data.idcardFrontUrl,
        idcardBackUrl: res.data.idcardBackUrl == null ? '' : res.data.idcardBackUrl,
      })
    })
  },

  //填写姓名和身份证号
  input_name: function(e) {
    let _this = this;
    let realyName = e.detail.value;
    _this.setData({
      realyName: realyName
    });
  },
  idcard: function(e) {
    let _this = this;
    let idcard = e.detail.value;
    _this.setData({
      idcard: idcard
    });
  },
  //身份证到期时间
  bindDateChange: function(e) {
    let _this = this;
    let exprieTime = e.detail.value;
    _this.setData({
      exprieTime: exprieTime
    });
  },
  //上传身份证照片
  changeAvatar: function(e) {
    console.log(e);
    let _this = this;
    let i = e.currentTarget.dataset.i;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
      // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths[0]
      //上传文件到服务器功能开始
        wx.uploadFile({
          url: config.baseUrl + '/user/uploadIdCardPhoto', //路径
          filePath: tempFilePaths,
          name: 'idCardPhoto',
          formData: {
            userId: app.globalData.userInfo.userid
          },
          success(res) {
            if (res.statusCode == 200) {
              var data = JSON.parse(res.data)
              console.log(data)
              if (data.errno == 0 && i == 1) {
                _this.setData({
                  idcardFrontUrl:data.data
                })
              } else if (data.errno == 0 && i ==2){
                _this.setData({
                  idcardBackUrl: data.data
                })
              }
            }
          },
          fail(e) {
            //上传文件到服务器功能结束
            console.log(e)
          }
        })
      }
    })
  },
  //提交
  submission: function() {
    let _this = this;
    if (_this.data.realyName == '') { showToast('您还未填写姓名'); return }
    if (_this.data.idcard == '') { showToast('您还未填写身份证号码'); return }
    if (_this.data.idcardFrontUrl == '') { showToast('您还未上传身份证正面'); return }
    if (_this.data.idcardBackUrl == '') { showToast('您还未上传身份证反面'); return }
    doPost("/user/nameCertification", {
      "inmap": {
        "userId": app.globalData.userInfo.userid, //用户id
        "realyName": _this.data.realyName, //用户真实姓名
        "idcard": _this.data.idcard, //用户身份证
        "exprieTime": _this.data.exprieTime, //身份证到期时间
        "idcardFrontUrl": _this.data.idcardFrontUrl, //身份证正面照
        "idcardBackUrl": _this.data.idcardBackUrl, //身份证反面照
      }
    }, function(res) {
      if(res.code==0){
        wx.showToast({
          title: '上传成功，系统正在审核',
          icon: 'none',
          duration: 2000,
        })
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },

  // 打开示例
  dak: function() {
    this.setData({
      is_ok: true
    })
  },

  // 关闭示例
  qux: function() {
    this.setData({
      is_ok: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  //onShareAppMessage: function() {

  //}
})