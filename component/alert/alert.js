// component/alert/alert.js
import {
  extendObj, is_empty, is_number, doPost
} from "../../utils/util.js"
const app = getApp()
const config = require("../../config.js")
var imageonetouch = {
  x: 0,
  y: 0
}
var imagemovetype = '';
var imagetouchmoving = false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    title:"",
    msg:"",
    type:"alert",
    coverClose:false,
    show:false,
    loadingIcon:'',
    css:{
      tips: {
        color: "#fff",
        background: "#ef473a",
        close: config.baseOss + "/attachment/images/info_close.png"
      },
      payment: {
        close: config.baseOss + "/attachment/images/info_close.png",
      }
    },
    list:{
      value:0,
      data:[],
      btn:"确定",
      callback: null
    },
    payinfo:{
      total_fee:0,
      type: "weixin",
      qrcode: ''
    },
    imageinfo:{
      tempFilePath: '',
      imagedata: '',
      square:false,
      left:0,
      top:0,
      width:0,
      height:0,
      scale:1,
      showwidth:0,
      showheight:0,
      imagewidth:0,
      imageheight:0,
      canvaswidth:0,
      canvasheight: 0,
      callback: null
    }
  },
  methods: {
    init:function(options){
      var _this = this;
      var _d = extendObj([{},_this.data,options]);
      _this.setData(_d);
    },
    hide: function () {
      this.setData({
        show: false
      })
    },
    coverClick: function () {
      var _this = this;
      if (_this.data.coverClose) {
        _this.setData({
          show: false
        })
      }
    },
    listSubmit: function () {
      var _this = this;
      if (_this.data.list.callback instanceof Function){
        _this.data.list.callback(_this.data.list.data[_this.data.list.value])
      }
    },
    listCheck:function(e){
      var _this = this;
      _this.setData({
        ["list.value"]:e.detail.value
      })
    },
    list: function (obj) {
      var _this = this;
      _this.setData({
        type: "list",
        coverClose: obj.coverClose ? obj.coverClose:false,
        list: extendObj([{}, {
          value: 0,
          data: [],
          btn: "确定",
          callback: null,
          index:0
        },obj]),
        show: true
      })
    },
    tips:function(msg,times){
      var _this = this;
      _this.setData({
        type:"tips",
        msg:msg,
        show:true
      })
      if (times) {
        setTimeout(function () { 
          _this.setData({
            show: false
          })
        }, times)
      }
    },
    loading: function (msg,icon, coverClose) {
      var _this = this;
      msg = msg?msg:"";
      icon = icon ? icon:"";
      _this.setData({
        type: "loading",
        loadingIcon:icon,
        msg: msg,
        show: true, 
        coverClose: coverClose ? coverClose : false,
      })
    },
    payment:function(options){
      var _this = this;
      var params = extendObj([{},{
        paytype:'jsapi',
        ordersn:'',
        openid:app.globalData.userInfo.openid,
        total_fee:0,
        callback:null
      }, options])
      var re = {
        code: -1,
        msg: "",
        data: null
      }
      if (params.paytype == 'jsapi') {
        doPost('/message/weChat/Pay', { 
          inmap: { 
            openid: params.openid, 
            out_trade_no: params.ordersn
          } 
        },function(res){
          if (res.errno == 0) {//成功
            wx.requestPayment({
              timeStamp: res.data.info.timeStamp,
              nonceStr: res.data.info.nonceStr,
              package: res.data.info.package,
              signType: 'MD5',
              paySign: res.data.info.paySign,
              success(res) {
                re.code = 1
                re.data = res
                if (params.callback instanceof Function) {
                  params.callback(re)
                }
              },
              fail(res) {
                re.data = res
                if (params.callback instanceof Function) {
                  params.callback(re)
                }
              }
            })
          } else {
            re.data = res.data
            re.msg = res.msg
            if (params.callback instanceof Function) {
              params.callback(re)
            }
          }
        })
      } else {
        doPost('/wechatpay/generatePayQrcode', {
          "inmap": { 
            "appID": "wxf6a0ed9b4e89667b", 
            "mchID": "1248756201", 
            "key": "ZDXKK2016WISESTAR20161129KABHGLE", 
            "connectionName": "mmxp", 
            "body": "小程序二维码支付", 
            "out_trade_no": "66666", 
            "total_fee": "1", 
            "spbill_create_ip": "127.0.0.1",
            "sessionId":"11111" 
          } 
        }, function (res) {
          if (res.errno == 0) {//成功
            _this.setData({
              type: "payment",
              show: true,
              payinfo: {
                total_fee: 10,
                type: "weixin", 
                qrcode: res.data.results.imgurl
              }
            })
            setInterval(function(){
              //检测支付成功
              //_this.closePayment()
            }, 3000)
          } else {
            re.data = res.data
            re.msg = res.msg
            if (params.callback instanceof Function) {
              params.callback(re)
            }
          }
        })
      }
    },
    closePayment: function () {
      var _this = this
      _this.setData({
        type: "",
        show: false,
        payinfo: {
          total_fee: 0,
          type: "",
          qrcode: ''
        }
      })
    },
    imageSelect: function (tempFilePath, issquare, callback) {
      var _this = this
      if (tempFilePath) {
        new Promise(function (resolve, reject) {
          wx.getImageInfo({
            src: tempFilePath,
            success(res) {
              resolve(res)
            }
          })
        }).then(res => {
          var img_w = res.width;
          var img_h = res.height;
          var img_t = res.type;
          _this.setData({
            type: "image",
            show: true,
            imageinfo: extendObj([{}, _this.data.imageinfo, {
              tempFilePath: tempFilePath,
              imagedata: "data:image/" + img_t+";base64," + wx.getFileSystemManager().readFileSync(tempFilePath, 'base64'),
              square: issquare ? true : false,
              imagewidth: img_w,
              imageheight: img_h,
              callback: callback
            }])
          }, function () {
            var query = wx.createSelectorQuery().in(_this)
            query.select('#image_select_content').boundingClientRect()
            query.exec((res) => {
              var c_w = res[0].width;
              var c_h = res[0].height;
              var sc = c_w/img_w;
              if(c_w/c_h > img_w/img_h){
                sc = c_h/img_h;
              }
              var w = img_w * sc;
              var t = (img_h - img_w) * sc / 2;
              var l = 0;
              if (img_h * sc < w){
                w = img_h * sc;
                t = 0;
                l = (img_w - img_h) * sc / 2
              }
              _this.setData({
                imageinfo: extendObj([{}, _this.data.imageinfo, {
                  scale: sc,
                  width:w,
                  height:w,
                  left:l,
                  top:t,
                  showwidth: img_w * sc,
                  showheight: img_h * sc,
                  canvaswidth: w/sc,
                  canvasheight: w/sc,
                }])
              });
            });
          })
        })
      }
    },
    imageSubmit: function () {
      var _this = this
      var context = wx.createCanvasContext('image_cut', _this)
      var c_w = _this.data.imageinfo.width / _this.data.imageinfo.scale;
      var c_h = _this.data.imageinfo.height / _this.data.imageinfo.scale
      _this.setData({
        imageinfo: extendObj([{}, _this.data.imageinfo,{
          canvaswidth: c_w,
          canvasheight: c_h,
        }])
      }, function () {
        context.clearRect(0, 0, c_w, c_h);
        context.save();
        context.drawImage(
          _this.data.imageinfo.tempFilePath,
          _this.data.imageinfo.left / _this.data.imageinfo.scale,
          _this.data.imageinfo.top / _this.data.imageinfo.scale,
          c_w, c_h,  //被剪切图像的高度。
          0, 0,
          c_w, c_h
        );
        context.draw(true, setTimeout(() => {
          wx.canvasToTempFilePath({
            x:0,
            y:0,
            width: c_w,
            height: c_h,
            destWidth: c_w,
            destHeight: c_h,
            canvasId: "image_cut",
            fileType: "png",
            success: (res) => {
              var tempFilePath = res.tempFilePath;
              if (_this.data.imageinfo.callback instanceof Function) {
                _this.data.imageinfo.callback(tempFilePath)
              }
              _this.closeImage();
            },
            fail: () => {
              _this.closeImage();
              _this.tips("截图出错，请更换图片重试", 2000);
            }
          }, _this);
        }, 100))
        context.restore();
      })
    },
    closeImage: function () {
      var _this = this;
      _this.setData({
        type: "",
        show: false,
        imageinfo: {
          tempFilePath: '',
          imagedata:'',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          scale: 1,
          showwidth: 0,
          showheight: 0,
          imagewidth: 0,
          imageheight: 0,
          canvaswidth: 0,
          canvasheight: 0,
          callback: null
        }
      })
    },
    imageMoveStart:function(e){
      var _this = this;
      imagemovetype = e.currentTarget.dataset.type;
      imageonetouch = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      }
    },
    imageMoveMove: function (e) {
      var _this = this;
      if (!imagetouchmoving) {
        imagetouchmoving = true;
        setTimeout(() => { imagetouchmoving = false }, 100)//节流算法，40毫秒响应一次移动，25帧标准
        var onePointDiffX = e.touches[0].pageX - imageonetouch.x
        var onePointDiffY = e.touches[0].pageY - imageonetouch.y
        if (imagemovetype == "c") {
          var l = _this.data.imageinfo.left + onePointDiffX;
          var t = _this.data.imageinfo.top + onePointDiffY;
          l = l < 0 ? 0 : l
          t = t < 0 ? 0 : t
          l = (l + _this.data.imageinfo.width) > _this.data.imageinfo.showwidth ? _this.data.imageinfo.showwidth - _this.data.imageinfo.width : l
          t = (t + _this.data.imageinfo.height) > _this.data.imageinfo.showheight ? _this.data.imageinfo.showheight - _this.data.imageinfo.height : t
          _this.setData({
            imageinfo: extendObj([{}, _this.data.imageinfo,{left:l,top:t}])
          })
        } else if (imagemovetype == "tl") {
          var l = _this.data.imageinfo.left + onePointDiffX;
          var t = _this.data.imageinfo.top + onePointDiffY;
          l = l < 0 ? 0 : l
          t = t < 0 ? 0 : t
          l = l > (_this.data.imageinfo.left + _this.data.imageinfo.width) ? (_this.data.imageinfo.left + _this.data.imageinfo.width) : l
          t = t > (_this.data.imageinfo.top + _this.data.imageinfo.height) ? ((_this.data.imageinfo.top + _this.data.imageinfo.height)) : t
          var w = (_this.data.imageinfo.width - l + _this.data.imageinfo.left)
          var h = (_this.data.imageinfo.height - t + _this.data.imageinfo.top)
          var squre = w > h ? h : w
          if (_this.data.imageinfo.square){
            w = squre
            h = squre
          }
          _this.setData({
            imageinfo: extendObj([{}, _this.data.imageinfo, { left: l, top: t, width: w, height: h}])
          })
        } else if (imagemovetype == "tr") {
          var w = _this.data.imageinfo.width + onePointDiffX;
          var t = _this.data.imageinfo.top + onePointDiffY;
          w = w < 0 ? 0 : w
          t = t < 0 ? 0 : t
          t = t > (_this.data.imageinfo.top + _this.data.imageinfo.height) ? ((_this.data.imageinfo.top + _this.data.imageinfo.height)) : t
          w = (w + _this.data.imageinfo.left) > _this.data.imageinfo.showwidth ? _this.data.imageinfo.showwidth - _this.data.imageinfo.left : w
          var h = (_this.data.imageinfo.height - t + _this.data.imageinfo.top)
          var squre = w > h ? h : w
          if (_this.data.imageinfo.square) {
            w = squre
            h = squre
          }
          _this.setData({
            imageinfo: extendObj([{}, _this.data.imageinfo, { top: t, width: w, height: h }])
          })
        } else if (imagemovetype == "bl") {
          var l = _this.data.imageinfo.left + onePointDiffX;
          var h = _this.data.imageinfo.height + onePointDiffY;
          l = l < 0 ? 0 : l
          h = h < 0 ? 0 : h
          l = l > (_this.data.imageinfo.left + _this.data.imageinfo.width) ? (_this.data.imageinfo.left + _this.data.imageinfo.width) : l
          var w = (_this.data.imageinfo.width - l + _this.data.imageinfo.left)
          h = (_this.data.imageinfo.top + h) > _this.data.imageinfo.showheight ? (_this.data.imageinfo.showheight - _this.data.imageinfo.top) : h
          var squre = w > h ? h : w
          if (_this.data.imageinfo.square) {
            w = squre
            h = squre
          }
          _this.setData({
            imageinfo: extendObj([{}, _this.data.imageinfo, { left: l, width: w, height: h }])
          })
        } else if (imagemovetype == "br") {
          var w = _this.data.imageinfo.width + onePointDiffX;
          var h = _this.data.imageinfo.height + onePointDiffY;
          w = w < 0 ? 0 : w
          h = h < 0 ? 0 : h
          w = (w + _this.data.imageinfo.left) > _this.data.imageinfo.showwidth ? _this.data.imageinfo.showwidth - _this.data.imageinfo.left : w
          h = (_this.data.imageinfo.top + h) > _this.data.imageinfo.showheight ? (_this.data.imageinfo.showheight - _this.data.imageinfo.top) : h
          var squre = w > h ? h : w
          if (_this.data.imageinfo.square) {
            w = squre
            h = squre
          }
          _this.setData({
            imageinfo: extendObj([{}, _this.data.imageinfo, { width: w, height: h }])
          })
        }
        imageonetouch = {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
      }
    },
    imageMoveEnd: function (e) {
      var _this = this;
      imagemovetype = '';
      imagetouchmoving = false;
    },
  }
})
