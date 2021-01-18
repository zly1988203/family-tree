// component/ebook/ebook.js
import {
  extendObj, is_empty, is_number, doPost, getCharLength
} from "../../utils/util.js"
const computedBehavior = require('miniprogram-computed')
var commonMixin = require('../../utils/commonMixin.js')
const app = getApp()
const config = require("../../config.js")
var oldx = 0;
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
    baseOss: config.baseOss,
    isLoading: false,
    showPrevEnd: false,//上翻页结束提示
    prevEnd: true,//上翻页结束
    prevPage:0,
    nextPage: 0,
    nextEnd: true,//下翻页结束
    showNextEnd: false,//下翻页结束提示
    showsearchlist: false,
    pixelRatio:1,
    outbox:{
      width:0,
      height:0,
    },
    inbox: {
      width: 0,
      height: 0,
    },
    descHeight:0,
    member_list: [],
    fontSize:{
      level: 20,
      zi: 24,
      other: 24,
      name: 34,
      desc: 26,
    },
    lineHeight: {
      level: 20,
      zi: 45,
      other: 45,
      name: 40,
      desc: 45,
    },
    height: {
      level: 67,
      zi: 73,
      other: 85,
      name: 122,
      desc: 0,
    },
    search_form: {
      keywords: "",
    },
    searchlist: [],
  },

  lifetimes: {
    attached: function () {
      var _this = this
      var query = wx.createSelectorQuery().in(_this)
      query.select('#jiapu_outside_box').boundingClientRect((res) => {
        var c_w = res.width;
        var c_h = res.height;
        _this.data.outbox.width = c_w;
        _this.data.outbox.height = c_h;
        wx.getSystemInfo({
          success(sinfo) {
            _this.data.pixelRatio = 750 / sinfo.windowWidth
            //后续执行
            _this.init();
            _this.loadpage()
          }
        })
      }).exec();
    }
  },
  
  computed: {
  },
  /**
   * 组件的方法列表
   */
  methods: Object.assign({
    init:function(obj){
      var _this = this
      var member_list= [
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于(1200)年（3月），殁与1783年8月，其他介绍如",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李文",
          desc: "辈分某，字某某，号某某某，生于1200年3月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月，其他介绍",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月，其他介绍",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月，其他介绍",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月",
        },
        {
          id: '',
          shi: "三世",
          zi: "春",
          other: "女婿",
          name: "李德文",
          desc: "辈分某，字某某，号某某某，生于1200年3月，殁与1783年8月",
        },
      ]
      var mlen = member_list.length;
      var mlist = [];
      var all_width = 0;
      _this.data.height.desc = (_this.data.outbox.height - 4) * _this.data.pixelRatio - _this.data.height.level - _this.data.height.zi - _this.data.height.other - _this.data.height.name
      for(var i=0;i<mlen;i++){
        var member = extendObj([{},member_list[i]]);
        console.log("row",i+1);
        var mwidth = Math.ceil(getCharLength(member.shi) / Math.floor((_this.data.height.level - 40) / _this.data.fontSize.level)) * _this.data.lineHeight.level;
        console.log("width", mwidth);
        var temwidth = Math.ceil(getCharLength(member.zi) / Math.floor((_this.data.height.zi - 20) / _this.data.fontSize.zi)) * _this.data.lineHeight.zi;
        console.log("width", temwidth);
        mwidth = mwidth > temwidth ? mwidth : temwidth;
        temwidth = Math.ceil(getCharLength(member.other) / Math.floor((_this.data.height.other - 20) / _this.data.fontSize.other)) * _this.data.lineHeight.other;
        console.log("width", temwidth);
        mwidth = mwidth > temwidth ? mwidth : temwidth;
        temwidth = Math.ceil(getCharLength(member.name) / Math.floor((_this.data.height.name - 10) / _this.data.fontSize.name)) * _this.data.lineHeight.name;
        console.log("width", temwidth);
        mwidth = mwidth > temwidth ? mwidth : temwidth;
        temwidth = Math.ceil(getCharLength(member.desc) / Math.floor((_this.data.height.desc - 20) / _this.data.fontSize.desc)) * _this.data.lineHeight.desc;
        console.log("width", temwidth);
        mwidth = mwidth > temwidth ? mwidth : temwidth;
        member["width"] = mwidth;
        all_width += mwidth
        mlist.push(member)
      }
      _this.setData({
        member_list: mlist,
        inbox: extendObj([{},_this.data.inbox,{
          width: all_width
        }])
      })
    },
    changeJiapu:function(e){
      var _this = this
      var x = e.detail.x
      var box_width = _this.data.outbox.width - 2;
      var content_width = _this.data.inbox.width / _this.data.pixelRatio;
      var direction = false;//往后翻页
      if(oldx>x){
        direction = true;//往前翻页
        if (_this.data.showNextEnd) {
          _this.setData({
            showNextEnd: false
          })
        }
      } else {
        if (_this.data.showPrevEnd) {
          _this.setData({
            showPrevEnd: false
          })
        }
      }
      oldx = x;
      if (!direction && x > -10) {//后翻页
        if (_this.data.nextEnd) {
          _this.setData({
            showNextEnd: true
          })
        } else {
          _this.loadpage(false)
        }
      } else if (direction && box_width + 10 > content_width + x) {//前翻页
        if (_this.data.prevEnd) {
          _this.setData({
            showPrevEnd: true
          })
        } else {
          _this.loadpage(true)
        }
      }
    },
    loadpage: function (type) {
      console.log("loadingpage", type)
      var _this = this
      if (!_this.data.isLoading){
        _this.data.isLoading = true
        var page;
        type = type ? true : false;
        if (type) {
          page = _this.data.prevPage
        } else {
          page = _this.data.nextPage
        }
        page++;
        /*
        doPost(url,params,function(res){//获取数据
          _this.data.isLoading = false
          if(res.code==0){
            if (type){//页码回写
              _this.data.prevPage = page
            } else {
              _this.data.nextPage = page
            }
            _this.setData({//setData
              member_list:xxxxx
            },function(){
              var query = wx.createSelectorQuery().in(_this)
              query.select('#jiapu_inside_box').boundingClientRect((res) => {//获取宽度
                var c_w = res.width;
                var c_h = res.height;
                _this.data.inbox.width = c_w;
                _this.data.inbox.height = c_h;
                if (_this.data.inbox.width < _this.data.outbox.width + 10){//如果宽度不够，则继续获向后翻一页
                  _this.loadpage();//向后翻页
                }
              }).exec();
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
        */
      }
    },
    searchSubmit: function () {
      var _this = this
      var search_form = _this.data.search_form
      if (!is_empty(search_form.keywords)) {
        doPost("/wx/familyMember/getFamilyMemberByCondition", {
          inmap: {
            type: _this.data.showtype,
            operatorId: _this.data.showtype == "share" ? "" : app.globalData.userInfo.userid,
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
          if (res.code == 0) {
            if (is_empty(res.data.members)) {
              wx.showToast({
                title: '没有找到结果',
                icon: 'none',
                duration: 2000
              })
            } else {
              if (res.data.members.length == 1) {
                var member = res.data.members[0]
                _this.init({ userId: member.id })
              } else {
                _this.showSearchList(res.data.members)
              }
            }
          } else {
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
  }, commonMixin),
})