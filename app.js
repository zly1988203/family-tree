//app.js
import {
  extendObj, doPost,is_empty
} from "./utils/util.js"
const config = require("./config.js")
App({
  onLaunch: function () {
    var _this = this
    if (config.debug) {
      var res = {
        code: 0,
        data: {
          "openId": "o3FxX45185oyUmic9QGLHfpgr27c",
          "user": [
            {
              //"id": "152e4898-2166-41a3-bb2c-f06f93efe7e0",
              "id": "b0549ae6-97a5-4119-ad54-6e8cd551cb54",
              "familyId": 17053,
              "name": "刘鑫",
              "account": "mmxp10600878",
              "mobile": "15874871105",
              "headImg": "http://qiniu.mmxp5000.com/user/head/0030ffa97e0512490c8aa375c89e4e6a.png"
            }
          ]
        },
        msg: "成功"
      }
      var userinfo = res.data.user[0];
      _this.globalData.userInfo = extendObj([{}, _this.globalData.userInfo, {
        openid: res.data.openId,
        userid: userinfo.id,
        familyid: userinfo.familyId,
        nickName: userinfo.name ? userinfo.name : _this.globalData.userInfo.nickName,
        account: userinfo.account,
        mobile: userinfo.mobile,
        avatarUrl: userinfo.headImg ? userinfo.headImg : _this.globalData.userInfo.avatarUrl,
        childOrder: userinfo.childOrder ? userinfo.childOrder : '',
      }])
      if (_this.userInfoReadyCallback) {
        _this.userInfoReadyCallback(res)
      }
    } else {
      _this.getUserInfo(function (res) {
        if (res.code == 0 && res.data.user.length == 1) {
          var userinfo = res.data.user[0];
          _this.globalData.userInfo = extendObj([{}, _this.globalData.userInfo, {
            userid: userinfo.id,
            familyid: userinfo.familyId,
            nickName: userinfo.name ? userinfo.name : _this.globalData.userInfo.nickName,
            account: userinfo.account,
            mobile: userinfo.mobile,
            avatarUrl: userinfo.headImg ? userinfo.headImg : _this.globalData.userInfo.avatarUrl,
            childOrder: userinfo.childOrder ? userinfo.childOrder : '',
          }])
        }
        if (_this.userInfoReadyCallback) {
          _this.userInfoReadyCallback(res)
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = extendObj([{}, _this.globalData.userInfo, {
                nickName: _this.globalData.userInfo.nickName ? _this.globalData.userInfo.nickName : res.userInfo.nickName,
                avatarUrl: _this.globalData.userInfo.avatarUrl ? _this.globalData.userInfo.avatarUrl : res.userInfo.avatarUrl,
                wxNickName: _this.globalData.userInfo.wxNickName ? _this.globalData.userInfo.wxNickName : res.userInfo.nickName,
                wxAvatarUrl: _this.globalData.userInfo.wxAvatarUrl ? _this.globalData.userInfo.wxAvatarUrl : res.userInfo.avatarUrl,
                wxInfoAuth:true
              }])
            }
          })
        }else{

        }
      }
    })
    //wx.setStorageSync('logs', logs)
    //更新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log('发现更新',res)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function (res) {
      console.log('更新失败',res)
    })
  },
  getUserInfo: function (func_callback) {
    var _this = this
    // 登录
    wx.login({
      success: res => {
        doPost('/wx/user/loginByCode', { code: res.code }, function (res) {
          //返回openid
          if (!is_empty(res.data) && !is_empty(res.data.openId)) {
            _this.globalData.userInfo.openid = res.data.openId
          }
          if(func_callback instanceof Function){
            func_callback(res)
          }
        })
      }
    })
  },
  globalData: {
    userInfo: {
      userid:"",
      familyid:0,
      openid:"",
      nickName: "",
      account: "",
      mobile: "",
      avatarUrl:"",
      childOrder:'',
      wxNickName: '',
      wxAvatarUrl: '',
      wxInfoAuth:false,
    }
  }
})