// pages/editjiapu/editjiapu.js
import {
  extendObj, is_empty, is_number,doPost
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')

Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    treejiapu:null,
    circlejiapu:null,
    frameID:"tree",
    treeUserId:"",
    circleUserId:"",
    backBtn:true,
    familyId:0,
    initFlag:{
      tree:false,
      circle:false,
      table:false,
    },
    member_data: null,
    showFull: false,
    showop: false,
    showAddMember:false,
    showEditMember:false,
    showsearch: false,
    showsearchlist: false,
    search_form: {
      fullname: "",
      namezi: "",
      fname: "",
      mname: ""
    },
    searchlist:[],
    baseOss: config.baseOss,
    editinfo:{
      member:null,//当前点击的人
      editform:null,//编辑对象，编辑对象可能是点击的人
      left:0,
      top:0
    },
    ctx: null,
    fullwidth:0,
    fullheight:0,
    zoomwidth:0,
    zoomheight:0,
    width: 0,
    height: 0,
    member_list: [],
    userInfo: {},
    showtype: "edit",
    userId: "",
    shareid: "",
    sharecode: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    _this.data.treejiapu = _this.selectComponent("#treejiapu")
    _this.data.circlejiapu = _this.selectComponent("#circlejiapu")
    if (is_empty(app.globalData.userInfo.userid) && (!is_empty(options.showType) && options.showType!='share')) {
      wx.redirectTo({
        url: '../login/login'
      })
    } else {
      _this.data.userInfo = app.globalData.userInfo
      _this.data.userId = app.globalData.userInfo.userid
      _this.data.treeUserId = app.globalData.userInfo.userid
      _this.data.circleUserId = app.globalData.userInfo.userid
      _this.data.familyId = app.globalData.userInfo.familyid

      if (!is_empty(options.showType)) {
        _this.data.showtype = options.showType
        if (options.showType=="share"){
          _this.setData({
            backBtn:false
          })
        }
      }
      if (!is_empty(options.shareId) && is_number(options.shareId)) {
        _this.data.shareid = parseInt(options.shareId);
      }
      if (!is_empty(options.shareCode)) {
        _this.data.sharecode = options.shareCode
      }
      if (!is_empty(options.userId)) {
        _this.data.treeUserId = options.userId
        _this.data.circleUserId = options.userId
        _this.data.userId = options.userId
      }
      if (!is_empty(options.familyId) && is_number(options.familyId)) {
        _this.data.familyId = parseInt(options.familyId);
      }
    }
    var w_w = wx.getSystemInfoSync().windowHeight
    var w_h = wx.getSystemInfoSync().windowWidth
    var query = wx.createSelectorQuery().in(_this)
    query.select('#frame_content').boundingClientRect((res) => {
      var c_w = res.width;
      var c_h = res.height;
      _this.data.fullheight = w_h - 25
      _this.data.fullwidth = w_w
      _this.data.zoomheight = c_h - 1
      _this.data.zoomwidth = c_w
      _this.data.height = c_h - 1
      _this.data.width = c_w
    }).exec();
  },
  changeFrame:function(e){
    var _this = this;
    var id = e.currentTarget.dataset.id;
    if (id && typeof (_this.data.initFlag[id]) != 'undefined') {
      _this.setData({
        frameID: id
      },function(){
        if (!_this.data.initFlag[id]) {
          _this.init(id)
        }
      })
    }
  },
  changeFull: function () {
    var _this = this;
    _this.setData({
      showFull: _this.data.showFull?false:true
    })
  },
  backSelf:function(){
    var _this = this
    if (_this.data.frameID == "tree") {
      _this.data.treeUserId = _this.data.userId
    } else if (_this.data.frameID == "circle") {
      _this.data.circleUserId = _this.data.userId
    }
    _this.init(_this.data.frameID)
  },
  showSearchForm: function () {
    var _this = this
    if(_this.data.frameID == "tree"){
      _this.data.treejiapu.showSearchForm()
    }else if(_this.data.frameID == "circle"){
      _this.data.circlejiapu.showSearchForm()
    }
  },
  init:function(id){
    var _this = this
    //var dataset = "initFlag."+id
    if(id=="tree"){
      _this.data.treejiapu.init({
        userId: _this.data.treeUserId,
        familyid:_this.data.familyId,
        name_width: 80,
        name_height: 20,
        name_fontsize: 12,
        space_width: 20,
        space_height: 30,
        line_width:1,
        line_color:"#7e5a44",
        levels: 5,
        levelBtn:false,
        searchBtn:false,
        backBtn:false,
        sharestart: _this.data.userId,
        showtype: _this.data.showtype,
        shareid: _this.data.shareid,
        sharecode: _this.data.sharecode,
        left:_this.data.width/2,
        top:_this.data.height/2,
        tap:function(member){
          _this.data.treejiapu.showEdit(member)
        },
        dbtap: function (member) {
          _this.data.treejiapu.init({ userId: member.id })
        },
        longtap:function(member){},
        edittap: function (member) {
          _this.editMember(member)
          _this.data.treejiapu.hideEdit()
        },
        viewtap:function(member){
          _this.data.treejiapu.showDetailInfo(member)
          _this.data.treejiapu.hideEdit()
          //_this.viewMember(member)
        },
        addtap: function (member, type) {
          _this.addMemberByType(member, type)
          _this.data.treejiapu.closeAddForm()
          _this.data.treejiapu.hideEdit()
        },
        deltap: function (member) {
          _this.delMember(member)
          _this.data.treejiapu.hideEdit()
        },
        sharetap: function (member) {
          _this.data.treejiapu.hideEdit()
          _this.shareMember(member)
        },
      })
    }else if(id=="circle"){
      var scale = 1;
      if ((_this.data.height / _this.data.width) < Math.cos(60 * Math.PI / 180)) {
        if (_this.data.height < 120 * 4) {
          scale = _this.data.height / ((120 * (5) * 2 + 200) * Math.cos(60 * Math.PI / 180))
        } else {
          scale = (_this.data.height) / ((120 * (5) * 2 + 200) * Math.cos(60 * Math.PI / 180));
        }
      } else {
        if (_this.data.width < 120 * 4) {
          scale = _this.data.width / (120 * (5) * 2 + 200);
        } else {
          scale = (_this.data.width) / (120 * (5) * 2 + 200);
        }
      }
      _this.data.circlejiapu.init({
        userId: _this.data.circleUserId,
        familyid:_this.data.familyId,
        center_circle: {			//中间环
          url: config.baseOss +"/attachment/images/middl_circle.png",
          x: (500 - 288) * 2.4,
          y: (500 - 255) * 2.4,
          w: 528 * 2.4,
          h: 501 * 2.4,
        },
        base_line: {
          url: config.baseOss +"/attachment/images/base_line.png",
          x: (500 - 313) * 2.4 * 0.9,
          y: (500 - 81) * 2.4 * 0.9,
          w: 825 * 2.4 * 0.9,
          h: 159 * 2.4 * 0.9,
        },
        name_width: 90,
        name_height: 60,
        name_fontsize: 16,
        line_width: 2,
        space_width: 120,
        rotateX: 60,
        levels: 5,
        levelBtn:false,
        searchBtn:false,
        helpBtn:false,
        backBtn: false,
        showtype: _this.data.showtype,
        sharestart: _this.data.userId,
        shareid: _this.data.shareid,
        sharecode: _this.data.sharecode,
        left:_this.data.width/2,
        top:_this.data.height/2,
        scale:scale,
        tap:function(member){
          _this.data.circlejiapu.showDetailInfo(member)
          //_this.data.circlejiapu.showEdit(member)
        },
        dbtap: function (member) {
          _this.data.circlejiapu.init({ userId: member.id })
        },
        longtap:function(member){},
        edittap: function (member) {
          //_this.data.circlejiapu.hideEdit()
          //_this.editMember(member)
        },
        viewtap: function (member) {
          _this.data.circlejiapu.showDetailInfo(member)
          _this.data.treejiapu.hideEdit()
          //_this.viewMember(member)
        },
        addtap: function (member, type) {
          //_this.data.circlejiapu.hideEdit()
          //_this.addMemberByType(member,type)
        },
        deltap: function (member) {
          //_this.data.circlejiapu.hideEdit()
          //_this.delMember(member)
        },
        sharetap: function (member) {
          //_this.data.circlejiapu.hideEdit()
          //_this.shareMember(member)
        },
      })

    }else if(id=="table"){

    }
    _this.data.initFlag[id] = true
    /*_this.setData({
      [dataset]: true
    })*/
  },
  editMember: function (member) {
    var _this = this;
    wx.navigateTo({
      url: '../editmember/editmember?type=edit&userid=' + member.id + '&showtype=' + _this.data.showtype + '&shareid=' + _this.data.shareid + '&sharecode=' + _this.data.sharecode + '&familyid=' + _this.data.familyId,
    })
  },
  viewMember: function (member) {
    var _this = this;
    wx.navigateTo({
      url: '../editmember/editmember?type=edit&userid=' + member.id + '&showtype=' + _this.data.showtype + '&shareid=' + _this.data.shareid + '&sharecode=' + _this.data.sharecode + '&familyid=' + _this.data.familyId,
    })
  },
  addMemberByType: function (member,type) {
    var _this = this;
    if (type) {
      wx.navigateTo({
        url: '../editmember/editmember?type=add&fromid=' + member.id + '&userid=&relationship=' + type + '&showtype=' + _this.data.showtype + '&shareid=' + _this.data.shareid + '&sharecode=' + _this.data.sharecode + '&familyid=' + _this.data.familyId,
      })
    }
  },
  shareMember: function (member) {
    var _this = this;
    wx.navigateTo({
      url: '../initiate_sharing/initiate_sharing?startMemberId=' + member.id + "&shareId=" + _this.data.shareid + "&familyId=" + _this.data.familyId,
    })
  },
  delMember: function (member) {
    var _this = this;
    var operatorId = app.globalData.userInfo.userid;  //操作人id
    wx.showModal({
      title: '提示',
      confirmText: "删除",
      confirmColor: "#F00",
      content: '确定删除'+member.name+"？",
      success(res) {
        if (res.confirm) {
          doPost('/wx/familyMember/removeFamilyMember', {
            "inmap": {
              "id": member.id,
              "operatorId": operatorId,
              "familyId": _this.data.familyId,
              "type": _this.data.showtype,
              "shareId": _this.data.shareid,
              "shareCode": _this.data.sharecode,
            }
          }, function (res) {
            if (res.code == 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              _this.setData({ showop: false });
              _this.init(_this.data.frameID);
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              });
              _this.setData({ showop: false });
            }
          })
        } else if (res.cancel) {
        }
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
    var _this = this
    if (is_empty(app.globalData.userInfo.openid)){
      app.userInfoReadyCallback = res => {
        if (_this.data.initFlag[_this.data.frameID]) {
          if (_this.data.frameID == "tree") {
            _this.data.treejiapu.init();
          } else if (_this.data.frameID == "circle") {
            _this.data.circlejiapu.init();
          } else if (_this.data.frameID == "table") {
          }
        } else {
          _this.init(_this.data.frameID);
        }
      }
    }
    if (_this.data.initFlag[_this.data.frameID]) {
      if (_this.data.frameID == "tree") {
        _this.data.treejiapu.init();
      } else if (_this.data.frameID == "circle") {
        _this.data.circlejiapu.init();
      } else if (_this.data.frameID == "table") {
      }
    } else {
      _this.init(_this.data.frameID);
    }
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