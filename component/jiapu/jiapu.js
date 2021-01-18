import {
  extendObj, is_empty, is_number,doPost
} from "../../utils/util.js"
const computedBehavior = require('miniprogram-computed')
const app = getApp()
const config = require("../../config.js")
var commonMixin = require('../../utils/commonMixin.js')
var isonetouch = true
var onetouch = {
    x: 0,
    y: 0
  }
var twotouch = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
}
var touchmoving = false;
Component({
  behaviors: [computedBehavior],
  data: {
    // 组件内使用到的一些变量
    alert:null,
    backBtn:true,
    levelBtn:true,
    searchBtn:true,
    helpBtn:true,
    changelevels:false,
    showsearch: false,
    showsearchlist: false,
    showdetail:false,
    showhelp:false,
    showop:false,
    showAddMember:false,
    tap:null,
    dbtap:null,
    longtap:null,
    edittap:null,
    viewtap:null,
    addtap:null,
    deltap:null,
    sharetap:null,
    width:0,
    height:0,
    member_list:[],
    click_count:0,
    dbclick_timeout: null,
    showtype: "first",
    userId: "",
    sharestart:"",
    shareid: "",
    sharecode: "",
    scale : 1,
    rotate : 0,
    ctx: null,
    editinfo:{
      member: null,
      btns: [],
      x:0,
      y:0
    },
    member_scaleY: 1,
    op_scaleY:1,
    familyId:0,
    detailinfo: {
      gender: '',
      name: '',
      birthTime: '',
      deathTime: '',
      age: '',
      fatherName: '',
      motherName: '',
      description: ''
    },
    search_form: {
      fullname:"",
      namezi:"",
      fname:"",
      mname:""
    },
    searchlist: [],
    childType: {
      "NORMAL": "亲子",
      "STEP": "继子",
      "FZCF": "出抚",
      "EMPTY": "",
      "FUSUN": "抚孙",
    },
    member_base_css:{
        width: 0,
        height: 0,
        borderRadius: 0,
        fontSize: 0,
        lineHeight: 0
    },
    canvas_css:{
        width: 0,
        height: 0
    },
    jiapu_content_css:{
        width:0,
        height:0,
        rotateX:0,
        left: 0,
        top: 0,
        rotateZ:0
    },
    jiapu_bg_css:{
        width: 0,
        height: 0,
        borderRadius: 0
    },
    jiapu_circle_css:{
      width: 0,
      height: 0,
      borderRadius: 0,
      rotate:0,
      backgroundImagePath: "",
    },
    es_bg: {
      borderColor: "transparent",
      background: "url('" + config.baseOss +"/attachment/images/es_bg.png') center center no-repeat",
      backgroundSize:"auto 100%",
      borderRadius:0,
    },
    ed_bg: {
      borderColor: "transparent",
      background: "url('" + config.baseOss +"/attachment/images/ed_bg.png') center center no-repeat",
      backgroundSize: "auto 100%",
      borderRadius: 0,
    },
    man_bg: {
      borderColor: "transparent",
      background: "url('" + config.baseOss +"/attachment/images/man_bg.png') center center no-repeat",
      backgroundSize: "auto 100%",
      borderRadius: 0,
    },
    fm_bg: {
      borderColor: "transparent",
      background: "url('" + config.baseOss +"/attachment/images/fm_bg.png') center center no-repeat",
      backgroundSize: "auto 100%",
      borderRadius: 0,
    },
    sel_bg: {
      borderColor: "transparent",
      background: "url('" + config.baseOss +"/attachment/images/sel_bg.png') center center no-repeat",
      backgroundSize: "auto 100%",
      borderRadius: 0,
    },
    died_bg: {
      borderColor: "transparent",
      background: "url('" + config.baseOss +"/attachment/images/died_bg.png') center center no-repeat",
      backgroundSize: "auto 100%",
      borderRadius: 0,
    },
    member_self_css: {},
    member_man_css: {},
    member_female_css: {},
    member_died_css: {},
    member_unknow_css: {},
    member_man_sort1_css: {},
    member_female_sort1_css: {},
    //插件使用到的一些变量
    member_data: null,		//数据
    center_circle: {			//中间环
      url: "",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    },
    base_line: {			//长子线
      url: "",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    },
    space_width: 50,		//环间距
    name_width: 48,
    name_height: 48,
    name_fontsize: 14,
    line_width: 1,
    levels: 5,		//9代，5代
    onclickmember: null,		//点击用户事件
    ondbclickmember: null,		//双击用户事件
    rotateX: 60,		//沿X轴反转角度
    landscape:true,//是否横屏
    baseOss:config.baseOss,
    xhrpromise:[],
  },
  computed:{
    levelName:function(data){
      var ln = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
      return ln[data.levels] + "世";
    }
  },
  lifetimes:{
    attached: function () {
      const _this = this
      _this.data.alert = _this.selectComponent("#alert")
      _this.data.userId = app.globalData.userInfo.userid
      _this.data.familyid = app.globalData.userInfo.familyid
      var context = wx.createCanvasContext('jiapu_views', _this)
      _this.data.ctx = context
      /*_this.setData({
        ctx: context
      })*/
      var query = wx.createSelectorQuery().in(_this)
      //query.select('#jiapu_views').fields({ node: true, size: true }).exec((res) => {
      //  var canvas = res[0].node
      //  var ctx = canvas.getContext('2d')
      //  _this.data.ctx = ctx
      //})
      query.select('#jiapu_outside_box').boundingClientRect((res) => {
        var c_w = res.width;
        var c_h = res.height;
        var scale = 1;
        if (_this.data.landscape) {
          if ((c_h / c_w) < Math.cos(_this.data.rotateX * Math.PI / 180)) {
            if (c_h < _this.data.space_width * 4) {
              scale = c_h / ((_this.data.space_width * (_this.data.levels) * 2 + 200) * Math.cos(_this.data.rotateX * Math.PI / 180))
            } else {//c_w - 50;//留空隙
              scale = (c_h) / ((_this.data.space_width * (_this.data.levels) * 2 + 200) * Math.cos(_this.data.rotateX * Math.PI / 180));
            }
          } else {
            if (c_w < _this.data.space_width * 4) {
              scale = c_w / (_this.data.space_width * (_this.data.levels) * 2 + 200);
            } else {//c_h - 50;//留空隙
              scale = (c_w) / (_this.data.space_width * (_this.data.levels) * 2 + 200);
            }
          }
        } else {
          if ((c_w / c_h) < Math.cos(_this.data.rotateX * Math.PI / 180)) {
            if (c_w < _this.data.space_width * 4) {
              scale = c_w / ((_this.data.space_width * (_this.data.levels) * 2 + 200) * Math.cos(_this.data.rotateX * Math.PI / 180));
            } else {//c_w - 50;//留空隙
              scale = (c_w) / ((_this.data.space_width * (_this.data.levels) * 2 + 200) * Math.cos(_this.data.rotateX * Math.PI / 180));
            }
          } else {
            if (c_h < _this.data.space_width * 4) {
              scale = c_h / (_this.data.space_width * (_this.data.levels) * 2 + 200);
            } else {//c_h - 50;//留空隙
              scale = (c_h) / (_this.data.space_width * (_this.data.levels) * 2 + 200);
            }
          }
        }
        _this.data.height = c_h
        _this.data.width = c_w
        _this.setData({
          //height: c_h,
          //width: c_w,
          scale: scale,
          jiapu_content_css: extendObj([{}, _this.data.jiapu_content_css, {
            left: c_w / 2,
            top: c_h / 2
          }])
        })
      }).exec();
    }
  },
  methods: {
    naviback:function(){
      var _this = this
      wx.navigateBack({
        delta: 1
      })
    },
    init: function (obj) {
      var _this = this
      if (obj) {
        if (!is_empty(obj.scale)) {
          _this.setData({
            scale:obj.scale
          })
        }
        if (!is_empty(obj.left)) {
          _this.setData({
            jiapu_content_css: extendObj([{}, _this.data.jiapu_content_css, {
              left: obj.left
            }])
          })
        }
        if (!is_empty(obj.top)) {
          _this.setData({
            jiapu_content_css: extendObj([{}, _this.data.jiapu_content_css, {
              top: obj.top
            }])
          })
        }
        if (!is_empty(obj.backBtn)) {
          _this.setData({
            backBtn:obj.backBtn
          })
        }
        if (!is_empty(obj.levelBtn)) {
          _this.setData({
            levelBtn:obj.levelBtn
          })
        }
        if (!is_empty(obj.searchBtn)) {
          _this.setData({
            searchBtn:obj.searchBtn
          })
        }
        if (!is_empty(obj.helpBtn)) {
          _this.setData({
            helpBtn:obj.helpBtn
          })
        }
        if (!is_empty(obj.tap)) {
          _this.data.tap = obj.tap
        }
        if (!is_empty(obj.dbtap)) {
          _this.data.dbtap = obj.dbtap
        }
        if (!is_empty(obj.longtap)) {
          _this.data.longtap = obj.longtap
        }
        if (!is_empty(obj.edittap)) {
          _this.data.edittap = obj.edittap
        }
        if (!is_empty(obj.viewtap)) {
          _this.data.viewtap = obj.viewtap
        }
        if (!is_empty(obj.addtap)) {
          _this.data.addtap = obj.addtap
        }
        if (!is_empty(obj.deltap)) {
          _this.data.deltap = obj.deltap
        }
        if (!is_empty(obj.sharetap)) {
          _this.data.sharetap = obj.sharetap
        }
        if (!is_empty(obj.showtype)) {
          _this.data.showtype = obj.showtype
        }
        if (!is_empty(obj.shareid)) {
          _this.data.shareid = obj.shareid
        }
        if (!is_empty(obj.sharecode)) {
          _this.data.sharecode = obj.sharecode
        }
        if (!is_empty(obj.userId)) {
          _this.data.userId = obj.userId;
        } 
        if (!is_empty(obj.familyid)) {
          _this.data.familyid = obj.familyid;
        }
        if (!is_empty(obj.sharestart)) {
          _this.data.sharestart = obj.sharestart;
        }
        if (typeof (obj.center_circle) == "object") {
          _this.data.center_circle = extendObj([{}, _this.data.center_circle, obj.center_circle]);
        }
        if (typeof (obj.base_line) == "object") {
          _this.data.base_line = extendObj([{}, _this.data.base_line, obj.base_line]);
        }
        if (typeof (obj.space_width) == "number") {
          _this.data.space_width = obj.space_width;
        }
        if (typeof (obj.name_width) == "number") {
          _this.setData({
            name_width:obj.name_width
          })
        }
        if (typeof (obj.name_height) == "number") {
          _this.setData({
            name_height:obj.name_height
          })
        }
        if (typeof (obj.name_fontsize) == "number") {
          _this.setData({
            name_fontsize: obj.name_fontsize
          });
        }
        if (typeof (obj.line_width) == "number") {
          _this.data.line_width = obj.line_width;
        }
        if (typeof (obj.levels) == "number") {
          _this.data.levels = obj.levels;
        }
        if (typeof (obj.rotateX) == "number") {
          _this.setData({ rotateX : obj.rotateX })
        }
      }
      _this.setData({ 
        op_scaleY : 1 / Math.cos(Math.PI * _this.data.rotateX/ 180),
        member_scaleY: 1 / (Math.cos(Math.PI * _this.data.rotateX / 180) * Math.cos(Math.PI * _this.data.rotateX / 180))
      })
      //_this.data.member_scaleY = 1 / (Math.cos(Math.PI * _this.data.rotateX / 180) * Math.cos(Math.PI * _this.data.rotateX / 180))
      _this.data.member_base_css = extendObj([{}, _this.data.member_base_css, {
        width: _this.data.name_width,
        height: _this.data.name_height,
        borderRadius: (_this.data.name_height / 2),
        fontSize: _this.data.name_fontsize,
        lineHeight: _this.data.name_height
      }])
      _this.data.member_self_css = extendObj([{}, _this.data.member_self_css, _this.data.member_base_css, _this.data.sel_bg, {
        color: "#fff"
      }])
      _this.data.member_man_css = extendObj([{}, _this.data.member_man_css, _this.data.member_base_css, _this.data.man_bg, {
        color: "#fff"
      }])
      _this.data.member_female_css = extendObj([{}, _this.data.member_female_css, _this.data.member_base_css, _this.data.fm_bg, {
        color: "#fff"
      }])
      _this.data.member_died_css = extendObj([{}, _this.data.member_died_css, _this.data.member_base_css, _this.data.died_bg, {
        color: "#000"
      }])
      _this.data.member_unknow_css = extendObj([{}, _this.data.member_unknow_css, _this.data.member_base_css, {
        borderColor: "#0ff",
        background: "#0ff",
        color: "#fff"
      }])
      _this.data.member_man_sort1_css = extendObj([{}, _this.data.member_man_sort1_css, _this.data.member_man_css, _this.data.es_bg])
      _this.data.member_female_sort1_css = extendObj([{}, _this.data.member_female_sort1_css, _this.data.member_female_css, _this.data.ed_bg])
      _this.setData({
        canvas_css: extendObj([{}, _this.data.canvas_css, {
          width: _this.data.space_width * (_this.data.levels) * 2,
          height: _this.data.space_width * (_this.data.levels) * 2
        }]),
        jiapu_content_css: extendObj([{}, _this.data.jiapu_content_css, {
          width: (_this.data.space_width * (_this.data.levels) * 2 + 200),
          height: (_this.data.space_width * (_this.data.levels) * 2 + 200),
          rotateX: _this.data.rotateX,
          rotateZ: _this.data.landscape ? 0 : 90
        }]),
        jiapu_bg_css: extendObj([{}, _this.data.jiapu_bg_css, {
          width: _this.data.space_width * (_this.data.levels) * 2 + 100,
          height: _this.data.space_width * (_this.data.levels) * 2 + 100,
          borderRadius: (_this.data.space_width * (_this.data.levels) * 2 + 100) / 2
        }]),
        jiapu_circle_css: extendObj([{}, _this.data.jiapu_circle_css, {
          width: _this.data.space_width * (_this.data.levels) * 2,
          height: _this.data.space_width * (_this.data.levels) * 2,
          borderRadius: _this.data.space_width * (_this.data.levels)
        }]),
      })
      var params = {
        "inmap": {
          "type": _this.data.showtype,
          "id": _this.data.userId,
          "operatorId": _this.data.showtype == "share" ? "" : app.globalData.userInfo.userid,
          "localFamilyMemberId": _this.data.showtype == "share" ? _this.data.sharestart : "",
          "shareId": _this.data.shareid,
          "openId": app.globalData.userInfo.openid,
          "shareCode": _this.data.sharecode,
          "familyId": _this.data.familyid, 
          "upLevel": (_this.data.levels - 1) / 2,
          "downLevel": (_this.data.levels - 1) / 2,
        }
      }
      _this.data.alert.loading("加载中...", "icon5")
      doPost("/wx/familyMember/getFamilyMemberGalaxyByInitialize", params, function (res) {
        if (res.code == 0) {
          _this.data.member_data = res.data.members;
          _this.data.familyid = res.data.query.familyId
          _this.draw()
        } else {
          _this.data.alert.hide()
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    showDetailInfo: function (obj) {
      var _this = this;
      if(!is_empty(obj) &&!is_empty(obj.id)){
        doPost("/wx/familyMember/getFamilyMember", { "inmap": { 
          "familyMemberId": obj.id,
          "familyId": _this.data.familyid,
          "operatorId": _this.data.showtype == "share" ? "" :app.globalData.userInfo.userid,
          "type": _this.data.showtype,
          "shareId": _this.data.shareid,
          "openId": app.globalData.userInfo.openid,
          "shareCode": _this.data.sharecode,
        }},function(res){
          if(res.code==0){
            var member = res.data.member;
            _this.setData({
              detailinfo: {
                isLiving: member.isLiving,
                originAreaDetails: member.originAreaDetails ? member.originAreaDetails : '',
                gender: member.gender,
                name: member.firstname + member.lastname,
                birthTime: member.birthTime?member.birthTime:'',
                deathTime: member.deathTime?member.deathTime:'',
                age: member.age?member.age:'',
                fatherName: member.father?(member.father.firstname + member.father.lastname):'',
                motherName: member.mother?(member.mother.firstname + member.mother.lastname):'',
                description:member.description?member.description:'未填写...',
              },
              showdetail: true
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    },
    closeDetailInfo: function () {
      this.setData({
        showdetail: false
      })
    },
    showSearchForm: function () {
      var _this = this;
      _this.setData({
        search_form: {
          fullname: "",
          namezi: "",
          fname: "",
          mname: ""
        },
        showsearch: true
      })
    },
    closeSearchForm: function () {
      this.setData({
        showsearch: false
      })
    },
    searchSubmit: function(){
      var _this = this
      var search_form = _this.data.search_form
      if (!is_empty(search_form.fullname) || !is_empty(search_form.namezi) || !is_empty(search_form.fname) || !is_empty(search_form.mname)) {
        doPost("/wx/familyMember/getFamilyMemberGalaxyByCondition", {
          inmap: {
            type: _this.data.showtype,
            operatorId: _this.data.showtype == "share" ? "" : app.globalData.userInfo.userid,
            localFamilyMemberId: _this.data.showtype == "share" ? _this.data.sharestart : "",
            shareId: _this.data.shareid,
            openId: app.globalData.userInfo.openid,
            shareCode: _this.data.sharecode,
            familyId: _this.data.familyid,
            firstName: search_form.namezi,
            name: search_form.fullname,
            fatherName: search_form.fname,
            motherName: search_form.mname,
          }
        }, function (res) {
          if (res.code == 0) {
            if (is_empty(res.data.members)) {
              wx.showToast({
                title: '没有找到结果',
                icon: 'none',
                duration: 2000
              })
            } else {
              _this.closeSearchForm()
              if (res.data.members.length == 1) {
                var member = res.data.members[0]
                _this.init({ userId: member.id })
              } else {
                _this.showSearchList(res.data.members)
              }
            }
          } else {
            _this.closeSearchForm()
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    },
    showSearchList: function (list) {
      var _this = this;
      if (!is_empty(list)) {
        _this.setData({
          searchlist: list,
          showsearchlist: true,
        })
      }
    },
    closeSearchList: function () {
      var _this = this;
      _this.setData({
        searchlist: [],
        showsearchlist: false,
      })
    },
    choseResult: function (e) {
      var _this = this;
      var idx = e.currentTarget.dataset.id;
      var member = _this.data.searchlist[idx]
      if (member) {
        _this.closeSearchList();
        _this.init({ userId: member.id })
      }
    },
    handleLongTap: function (e) {
      var _this = this;
      var idx = e.currentTarget.dataset.id;
      var member = _this.data.member_list[idx]
      console.log(member)
      console.log('handleLongTap')
      if(_this.data.longtap instanceof Function){
        _this.data.longtap(member)
      }
    },
    showEdit:function(member){
      var _this = this;
      var btns = [];
      if (member.isUpdate) {
        btns.push({ name: "编辑", tap: "editMember", icon: config.baseOss + '/attachment/images/editjiapu_edit_icon.png' })
      }
      if (member.isSave) {
        btns.push({ name: "添加", tap: "addMember", icon: config.baseOss + '/attachment/images/editjiapu_add_icon.png' })
      }
      if (member.isShare) {
        btns.push({ name: "分享", tap: "shareMember", icon: config.baseOss + '/attachment/images/editjiapu_share_icon.png' })
      }
      btns.push({ name: "查看", tap: "viewMember", icon: config.baseOss + '/attachment/images/editjiapu_view_icon.png' })
      if (member.isDele) {
        btns.push({ name: "删除", tap: "delMember", icon: config.baseOss + '/attachment/images/editjiapu_del_icon.png' })
      }
      if (btns.length > 1) {
        var r = (btns.length * _this.data.name_height * 0.75 + _this.data.name_height) / Math.cos(_this.data.rotateX * Math.PI / 180)
        _this.setData({
          editinfo:{
            member: member,
            btns: btns,
            left: member.css.left + r * Math.sin(-_this.data.rotate * Math.PI / 180),
            top: member.css.top - r * Math.cos(-_this.data.rotate * Math.PI / 180),
          },
          showop:true
        });
      } else {
        _this.data.editinfo.member = member
        _this.setData({
          showop: false
        })
        _this.viewMember()
      }
    },
    hideEdit: function () {
      var _this = this;
      _this.setData({
        editinfo: {
          member: null,
          btns: [],
          left: 0,
          top: 0
        },
        showop: false
      })
    },
    editMember: function () {
      var _this = this;
      if(_this.data.edittap instanceof Function){
        _this.data.edittap(_this.data.editinfo.member)
      }
    },
    viewMember: function () {
      var _this = this;
      if(_this.data.viewtap instanceof Function){
        _this.data.viewtap(_this.data.editinfo.member)
      }
    },
    addMember: function () {
      var _this = this;
      _this.setData({
        showAddMember: true
      });
    },
    closeAddForm: function () {
      var _this = this;
      _this.setData({
        showAddMember:false
      });
    },
    addMemberByType: function (e) {
      var _this = this;
      var type = e.currentTarget.dataset.type
      if (type) {
        if(_this.data.addtap instanceof Function){
          _this.data.addtap(_this.data.editinfo.member,type)
        }
      }
    },
    delMember: function () {
      var _this = this;
      if(_this.data.deltap instanceof Function){
        _this.data.deltap(_this.data.editinfo.member)
      }
    },
    shareMember: function () {
      var _this = this;
      if(_this.data.sharetap instanceof Function){
        _this.data.sharetap(_this.data.editinfo.member)
      }
    },
    showHelpTips: function () {
      var _this = this;
      _this.setData({
        showhelp: _this.data.showhelp ? false : true
      })
    },
    showChangeLevels:function(){
      var _this = this;
      _this.setData({
        showChangeLevels: _this.data.showChangeLevels?false:true
      })
    },
    changeLevels:function(e){
      var _this =this;
      var levels = parseInt(e.currentTarget.dataset.levels);
      if ((levels == 3 || levels == 5) && levels!= _this.data.levels) {
        _this.data.levels = levels
        _this.setData({
          showChangeLevels: false
        })
        _this.init()
      } else {
        _this.setData({
          showChangeLevels: false
        })
      }
    },
    fixImage: function (type) {
      var _this = this;
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: "jiapu_views",
          fileType: "png",
          success: (res) => {
            let tempFilePath = res.tempFilePath;
            //var fileManager = wx.getFileSystemManager();
            _this.setData({
              ["jiapu_circle_css.backgroundImagePath"]: tempFilePath,
            });
            console.log("画背景", tempFilePath)
            _this.data.alert.hide()
          }
        }, _this);
      },1000)
    },
    handleClick: function (e) {
      var _this = this;
      var idx = e.currentTarget.dataset.id;
      _this.data.click_count = _this.data.click_count + 1
      if (_this.data.dbclick_timeout) {
        clearTimeout(_this.data.dbclick_timeout)
        _this.data.dbclick_timeout = null
      }
      _this.data.dbclick_timeout = setTimeout(function () {
        var member = _this.data.member_list[idx]
        console.log(member)
        if (_this.data.click_count > 1) {
          if(_this.data.dbtap instanceof Function){
            _this.data.dbtap(member)
          }
        } else {
          if(_this.data.tap instanceof Function){
            _this.data.tap(member)
          }
        }
        _this.data.click_count = 0
      }, 500);
    },
    moveStart: function (e) {
      var _this = this
      if (e.touches.length ==1) {
          isonetouch= true
          onetouch= {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          }
      } else if (e.touches.length == 2) {
        isonetouch= false
        twotouch= {
          x1: e.touches[0].pageX,
          y1: e.touches[0].pageY,
          x2: e.touches[1].pageX,
          y2: e.touches[1].pageY
        }
      }
    },
    moveMove: function (e) {
      var _this = this
      if (!touchmoving) {
        touchmoving = true;
        setTimeout(() => { touchmoving = false},40)//节流算法，40毫秒响应一次移动，25帧标准
        if (e.touches.length == 1 && isonetouch) {
          var onePointDiffX = e.touches[0].pageX - onetouch.x
          var onePointDiffY = e.touches[0].pageY - onetouch.y
          var c_y = _this.data.jiapu_content_css.top;
          var c_x = _this.data.jiapu_content_css.left;
          var t_y = c_y + onePointDiffY;
          var t_x = c_x + onePointDiffX;
          _this.setData({
            jiapu_content_css: extendObj([{}, _this.data.jiapu_content_css, {
              top: t_y,
              left: t_x
            }])
          })
          onetouch = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          }
        } else if (e.touches.length == 2) {
          var preTwoPoint = JSON.parse(JSON.stringify(twotouch))
          twotouch = {
            x1: e.touches[0].pageX,
            y1: e.touches[0].pageY,
            x2: e.touches[1].pageX,
            y2: e.touches[1].pageY
          }
          // 计算角度，旋转(优先)
          var perAngle = preTwoPoint.x1 == preTwoPoint.x2?90:Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI
          var curAngle = twotouch.x1 == twotouch.x2 ? 90 : Math.atan((twotouch.y1 - twotouch.y2) / (twotouch.x1 - twotouch.x2)) * 180 / Math.PI
          if (Math.abs(perAngle - curAngle) > 1) {
            _this.setData({
              rotate: _this.data.rotate + (curAngle - perAngle),
              jiapu_circle_css: extendObj([{}, _this.data.jiapu_circle_css, {
                rotate: _this.data.jiapu_circle_css.rotate + (curAngle - perAngle)
              }])
            })
          } else {
            // 计算距离，缩放
            var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
            var curDistance = Math.sqrt(Math.pow((twotouch.x1 - twotouch.x2), 2) + Math.pow((twotouch.y1 - twotouch.y2), 2))
            _this.setData({
              scale: _this.data.scale * (curDistance / preDistance)
            })
          }
        }
      }
    },
    moveEnd: function (e) {
      var _this = this
      isonetouch = false
    },
    dorotate: function (type) {
      var _this = this
      var rotate = _this.data.rotate
      if (type) {
        if (typeof (type) == "boolean") {
          if (type) {
            rotate = rotate + 30;
          } else {
            rotate = rotate - 30;
          }
        } else {
          var c_rotate = is_number(type) ? parseFloat(type) : 0;
          rotate = rotate + c_rotate;
        }
      } else {
        rotate = rotate - 30;
      }
      rotate = rotate > 360 ? rotate - 360 : rotate;
      rotate = rotate < -360 ? rotate + 360 : rotate;
      _this.setData({
        rotate: rotate,
        jiapu_circle_css: extendObj([{}, _this.data.jiapu_circle_css, { rotate: rotate}]) 
      })
      return true;
    },
    doscale: function (type) {
      var _this = this
      var scale = _this.data.scale
      if (type) {
        scale = scale * 1.1;
      } else {
        scale = scale * 0.9;
      }
      scale = scale > 1.5 ? 1.5 : scale;
      scale = scale < 0.1 ? 0.1 : scale;
      _this.setData({
        scale: scale,
      })
      return true;
    },
    getmember: function (type) {//获取用户，无参数返回自己，true返回长子，false返回father
      var _this = this
      if (typeof (type) == "undefined") {
        return _this.data.member_data;
      } else if (type) {
        if (_this.data.member_data.isForeigner) {
          return _this.data.member_data.partner.children.length > 0 ? _this.data.member_data.partner.children[0] : null;
        } else {
          return _this.data.member_data.children.length > 0 ? _this.data.member_data.children[0] : null;
        }
      } else {
        if (_this.data.member_data.isForeigner) {
          return _this.data.member_data.partner.father ? _this.data.member_data.partner.father : null;
        } else {
          return _this.data.member_data.father ? _this.data.member_data.father : null;
        }
      }
    },
    draw:function(){
      var _this = this
      var child_count = _this.count_child([_this.data.member_data], 0);
      _this.data.xhrpromise = [];
      //要如何重置wxs的一些属性
      _this.setData({
        member_list:[]
      })
      if (_this.data.ctx) {
        _this.data.ctx.clearRect(0, 0, _this.data.canvas_css.width, _this.data.canvas_css.height);
        _this.data.ctx.save();
        _this.data.ctx.lineWidth = _this.data.line_width
        for (var i = 1; i < (_this.data.levels); i++) {
          _this.data.ctx.beginPath();
          if (i == ((_this.data.levels - 1) / 2)) {
            if (typeof (_this.data.center_circle) == "object" && typeof (_this.data.center_circle.url) == "string" && _this.data.center_circle.url != "") {
              var promise1 = new Promise(function (resolve, reject) {
                wx.getImageInfo({
                  src: _this.data.center_circle.url,
                  success(res) {
                    resolve({type:'circle',data:res})
                  }
                })
              })
              _this.data.xhrpromise.push(promise1)
            } else {
              _this.data.ctx.strokeStyle = 'rgba(164,105,79,0.6)';
              _this.data.ctx.setLineDash([15, 0]);
              _this.data.ctx.arc(_this.data.space_width * (_this.data.levels), _this.data.space_width * (_this.data.levels), ((i + 0.5) * _this.data.space_width), 0, 2 * Math.PI, false);
            }
          } else {
            _this.data.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            _this.data.ctx.setLineDash([15, 5]);
            _this.data.ctx.arc(_this.data.space_width * (_this.data.levels), _this.data.space_width * (_this.data.levels), ((i + 0.5) * _this.data.space_width), 0, 2 * Math.PI, false);
          }
          _this.data.ctx.closePath();
          _this.data.ctx.stroke();
        }
        _this.data.ctx.setLineDash([15, 0]);
        if (typeof (_this.data.base_line) == "object" && typeof (_this.data.base_line.url) == "string" && _this.data.base_line.url != "") {
          var promise2 = new Promise(function (resolve, reject) {
            wx.getImageInfo({
              src: _this.data.base_line.url,
              success(res) {
                resolve({ type: 'line', data: res })
              }
            })
          })
          _this.data.xhrpromise.push(promise2)
        } else {
          _this.data.ctx.beginPath();
          _this.data.ctx.moveTo(_this.data.space_width * (_this.data.levels), _this.data.space_width * (_this.data.levels));
          //定义直线的终点坐标为(50,10)
          _this.data.ctx.lineTo(_this.data.space_width * (_this.data.levels) * 2, _this.data.space_width * (_this.data.levels));
          //沿着坐标点顺序的路径绘制直线
          _this.data.ctx.closePath();
          _this.data.ctx.stroke();
        }
        _this.data.ctx.lineWidth = _this.data.line_width * 2
        if (_this.data.member_data) {
          if (_this.data.member_data.isForeigner) {
            _this.draw_parent(_this.data.member_data.partner.father, 0);
          } else {
            _this.draw_parent(_this.data.member_data.father, 0);
          }
          var p_f_l = (((_this.data.levels) / 2) - 0.5) * _this.data.space_width;
          var p_f_y = (_this.data.space_width * (_this.data.levels)) - (p_f_l * Math.sin(2 * Math.PI * 30 / 360));
          var p_f_x = (_this.data.space_width * (_this.data.levels)) + (p_f_l * Math.cos(2 * Math.PI * 30 / 360));
          var p_f = { x: p_f_x, y: p_f_y };
          if (_this.data.member_data.isForeigner) {
            _this.draw_child(child_count, [_this.data.member_data.partner], 0, 360, 0);
          } else {
            _this.draw_child(child_count, [_this.data.member_data], 0, 360, 0);
          }
        }
        if (_this.data.xhrpromise.length>0){
          Promise.all(_this.data.xhrpromise).then(res => {
            var dlen = _this.data.xhrpromise.length
            for(var i=0;i<dlen;i++){
              var pres = res[i]
              if (pres.type == "circle") {
                _this.data.ctx.drawImage(
                  pres.data.path,
                  0, 0,//开始剪切的 x 坐标位置。
                  pres.data.width, pres.data.height,  //被剪切图像的高度。
                  _this.data.center_circle.x / ((9 - 3.5) / (_this.data.levels - ((_this.data.levels - 1) / 2 + 0.5))), _this.data.center_circle.y / ((9 - 3.5) / (_this.data.levels - ((_this.data.levels - 1) / 2 + 0.5))),
                  _this.data.center_circle.w / (4.5 / ((_this.data.levels - 1) / 2 + 0.5)), _this.data.center_circle.h / (4.5 / ((_this.data.levels - 1) / 2 + 0.5))
                );
              } else if (pres.type == "line") {
                _this.data.ctx.drawImage(
                  pres.data.path,
                  0, 0,//开始剪切的 x 坐标位置。
                  pres.data.width, pres.data.height,  //被剪切图像的高度。
                  _this.data.base_line.x / (9 / (_this.data.levels)), _this.data.base_line.y / (9 / (_this.data.levels)),
                  _this.data.base_line.w / (9 / (_this.data.levels)), _this.data.base_line.h / (9 / (_this.data.levels))
                );
              }
            }
            _this.data.ctx.draw(true, setTimeout(() => {
              _this.fixImage()
              _this.data.ctx.restore();
            }, 0));
          })
        } else {
          _this.data.ctx.draw(true, setTimeout(() => {
            _this.fixImage()
            _this.data.ctx.restore();
          }, 0));
        }
      }
    },
    count_child: function (children, levels){
      var _this = this;
      var t_count = 0;
      levels = levels ? levels : 0;
      if (!is_empty(children) && levels < (_this.data.levels + 1) / 2) {
        var clen = children.length
        for (var i=0;i<clen;i++){
          var t_c = children[i]
          if (!is_empty(t_c)){
            if (!is_empty(t_c.children)) {
              t_count += (levels < (_this.data.levels - 1) / 2 ? _this.count_child(t_c.children, levels + 1) : 1);
            } else {
              t_count++;
            }
          }
        }
      }
      return t_count
    },
    draw_parent: function (father, level, position_father) {
      var _this=this
      if (_this.data.ctx) {
        if (father && level <= (((_this.data.levels - 1) / 2) - 1)) {
          var linked_father = false;
          var len = 1 + (father.partners ? father.partners.length : 0);
          var angle_pice = 30;//360/(len*2);父辈固定30度
          var draw_obj = {
            name: father.firstname + father.lastname,
            id: father.id,
            sex: father.gender == "M" ? 1 : 2,
            sort: father.childOrder,
            isLiving: father.isLiving,
            father: father.father,
            mother: father.mother,
            isFather: true,
            angle: angle_pice,
            level: (((_this.data.levels - 1) / 2) - 1) - level,
            isSave: father.isSave ? true : false,
            isShare: father.isShare ? true : false,
            isDele: father.isDele ? true : false,
            isUpdate: father.isUpdate ? true : false,
          }
          var p_f_l = draw_obj.level == 1 ? 0 : ((draw_obj.level + 0.5) * _this.data.space_width);
          var p_f_y = (_this.data.space_width * (_this.data.levels)) - (p_f_l * Math.sin(2 * Math.PI * draw_obj.angle / 360));
          var p_f_x = (_this.data.space_width * (_this.data.levels)) + (p_f_l * Math.cos(2 * Math.PI * draw_obj.angle / 360));
          var p_f = { x: p_f_x, y: p_f_y };
          if (level <= (((_this.data.levels - 1) / 2) - 2) && father.partners) {
            var partner_angle = _this.data.name_width * 180 / ((((_this.data.levels - 1) / 2) - 0.5 - level) * _this.data.space_width * Math.PI * 1.6)
            for (var i = father.partners.length - 1; i >= 0; i--) {//逆排，防止遮盖
              var m_draw_obj = {
                name: father.partners[i].firstname + father.partners[i].lastname,
                id: father.partners[i].id,
                sex: father.partners[i].gender == "M" ? 1 : 2,
                isLiving: father.partners[i].isLiving,
                father: father.partners[i].father,
                mother: father.partners[i].mother,
                angle: angle_pice + (i + 1) * partner_angle,
                level: (((_this.data.levels - 1) / 2) - 1) - level,
                isSave: father.partners[i].isSave ? true : false,
                isShare: father.partners[i].isShare ? true : false,
                isDele: father.partners[i].isDele ? true : false,
                isUpdate: father.partners[i].isUpdate ? true : false,
              }
              _this.add_item(m_draw_obj);
            }
          }
          _this.add_item(draw_obj);
          _this.draw_parent(father.father, level + 1, p_f)
        }
      }
    },
    draw_child: function (all_count, children, angle_start, angle_end, level, position_father) {
      var _this = this
      if (_this.data.ctx) {
        if (children && level < ((_this.data.levels + 1) / 2)) {
          var bl_start = null;
          var bl_end = null;
          var linked_father = false;
          var clen = children.length;
          for (var idx = 0; idx < clen; idx++) {
            var t_count = 1;
            var val = children[idx];
            if (val.children) {
              var ct_count = _this.count_child(val.children, level + 1);
              t_count = ct_count > 0 ? ct_count : t_count;
            }
            var t_angle = 360 * t_count / all_count;
            //插入展示数据开始
            var angle_with = t_angle * Math.PI * ((level + ((_this.data.levels - 1) / 2) + 0.5) * _this.data.space_width) / 180;
            var len = 1 + (val.partners ? val.partners.length : 0);
            var show_all_member = false;
            var show_full_name = true;
            if ((angle_with / len) > 60) {
              show_all_member = true;
              show_full_name = true;
            } else if ((angle_with / len) > 20) {
              //show_full_name = false;
            } else if (angle_with > 60) {
              show_full_name = true;
            } else {
            }
            var angle_pice = t_angle / 2;
            if (show_all_member) {
              angle_pice = t_angle / (len * 2);
            }
            var draw_obj = {
              name: show_full_name ? (val.firstname + val.lastname) : val.firstname,
              id: val.id,
              sex: val.gender == "M" ? 1 : 2,
              sort: val.childOrder,
              isLiving: val.isLiving,
              father: val.father,
              mother: val.mother,
              isFather: false,
              //angle:angle_start + angle_pice,
              angle: angle_start + (360 / all_count / 2),
              level: level + ((_this.data.levels - 1) / 2),
              isSave: val.isSave ? true : false,
              isShare: val.isShare ? true : false,
              isDele: val.isDele ? true : false,
              isUpdate: val.isUpdate ? true : false,
            }
            var p_f_l = (draw_obj.level + 0.5) * _this.data.space_width;
            var p_f_y = (_this.data.space_width * (_this.data.levels)) - (p_f_l * Math.sin(2 * Math.PI * draw_obj.angle / 360));
            var p_f_x = (_this.data.space_width * (_this.data.levels)) + (p_f_l * Math.cos(2 * Math.PI * draw_obj.angle / 360));
            var p_f = { x: p_f_x, y: p_f_y };
            if (!linked_father && position_father) {
              linked_father = true;
              _this.data.ctx.beginPath();
              _this.data.ctx.strokeStyle = 'rgba(255,255,255,1)';
              _this.data.ctx.moveTo(position_father.x, position_father.y);
              _this.data.ctx.lineTo(p_f.x, p_f.y);
              _this.data.ctx.closePath();
              _this.data.ctx.stroke();
              //_this.data.ctx.draw();
            }
            if (bl_start !== null) {
              bl_end = draw_obj.angle;
            } else {
              bl_start = bl_end = draw_obj.angle;
            }
            if (show_all_member) {
              if (val.partners) {
                var partner_angle = _this.data.name_width * 180 / ((((_this.data.levels - 1) / 2) + 0.5 + level) * _this.data.space_width * Math.PI * 1.6)
                for (var i = val.partners.length - 1; i >= 0; i--) {//逆排，防止遮盖
                  var m_draw_obj = {
                    name: show_full_name ? (val.partners[i].firstname + val.partners[i].lastname) : val.partners[i].firstname,
                    id: val.partners[i].id,
                    sex: val.partners[i].gender == "M" ? 1 : 2,
                    isLiving: val.partners[i].isLiving,
                    father: val.partners[i].father,
                    mother: val.partners[i].mother,
                    angle: angle_start + (360 / all_count / 2) + (i + 1) * partner_angle,
                    level: level + ((_this.data.levels - 1) / 2),
                    isSave: val.partners[i].isSave ? true : false,
                    isShare: val.partners[i].isShare ? true : false,
                    isDele: val.partners[i].isDele ? true : false,
                    isUpdate: val.partners[i].isUpdate ? true : false,
                  }
                  _this.add_item(m_draw_obj);
                }
              }
            }
            _this.add_item(draw_obj);
            _this.draw_child(all_count, val.children, angle_start, t_angle + angle_start, level + 1, p_f);
            angle_start = t_angle + angle_start;
          };
          if (bl_start != bl_end) {
            _this.data.ctx.beginPath();
            if (level == 0) {
              _this.data.ctx.strokeStyle = 'rgba(164,105,79,1)';
            } else {
              _this.data.ctx.strokeStyle = 'rgba(255,255,255,1)';
            }
            _this.data.ctx.arc((_this.data.space_width * (_this.data.levels)), (_this.data.space_width * (_this.data.levels)), (level + ((_this.data.levels - 1) / 2) + 0.5) * _this.data.space_width, 2 * Math.PI * (360 - bl_start) / 360, 2 * Math.PI * (360 - bl_end) / 360, true);
            _this.data.ctx.stroke();
            //_this.data.ctx.draw();
          }
        }
      }
    },
    add_item: function (obj){
      var _this = this
      var l = obj.level == 0 ? 0 : ((obj.level + 0.5) * _this.data.space_width);
      var y = l * Math.sin(2 * Math.PI * obj.angle / 360);
      var x = l * Math.cos(2 * Math.PI * obj.angle / 360);
      var member_css = extendObj([{}, obj.isLiving ? (obj.sex ? (obj.sex == 1 ? ((obj.sort == 1 && !obj.isFather) ? _this.data.member_man_sort1_css : _this.data.member_man_css) : (obj.sex == 2 ? ((obj.sort == 1 && !obj.isFather) ? _this.data.member_female_sort1_css : _this.data.member_female_css) : _this.data.member_unknow_css)) : _this.data.member_base_css) : _this.data.member_died_css, { top: (_this.data.space_width * (_this.data.levels)) - y - (_this.data.name_height * (obj.level == 0 ? 0.75 : 0.5)), left: (_this.data.space_width * (_this.data.levels)) + x - (_this.data.name_width * (obj.level == 0 ?0.75:0.5))}, (obj.level == 0 ? { width: (_this.data.name_width * 1.5), height: (_this.data.name_height * 1.5), borderRadius: (_this.data.name_height * 1.5 / 2) , fontSize: (_this.data.name_fontsize * 1.5), lineHeight: (_this.data.name_height * 1.5) } : {})])
      var member_info = extendObj([{},obj,{css:member_css}])
      _this.setData({
        member_list: _this.data.member_list.concat([member_info])
      });
      if (obj.id == _this.data.member_data.id) {
        var rotate = obj.angle + 90;
        rotate = rotate > 360 ? rotate - 360 : rotate;
        rotate = rotate < -360 ? rotate + 360 : rotate;
        _this.setData({
          rotate:rotate,
          jiapu_circle_css: extendObj([{}, _this.data.jiapu_circle_css, {
            rotate: rotate
          }])
        })
      }
    },
    inputgetName(e) {
      var name = e.currentTarget.dataset.name;
      var nameMap = {}
      if (name.indexOf('.')) {
        var nameList = name.split('.')
        if (this.data[nameList[0]]) {
          nameMap[nameList[0]] = this.data[nameList[0]]
        } else {
          nameMap[nameList[0]] = {}
        }
        nameMap[nameList[0]][nameList[1]] = e.detail.value
      } else {
        nameMap[name] = e.detail.value
      }
      this.setData(nameMap)
    }
  }
})