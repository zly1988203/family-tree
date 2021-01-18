// component/tree/tree.js
import {
  extendObj, is_empty, is_number, doPost, formatDate
} from "../../utils/util.js"
const computedBehavior = require('miniprogram-computed')
const app = getApp()
const config = require("../../config.js")
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
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    backBtn:true,
    levelBtn:true,
    searchBtn:true,
    showChangeLevels:false,
    showsearch: false,
    showsearchlist: false,
    showdetail: false,
    showhelp: false,
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
    width: 0,
    height: 0,
    member_list: [],
    click_count: 0,
    dbclick_timeout: null,
    showtype: "first",
    userId:"",
    sharestart:"",
    shareid:"",
    sharecode: "",
    scale: 1,
    familyid: 0,
    ctx: null,
    editinfo:{
      member:null,
      btns:[],
      x:0,
      y:0
    },
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
      fullname: "",
      namezi: "",
      fname: "",
      mname: ""
    },
    searchlist:[],
    childType:{
      "NORMAL": "亲子",
      "STEP": "继子",
      "FZCF": "出抚",
      "EMPTY": "",
      "FUSUN": "抚孙",
    },
    member_base_css: {
      width: 0,
      height: 0,
      fontSize: 0,
      lineHeight: 0,
      borderRadius: 0,
      borderWidth:1,
    },
    jiapu_content_css: {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      backgroundImagePath: ""
    },
    es_bg: {
      borderColor: "#85564c",
      color:"#fff",
      //background: "url('" + config.baseOss + "/attachment/images/es_bg.png') center center no-repeat",
      //backgroundSize: "auto 100%",
    },
    ed_bg: {
      borderColor: "#85564c",
      color: "#fff",
      //background: "url('" + config.baseOss + "/attachment/images/ed_bg.png') center center no-repeat",
      //backgroundSize: "auto 100%",
    },
    man_bg: {
      //borderColor: "transparent",
      background: "#e34f43",
      color: "#fff",
      avatar: config.baseOss + "/attachment/images/detail_men.jpg"
      //backgroundSize: "auto 100%",
    },
    fm_bg: {
      //borderColor: "transparent",
      background: "#3e95ea",
      color: "#fff",
      avatar: config.baseOss + "/attachment/images/detail_female.jpg"
      //backgroundSize: "auto 100%",
    },
    sel_bg: {
      borderColor: "#fde933",
      color: "#fde933",
      //background: "url('" + config.baseOss + "/attachment/images/sel_bg.png') center center no-repeat",
      //backgroundSize: "auto 100%",
    },
    died_bg: {
      borderColor: "#CCCCCC",
      background: "#cccccc",
      color: "#fff",
      //backgroundSize: "auto 100%",
    },
    unknow_bg: {
      borderColor: "#CCCCCC",
      background: "#cccccc",
      color: "#fff",
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
    name_width: 198,
    name_height: 60,
    name_fontsize: 16,
    space_width: 60,
    space_height: 120,
    line_width: 1,
    line_color: "#ffffff",
    levels: 5,		//9代，5代
    baseOss: config.baseOss,
  },

  lifetimes: {
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
      query.select('#jiapu_outside_box').boundingClientRect((res) => {
        var c_w = res.width;
        var c_h = res.height;
        _this.data.height = c_h
        _this.data.width = c_w
        _this.setData({
          //height: c_h,
          //width: c_w,
          jiapu_content_css: extendObj([{}, _this.data.jiapu_content_css, {
            left: c_w / 2,
            top: c_h / 2
          }])
        })
      }).exec();
    }
  },
  computed: {
    levelName: function (data) {
      var ln = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
      return ln[data.levels] + "世";
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    naviback: function () {
      var _this = this
      wx.navigateBack({
        delta: 1
      })
    },
    init: function (obj) {
      var _this = this
      if (obj) {
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
        if (typeof (obj.levels) == "number") {
          _this.data.levels = obj.levels;
        }
        if (typeof (obj.line_color) == "string") {
          _this.data.line_color = obj.line_color;
        }
        if (typeof (obj.sharestart) == "string") {
          _this.data.sharestart = obj.sharestart;
        }
        if (typeof (obj.space_width) == "number") {
          _this.data.space_width = obj.space_width;
        }
        if (typeof (obj.space_height) == "number") {
          _this.data.space_height = obj.space_height;
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
          _this.data.member_base_css = extendObj([{}, _this.data.member_base_css, { borderRadius: obj.name_height / 2 }]);
        }
        if (typeof (obj.name_fontsize) == "number") {
          _this.setData({
            name_fontsize: obj.name_fontsize
          });
        }
        if (typeof (obj.line_width) == "number") {
          _this.data.line_width = obj.line_width;
        }
      }
      _this.data.member_base_css = extendObj([{}, _this.data.member_base_css, {
        width: _this.data.name_width,
        height: _this.data.name_height,
        fontSize: _this.data.name_fontsize,
        lineHeight: _this.data.name_height
      }])
      _this.data.member_self_css = extendObj([{}, _this.data.member_self_css, _this.data.member_base_css, _this.data.sel_bg])
      _this.data.member_man_css = extendObj([{}, _this.data.member_man_css, _this.data.member_base_css, _this.data.man_bg])
      _this.data.member_female_css = extendObj([{}, _this.data.member_female_css, _this.data.member_base_css, _this.data.fm_bg])
      _this.data.member_died_css = extendObj([{}, _this.data.member_died_css, _this.data.member_base_css, _this.data.died_bg])
      _this.data.member_unknow_css = extendObj([{}, _this.data.member_unknow_css, _this.data.member_base_css, _this.data.unknow_bg])
      _this.data.member_man_sort1_css = extendObj([{}, _this.data.member_man_sort1_css, _this.data.member_man_css, _this.data.es_bg])
      _this.data.member_female_sort1_css = extendObj([{}, _this.data.member_female_sort1_css, _this.data.member_female_css, _this.data.ed_bg])
      var params = {
        "inmap": { 
          "type": _this.data.showtype,
          "id": _this.data.userId, 
          "operatorId": _this.data.showtype == "share" ? "" :app.globalData.userInfo.userid,
          "shareId": _this.data.shareid,
          "openId": app.globalData.userInfo.openid,
          "localFamilyMemberId": _this.data.showtype == "share" ? _this.data.sharestart : "",
          "shareCode": _this.data.sharecode,
          "familyId": _this.data.familyid, 
          "upLevel": (_this.data.levels - 1) / 2, 
          "downLevel": (_this.data.levels - 1) / 2,
        }
      }
      _this.data.alert.loading("加载中...", "icon5")
      doPost("/wx/familyMember/getFamilyMemberByInitialize", params,function(res){
        if (res.code==0){
          //var subTree = new MemberTree(res.data.offset, res.data.members);
          //var jiapu_data = subTree.getTargetMember(_this.data.userId);
          _this.data.member_data = res.data.members;
          _this.data.familyid = res.data.query.familyId
          var all_child_count = _this.count_child([_this.data.member_data], 0);
          _this.setData({
            canvas_css: extendObj([{}, _this.data.canvas_css, {
              width: _this.data.space_width * (all_child_count - 1) + _this.data.name_width * all_child_count,
              height: _this.data.space_height * (_this.data.levels - 1) + _this.data.name_height * _this.data.levels
            }]),
            jiapu_content_css: extendObj([{}, _this.data.jiapu_content_css, {
              width: _this.data.space_width * (all_child_count - 1) + _this.data.name_width * all_child_count,
              height: _this.data.space_height * (_this.data.levels - 1) + _this.data.name_height * _this.data.levels
            }])
          })
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
    draw: function () {
      var _this = this
      var child_count = _this.count_child([_this.data.member_data], 0);
      _this.setData({
        member_list: []
      })
      if (_this.data.ctx) {
        _this.data.ctx.clearRect(0, 0, _this.data.canvas_css.width, _this.data.canvas_css.height);
        _this.data.ctx.save();
        _this.data.ctx.lineWidth = _this.data.line_width
        _this.data.ctx.strokeStyle = _this.data.line_color
        if (_this.data.member_data.isForeigner) {
          _this.draw_child(child_count, [_this.data.member_data.partner]);
        } else {
          _this.draw_child(child_count, [_this.data.member_data]);
        }
        _this.data.ctx.draw(true, setTimeout(() => {
          _this.fixImage()
          _this.data.ctx.restore();
        }, 0));
      }
    },
    draw_child: function (all_count, children, count_start, level, position_father) {
      var _this = this
      all_count = all_count?all_count:0;
      count_start = count_start?count_start:0;
      level = level?level:0;
      children = children?children:[];
      if (_this.data.ctx) {
        if (children && level < _this.data.levels){
          var clen = children.length;
          for (var idx = 0; idx < clen; idx++) {
            var val = children[idx];
            var now_count = _this.count_child([val], level)
            var show_count = 1 + (is_empty(val.partners) ? 0 : val.partners.length);
            var now_start = count_start + Math.floor((now_count - show_count)/2)
            _this.draw_family(val, now_start, level, position_father)
            var t_position_father = {
              x: now_start * (_this.data.name_width + _this.data.space_width) + (_this.data.name_width / 2),
              y: level * (_this.data.name_height + _this.data.space_height) + (_this.data.name_height / 2)
            }
            if(position_father){
              //父子连线开始
              _this.data.ctx.beginPath();
              _this.data.ctx.moveTo(position_father.x, position_father.y);
              if (position_father.x == t_position_father.x) {
                _this.data.ctx.lineTo(t_position_father.x, t_position_father.y);
              }else{
                _this.data.ctx.lineTo(position_father.x, position_father.y + _this.data.name_height / 2 + _this.data.space_height / 2);
                _this.data.ctx.moveTo(position_father.x, position_father.y + _this.data.name_height / 2 + _this.data.space_height / 2);
                _this.data.ctx.lineTo(t_position_father.x, t_position_father.y - _this.data.name_height / 2 - _this.data.space_height / 2);
                _this.data.ctx.moveTo(t_position_father.x, t_position_father.y - _this.data.name_height / 2 - _this.data.space_height / 2);
                _this.data.ctx.lineTo(t_position_father.x, t_position_father.y);
              }
              //沿着坐标点顺序的路径绘制直线
              _this.data.ctx.closePath();
              _this.data.ctx.stroke();
              //父子连线结束
            }
            if(val.children){
              if(false && !is_empty(val.partners)){//有配偶的情况下连线也不居中
                t_position_father.x = now_start * (_this.data.name_width + _this.data.space_width) + _this.data.name_width + (_this.data.space_width / 2)
              }
              _this.draw_child(all_count, val.children, count_start, level + 1, t_position_father)
            }
            count_start = count_start + now_count;
          }
        }
      }
    },
    draw_family: function (family, count_start, level, position_father) {
      var _this = this
      if (_this.data.ctx) {
        var draw_obj = {
          name: family.firstname + family.lastname,
          id: family.id,
          sex: family.gender == "M" ? 1 : 2,
          sort: family.childOrder,
          isLiving: family.isLiving,
          father: family.father,
          mother: family.mother,
          count_start: count_start,
          level: level,
          isSave: family.isSave ? true : false,
          isShare: family.isShare ? true : false,
          isDele: family.isDele ? true : false,
          isUpdate: family.isUpdate ? true : false,
        }
        _this.add_item(draw_obj);
        if (!is_empty(family.partners)){
          var m_count_start = count_start
          var m_len = family.partners.length
          for (var i = 0; i < m_len; i++) {
            m_count_start++
            var m_draw_obj = {
              name: family.partners[i].firstname + family.partners[i].lastname,
              id: family.partners[i].id,
              sex: family.partners[i].gender == "M" ? 1 : 2,
              isLiving: family.partners[i].isLiving,
              father: family.partners[i].father,
              mother: family.partners[i].mother,
              count_start: m_count_start,
              level: level,
              isSave: family.partners[i].isSave ? true : false,
              isShare: family.partners[i].isShare ? true : false,
              isDele: family.partners[i].isDele ? true : false,
              isUpdate: family.partners[i].isUpdate ? true : false,
            }
            _this.add_item(m_draw_obj);
          }
          //夫妻连线开始
          var position_start = {
            x: count_start * (_this.data.name_width + _this.data.space_width) + (_this.data.name_width / 2),
            y: level * (_this.data.name_height + _this.data.space_height) + (_this.data.name_height / 2)
          }
          var position_end = {
            x: m_count_start * (_this.data.name_width + _this.data.space_width) + (_this.data.name_width / 2),
            y: level * (_this.data.name_height + _this.data.space_height) + (_this.data.name_height / 2)
          }
          _this.data.ctx.beginPath();
          _this.data.ctx.moveTo(position_start.x, position_start.y);
          _this.data.ctx.lineTo(position_end.x, position_end.y);
          _this.data.ctx.closePath();
          _this.data.ctx.stroke();
          //夫妻连线结束
        }
      }
    },
    add_item: function (obj) {
      var _this = this
      var x = obj.count_start * (_this.data.name_width + _this.data.space_width) + _this.data.name_width / 2;
      var y = obj.level * (_this.data.name_height + _this.data.space_height) + _this.data.name_height / 2;;
      var member_css = extendObj([
        {}, 
        obj.sex ? (obj.sex == 1 ? (obj.sort == 1 ? _this.data.member_man_sort1_css : _this.data.member_man_css) : (obj.sex == 2 ? (obj.sort == 1 ? _this.data.member_female_sort1_css : _this.data.member_female_css) : _this.data.member_unknow_css)) : _this.data.member_base_css,
        obj.isLiving ? {} : _this.data.member_died_css,
        { top: y, left: x }, 
        obj.id == _this.data.userId ? _this.data.member_self_css : {}
      ])
      var member_info = extendObj([{}, obj, { css: member_css }])
      _this.setData({
        member_list: _this.data.member_list.concat([member_info])
      });
    },
    fixImage:function(){
      var _this = this;
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: "jiapu_views",
          fileType: "png",
          success: (res) => {
            let tempFilePath = res.tempFilePath;
            //var fileManager = wx.getFileSystemManager();
            _this.setData({
              ["jiapu_content_css.backgroundImagePath"]: tempFilePath,
            });
            console.log("画背景", tempFilePath)
            _this.data.alert.hide()
          }
        }, _this);
      }, 1000)
    },
    count_child: function (children, levels) {
      var _this = this;
      var t_count = 0;
      levels = levels ? levels : 0;
      if (!is_empty(children) && levels < _this.data.levels) {
        var clen = children.length
        for (var i = 0; i < clen; i++) {
          var t_c = children[i]
          if (!is_empty(t_c)) {
            var now_count = 1 + (is_empty(t_c.partners) ? 0 : t_c.partners.length);
            if (!is_empty(t_c.children)) {
              var child_count = (levels < (_this.data.levels - 1) ? _this.count_child(t_c.children, levels + 1) : now_count);

              t_count = t_count + (now_count > child_count?now_count:child_count);
            } else {
              t_count = t_count + now_count;
            }
          }
        }
      }
      return t_count
    },
    moveStart: function (e) {
      var _this = this
      if (e.touches.length == 1) {
        isonetouch = true
        onetouch = {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
      } else if (e.touches.length == 2) {
        isonetouch = false
        twotouch = {
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
        setTimeout(() => { touchmoving = false }, 40)//节流算法，40毫秒响应一次移动，25帧标准
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
          // 计算距离，缩放
          var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
          var curDistance = Math.sqrt(Math.pow((twotouch.x1 - twotouch.x2), 2) + Math.pow((twotouch.y1 - twotouch.y2), 2))
          _this.setData({
            scale: _this.data.scale * (curDistance / preDistance)
          })
        }
      }
    },
    moveEnd: function (e) {
      var _this = this
      isonetouch = false
    },
    showChangeLevels: function () {
      var _this = this;
      _this.setData({
        showChangeLevels: _this.data.showChangeLevels ? false : true
      })
    },
    changeLevels: function (e) {
      var _this = this;
      var levels = parseInt(e.currentTarget.dataset.levels);
      if ((levels == 3 || levels == 5) && levels != _this.data.levels) {
        _this.setData({
          levels: levels,
          showChangeLevels: false
        })
        _this.init()
      } else {
        _this.setData({
          showChangeLevels: false
        })
      }
    },
    showSearchForm: function () {
      this.setData({
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
    searchSubmit: function () {
      var _this = this
      var search_form = _this.data.search_form
      if (!is_empty(search_form.fullname) || !is_empty(search_form.namezi) || !is_empty(search_form.fname) || !is_empty(search_form.mname)){
        doPost("/wx/familyMember/getFamilyMemberByCondition", {
          inmap: {
            type: _this.data.showtype,
            operatorId: _this.data.showtype == "share" ? "" :app.globalData.userInfo.userid,
            shareId: _this.data.shareid,
            openId: app.globalData.userInfo.openid,
            localFamilyMemberId: _this.data.showtype == "share" ? _this.data.sharestart : "",
            shareCode: _this.data.sharecode,
            familyId: _this.data.familyid,
            firstName: search_form.namezi,
            name: search_form.fullname, 
            fatherName: search_form.fname, 
            motherName: search_form.mname,
          }
        }, function (res) {
          if(res.code==0){
            if (is_empty(res.data.members)) {
              wx.showToast({
                title: '没有找到结果',
                icon: 'none',
                duration: 2000
              })
            } else {
              _this.closeSearchForm()
              if (res.data.members.length==1){
                var member = res.data.members[0]
                _this.init({ userId: member.id})
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
      if(!is_empty(list)){
        _this.setData({
          searchlist:list,
          showsearchlist:true,
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
        var r = btns.length * _this.data.name_height * 0.75 + _this.data.name_height
        _this.setData({
          editinfo: {
            member: member,
            btns: btns,
            left: member.css.left,
            top: member.css.top - r
          },
          showop: true
        })
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
        showAddMember: true,
        showop: false
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
