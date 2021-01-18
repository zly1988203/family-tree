// pages/save_pictures/save_pictures.js
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
    alert:null,
    baseOss: config.baseOss,
    copy_code: '',
    ctx:null,
    scale:1,
    userid:"",
    familyid:"",
    isAuth:false,
    canvas:{
      width:0,
      height:0
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.ctx = wx.createCanvasContext('canvas');
    _this.data.alert = _this.selectComponent("#alert")
    var query = wx.createSelectorQuery()
    query.select('#img_content').boundingClientRect()
    query.exec((res) => {
      var c_w = res[0].width;
      var c_h = res[0].height;
      _this.data.scale = c_w / 690;
      _this.setData({
        userid:options.id,
        familyid:options.familyId,
        canvas:{
          width:c_w,
          height:c_h
        },
        isAuth: app.globalData.userInfo.wxInfoAuth
      },function(){
        if (app.globalData.userInfo.wxInfoAuth){
          _this.drawPost();
        }
      })
    })
  },
  drawPost: function () {
    var _this = this
    //获取分享信息，地址需要根据要求修改
    _this.data.alert.loading("请求中...",'icon5');
    doPost('/wx/familyMemberShare/release', {
      "inmap": {
        "id": _this.data.userid,
        "familyId": _this.data.familyid,
        "createUserId": app.globalData.userInfo.userid,
      }
    }, function (res) {
      //获取用户信息
      if (res.code == 0) {
        _this.data.alert.loading("生成文本...", 'icon5');
        _this.setData({ copy_code: res.data.shareCode })
        var headImg = app.globalData.userInfo.wxAvatarUrl;//看是否使用返回的头像，当前取用户微信头像
        var nickName = app.globalData.userInfo.wxNickName;//看是否使用返回的昵称，当前取用户微信昵称
        var qrImg = res.data.shareImg;//二维码根据返回修改，测试先固定
        var jiapuName = '';//家谱全称根据返回修改，测试先固定
        var jiapuSubName = res.data.desc;//家谱简称根据返回修改，测试先固定，确定有这个值？或者只取一个姓
        headImg = headImg ? headImg : config.baseOss + '/attachment/images/editmember_avatar_default.jpg'
        qrImg = qrImg ? qrImg : config.baseOss + '/attachment/images/miniprogram_default_noqrocde.jpg'
        nickName = nickName ? nickName : ""
        jiapuName = jiapuName ? jiapuName : ""
        jiapuSubName = jiapuSubName ? jiapuSubName : ""
        _this.data.ctx.clearRect(0, 0, _this.data.canvas.width, _this.data.canvas.height);
        _this.data.ctx.save();
        _this.data.ctx.setFillStyle('#ffffff')
        _this.data.ctx.fillRect(0, 0, _this.data.canvas.width, _this.data.canvas.height);
        _this.data.ctx.restore();
        //绘制文本
        _this.data.ctx.setFillStyle('#696969')
        _this.data.ctx.setFontSize(28 * _this.data.scale)
        _this.data.ctx.textAlign = "center"
        _this.data.ctx.textBaseline = "middle"
        _this.data.ctx.fillText(nickName, 345 * _this.data.scale, 175 * _this.data.scale)
        _this.data.ctx.setFillStyle('#333333');
        _this.data.ctx.setFontSize(32 * _this.data.scale);
        _this.data.ctx.fillText('邀请您修谱', 345 * _this.data.scale, 218 * _this.data.scale);
        _this.data.ctx.setFontSize(28 * _this.data.scale)
        _this.data.ctx.textAlign = "left"
        var all_text = jiapuSubName
        // var all_text = nickName + '正在名门修谱建立《' + jiapuSubName+'》，识别小程序码填写您的信息，加入'+jiapuSubName+'...'
        var all_len = all_text.length
        for (var i = 0; (i * 20) < all_len; i++) {
          var t_len = 20
          t_len = ((i * 20) + t_len) > all_len ? all_len - (i * 20) : 20;
          var t_text = all_text.substring(i * 20, i * 20 + t_len)
          _this.data.ctx.fillText(t_text, 65 * _this.data.scale, 295 * _this.data.scale + (i * 40 * _this.data.scale));
        }
        _this.data.alert.loading("加载素材...", 'icon5');
        var pm1 = new Promise(function (resolve, reject) {
          wx.getImageInfo({
            src: qrImg,
            success(res) {
              resolve({ type: 'qrcode', data: res })
            }, fail(err) {
              wx.showToast({
                title: '二维码加载错误',
                icon: "none"
              })
              reject(err)
            }
          })
        })
        var pm2 = new Promise(function (resolve, reject) {
          wx.getImageInfo({
            src: headImg,
            success(res) {
              resolve({ type: 'avatar', data: res })
            }, fail(err) {
              wx.showToast({
                title: '头像图片加载错误',
                icon: "none"
              })
              reject(err)
            }
          })
        })
        Promise.all([pm1, pm2]).then(res => {
          var dlen = res.length
          for (var i = 0; i < dlen; i++) {
            var pres = res[i];
            if (pres.type == "qrcode") {
              var s_x = 0;
              var s_y = (pres.data.height - pres.data.width) / 2;
              var s_w = pres.data.width;
              if (pres.data.width > pres.data.height) {
                s_w = pres.data.height;
                s_y = 0;
                s_x = (pres.data.width - pres.data.height) / 2;
              }
              _this.data.ctx.drawImage(
                pres.data.path,
                s_x, s_y,
                s_w, s_w,  //被剪切图像的高度。
                165 * _this.data.scale, 422 * _this.data.scale,
                360 * _this.data.scale, 360 * _this.data.scale
              );
            } else if (pres.type == "avatar") {
              var s_x = 0;
              var s_y = (pres.data.height - pres.data.width) / 2;
              var s_w = pres.data.width;
              if (pres.data.width > pres.data.height) {
                s_w = pres.data.height;
                s_y = 0;
                s_x = (pres.data.width - pres.data.height) / 2;
              }
              _this.data.ctx.beginPath()
              _this.data.ctx.arc(345 * _this.data.scale, 90 * _this.data.scale, 51 * _this.data.scale, 0, 2 * Math.PI, false)
              _this.data.ctx.clip()
              _this.data.ctx.drawImage(
                pres.data.path,
                s_x, s_y,
                s_w, s_w,  //被剪切图像的高度。
                294 * _this.data.scale, 39 * _this.data.scale,
                102 * _this.data.scale, 102 * _this.data.scale
              );
              _this.data.ctx.restore();
            }
          }
          _this.data.ctx.draw(true, setTimeout(() => {
            _this.fixImage();
          }, 0))
          _this.data.ctx.restore();
        }).catch(err => {
          console.log(err);
          _this.data.ctx.draw(true, setTimeout(() => {
            _this.fixImage();
          }, 0))
          _this.data.ctx.restore();
        });
      } else {
        _this.data.alert.hide()
        showToast(res.msg)
      }
    });
  },
  fixImage:function(){
    var _this = this
    setTimeout(()=>{ 
      wx.canvasToTempFilePath({
        canvasId: "canvas",
        fileType: "png",
        success: (res) => {
          let tempFilePath = res.tempFilePath;
          _this.setData({
            shareImg: tempFilePath,
          });
          console.log("画背景", tempFilePath)
          _this.data.alert.hide()
        }
      });
    },500)
  },
  // 文本自动换行
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },

  //保存canvas图
  canvasSave() {
    let _this = this;
    if(!is_empty(_this.data.shareImg)){
      wx.saveImageToPhotosAlbum({//保存图片到系统相册
        filePath: _this.data.shareImg,
        success: () => {
          wx.showToast({
            title: '图片保存成功'
          })
        }
      })
    }else{
      wx.showToast({
        title: '请等待海报生成',
        icon:"none"
      })
    }
  },
  getUserInfo:function(e){
    var _this = this;
    console.log(e)
    if (!is_empty(e.detail.userInfo)) {
      var userInfo = e.detail.userInfo;
      app.globalData.userInfo = extendObj([{}, app.globalData.userInfo, {
        wxNickName: userInfo.nickName ? userInfo.nickName : app.globalData.userInfo.wxNickName,
        wxAvatarUrl: userInfo.avatarUrl ? userInfo.avatarUrl : app.globalData.userInfo.wxAvatarUrl,
        wxInfoAuth: true
      }])
      _this.setData({
        isAuth:true
      },function(){
        _this.drawPost();
      })
    }
  },
  //复制提取码
  copy_code: function () {
    let _this = this;
    copy_code(_this.data.copy_code);
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