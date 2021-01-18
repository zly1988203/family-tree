// pages/eidtmember/editmember.js
import {
  extendObj, is_empty, is_number, doPost, doUpload, showToast
} from "../../utils/util.js"
const config = require("../../config.js")
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    baseOss:config.baseOss,
    postFlag:false,
    alert:null,
    type:'',
    userid: '',
    familyid:0,
    showtype: "edit",
    shareid: "",
    sharecode: "",
    fromid: '',
    relationship: '',//添加时候有用，与目标人关系
    showmore:false,
    showtextarea:false,
    defaultregion: ['湖南省', '长沙市', '天心区'],
    relationshipList:[{
        name:"无",
        code:"",
      }, {
        name: "出继",
        code:"出继",
      }, {
        name: "入继",
        code:"入继",
      }, {
        name: "出嗣",
        code:"出嗣",
      }, {
        name: "入嗣",
        code:"入嗣",
      }, {
        name: "兼祧",
        code:"兼祧",
      }, {
        name: "承祧",
        code:"承祧",
      }, {
        name: "招赘",
        code:"招赘",
      }, {
        name: "入赘",
        code:"入赘",
      }, {
        name: "孀赘",
        code:"孀赘",
    }],
    isUpdate:false,
    isSave: false,
    list: [],    //母亲列表
    member:{
      id:'',
      familyId:0,
      header:'',
      firstname:'',
      lastname:'',
      gender:'M',
      birthTime: '',
      deathTime: '',   //死亡日期 暂用
      age: '',   //享年 暂用
      childOrder:0,
      isLiving:true,
      gName:'',
      mobile:'',
      list:[],
      originAreaDetails:'',
      other:"",
      idCard:"",
      cardName: '',
      zi: '',
      templeTitle:'',   //谥号
      liveArea: '',
      liveDetails: '',
      birthArea: '',
      birthAreaDetails: '',
      nation:'',
      mailbox:'',
      description:''
    },
    is_examination:false,  //是否可考默认可考
    sex: [{ name: 'M', value: '男', checked: true },
      { name: 'W', value: '女' },],
    nation_list: ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '僳僳族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'],  //56个民族
    index:0, //民族数组的初始坐标默认为0
    mother_index:0,//母亲列表的下标
    motherId:'',
    is_Submission: true,     //提交按钮置灰，默认不置灰
    buryAddr: '',   //安葬地址
    coordinate:'',    //安葬坐标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    if (is_empty(app.globalData.userInfo.userid) && (!is_empty(options.showType) && options.showType != 'share')) {
      wx.redirectTo({
        url: '../login/login'
      })
    }
    var userid = options.userid ? options.userid:''
    var fromid = options.fromid ? options.fromid : ''
    _this.data.familyid = app.globalData.userInfo.familyid
    if (!is_empty(options.familyid) && is_number(options.familyid)){
      _this.data.familyid = parseInt(options.familyid)
    }
    _this.data.showtype = options.showtype ? options.showtype : 'edit'
    _this.data.shareid = options.shareid ? options.shareid : ''
    _this.data.sharecode = options.sharecode ? options.sharecode : ''
    var type = options.type ? options.type : ''
    _this.setData({type:type})
    console.log(type)
    var relationship = options.relationship ? options.relationship : ''
    if (is_empty(userid) && type != 'add'){
      wx.showToast({
        title: '参数错误',
        icon: 'success',
        duration: 2000
      })
      wx.redirectTo({
        // url: '../editjiapu/editjiapu'
      })
    }
    if (is_empty(userid) && type != 'add') {
    }
    //获取待编辑用户资料，需要接口支持,暂时为空
    if(!is_empty(userid)){
      doPost("/wx/familyMember/getFamilyMember",{"inmap":{
        "familyMemberId":userid,
        "familyId": _this.data.familyid,
        "operatorId": _this.data.showtype == "share" ? '' :app.globalData.userInfo.userid,
        "type": _this.data.showtype,
        "shareId": _this.data.shareid,
        "openId": app.globalData.userInfo.openid,
        "shareCode": _this.data.sharecode,
      }},function(res){
        if(res.code==0){
          if (res.data.list!='') {
            let lists = res.data.list || []
            let mother_list = ['请选择'];
            for (let name = 0; name < lists.length; name++) {
              mother_list.push(res.data.list[name].name);
              if (lists[name].id == res.data.member.motherId){
                _this.setData({ mother_index: name+1 })
              }
            }
            _this.setData({ mother_list: mother_list, motherId: res.data.member.motherId})
          }
          var member = res.data.member;
          if(!member.isForeigner){
            _this.setData({
              relationshipList:[{
                name:"无",
                code:"",
              }, {
                name: "出继",
                code:"出继",
              }, {
                name: "入继",
                code:"入继",
              }, {
                name: "出嗣",
                code:"出嗣",
              }, {
                name: "入嗣",
                code:"入嗣",
              }, {
                name: "兼祧",
                code:"兼祧",
              }, {
                name: "承祧",
                code:"承祧",
              }, {
                name: "招赘",
                code:"招赘",
              }, {
                name: "入赘",
                code:"入赘",
              }]
            })
          }else{
            _this.setData({
              relationshipList:[{
                name:"无",
                code:"",
              }, {
                name: "孀赘",
                code:"孀赘",
              }]
            })
          }
          _this.data.familyid = member.familyId
          _this.setData({
            isUpdate: member.isUpdate ? true : false,
            isSave: member.isSave ? true : false,
            list: is_empty(res.data.list) ? false : res.data.list,
            birthTime: member.birthTime,
            deathTime: member.deathTime,
            buryAddr: is_empty(member.buryAddr)? '' : member.buryAddr,
            age:member.age,
            member:extendObj([{},_this.data.member,{
              id:member.id,
              familyId:member.familyId,
              header:member.header,
              firstname:member.firstname,
              lastname:member.lastname,
              gender:member.gender=="M"?'M':'W',
              templeTitle: member.templeTitle ? member.templeTitle:'',
              childOrder:member.childOrder,
              isLiving:member.isLiving,
              gName:member.gName,
              mobile: member.mobile,
              list: member.list,
              originAreaDetails: member.originAreaDetails,
              other:member.other?member.other:'',
              idCard:member.idCard,
              cardName: member.cardName,
              zi: member.zi,
              liveArea: is_empty(member.liveArea)?'':member.liveArea.split(","),
              liveDetails: member.liveDetails,
              birthArea: is_empty(member.birthArea)?'':member.birthArea.split(","),
              birthAreaDetails: member.birthAreaDetails,
              nation: member.nation || _this.data.nation_list[_this.data.index],
              mailbox:member.mailbox,
              description:member.description
            }])
          });
          if (member.gender=='W'){    //编辑的时候，用户是女则改变性别数据
            _this.setData({
              sex: [{ name: 'M', value: '男', },
              { name: 'W', value: '女' ,checked: true }],
            })
          }
          let nation_list = _this.data.nation_list;
          for (let i = 0; i < nation_list.length; i++) {    //获取民族下标
            if (nation_list[i] == member.nation) {
              _this.setData({ index: i })
            }
          }
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      _this.setData({
        isSave: true,
      });
      _this.data.member.familyId = _this.data.familyid
    }
    _this.data.type = type;
    _this.data.userid = userid
    _this.data.fromid = fromid
    _this.data.relationship = relationship
    if(relationship == "C"){
      _this.setData({
        relationshipList:[{
          name:"无",
          code:"",
        }, {
          name: "出继",
          code:"出继",
        }, {
          name: "入继",
          code:"入继",
        }, {
          name: "出嗣",
          code:"出嗣",
        }, {
          name: "入嗣",
          code:"入嗣",
        }, {
          name: "兼祧",
          code:"兼祧",
        }, {
          name: "承祧",
          code:"承祧",
        }, {
          name: "招赘",
          code:"招赘",
        }, {
          name: "入赘",
          code:"入赘",
        }],
        top_title:'添加子女',
      })
    }else if(relationship == "P"){
      _this.setData({
        relationshipList:[{
          name:"无",
          code:"",
        }, {
          name: "孀赘",
          code:"孀赘",
        }],
        top_title: '添加配偶',
      })
    }
    _this.data.alert = _this.selectComponent("#alert");
    if (options.type=='add'){
     _this.shuju();
    }
  },
  // 数据
  shuju:function(){
    let _this = this;
    doPost("/wx/familyMember/getSaveFamilyMemberBefore", {
      "inmap": {
        "familyId": _this.data.familyid,
        "sourseId": _this.data.fromid,
        "relationType": _this.data.relationship,
        "type": _this.data.type,
        "shareId": _this.data.shareid,
        "shareCode": _this.data.sharecode,
      }
    }, function (res) {
      console.log(res);     //居住地省市区
      if(res.code == 0){
        let mother_list = ['请选择'];
        let lists = res.data.list || []
        for (let name = 0; name < lists.length; name++) {
          mother_list.push(lists[name].name);
        }
        if (lists.length>1){    //如果有两个以上的母亲则默认选择第一个母亲
          _this.setData({ mother_index: 1, motherId: lists[0].id})
        }
        if (res.data.gender == 'W') {  //性别是女
        console.log(res.data)
          _this.setData({
            sex: [{ name: 'M', value: '男' }, { name: 'W', value: '女', checked: true }]
          })
        }
        _this.setData({
          mother_list: mother_list,
          list: is_empty(res.data.list) ? false : res.data.list,
          member: {
            id: res.data.id,
            familyId: _this.data.member.familyId,
            header: res.data.header,
            firstname: res.data.firstname,
            lastname: res.data.lastname,
            gender: res.data.gender == "M" ? 'M' : 'W',
            isLiving: res.data.isLiving != null ? res.data.isLiving:true,
            gName: res.data.gName,
            mobile: res.data.mobile,
            templeTitle: res.data.templeTitle ? res.data.templeTitle : '',
            list:res.data.list,
            originAreaDetails: res.data.originAreaDetails,
            other: res.data.other ? res.data.other : '',
            idCard: res.data.idCard,
            cardName: res.data.cardName,
            childOrder: res.data.childOrder,
            zi: res.data.zi,
            liveArea: is_empty(res.data.liveArea) ? '' : res.data.liveArea.split(","),
            liveDetails: res.data.liveDetails,
            birthArea: is_empty(res.data.birthArea) ? '' : res.data.birthArea.split(","),
            birthAreaDetails: res.data.birthAreaDetails,
            nation: res.data.nation,
            mailbox: res.data.mailbox,
            description: res.data.description
          },
        });
        let nation_list = _this.data.nation_list;
        for (let i = 0; i < nation_list.length; i++) {    //获取民族下标
          if (nation_list[i] == res.data.nation) {
            _this.setData({ index: i })
          }
        }
      }
    })
    _this.data.alert = _this.selectComponent("#alert")
  },
  showArea:function(e){
    var _this = this
    if(_this.data.isSave || (!is_empty(_this.data.userid) && _this.data.isUpdate)){
      var t_show = e.currentTarget.dataset.show=="yes"?true:false; 
      if (t_show){
      this.setData({ showtextarea: !t_show }) 
      }else{
      _this.setData({
      showtextarea: !t_show
      })
      } 
    }
  },
  changeShowMore: function () {
    var _this = this;
    _this.setData({
      showmore: _this.data.showmore?false:true
    })
  },
  selectRelationship: function (e) {
    var _this = this;
    if (_this.data.isSave || (!is_empty(_this.data.userid) && _this.data.isUpdate)){
      var idx = parseInt(e.currentTarget.dataset.id);
      var relationshipList = _this.data.relationshipList;
      if (relationshipList[idx]) {
        _this.setData({
            ['member.other']: relationshipList[idx].code
        })
      }
    }
  },
  //选择性别
  radioChange: function (e) {
    let _this = this;
    let value = e.detail.value;
    _this.data.member.gender=value;
  },
  //选择名族
  nation_list: function (e) {
    let _this = this;
    let index = e.detail.value;
    _this.setData({ index: index });
  },
  //是否可考
  switch1Change:function(e){
    let _this = this;
    _this.setData({ is_examination: e.detail.value,});
    if (e.detail.value == true){
      _this.data.member.isLiving = false;
    }
  },
  //选择母亲
  xuan_mother:function(e){
    let _this = this;
    let mother_index = parseInt(e.detail.value);
    if (mother_index==0){
      _this.setData({ mother_index: mother_index, motherId:'' });
    }else{
      _this.setData({ mother_index: mother_index, motherId: _this.data.list[mother_index-1].id });
    }
  },
  // 打开地图选取位置
  openLocation:function(){
    let _this = this;
    let buryAddr = _this.data.buryAddr||'';
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置,确认授权?',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    console.log(res)
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.chooseLocation({
                        success: function (res) {
                          console.log(res);
                          if (buryAddr == '') {
                            _this.setData({
                              buryAddr: res.address + res.name,
                              coordinate: '经度：' + res.longitude + '纬度：' + res.latitude
                            });
                          }
                        },
                      })
                    }
                  }
                })
              }
            }
          })
        }else{
          wx.chooseLocation({
            success: function (res) {
              console.log(res);
              if (buryAddr == '') {
                _this.setData({
                  buryAddr: res.address + res.name,
                  coordinate: '经度：' + res.longitude + '纬度：' + res.latitude
                });
              }
            },
          })
        }
      },
      fail: function (res) { }
    })
  },
  input_buryAddr:function(e){
    let _this = this;
    let buryAddr = e.detail.value;
    _this.setData({ buryAddr: buryAddr});
  },
  editSubmit:function(){
    var _this=this;
    if (_this.data.member.firstname == null){
      _this.data.alert.tips("请输入您的姓氏", 2000);
      _this.goTop();
      return
    };
    if (_this.data.member.lastname == null) {
      _this.data.alert.tips("请输入您的名字", 2000);
      _this.goTop();
      return
    };
    if (_this.data.member.mobile == null && _this.data.member.isLiving) {
      _this.data.alert.tips("请输入您的手机", 2000);
      _this.goTop();
      return
    };
    if (_this.data.isSave || (!is_empty(_this.data.userid) && _this.data.isUpdate)){
      _this.setData({ is_Submission: false }); //提交按钮置灰
      wx.showLoading({
        title: '正在提交',
      })
      var member = _this.data.member
      var data = {
        "inmap": {
          operatorId: _this.data.showtype == "share" ? '' :app.globalData.userInfo.userid,
          type: _this.data.showtype,
          shareId: _this.data.shareid,
          openId: app.globalData.userInfo.openid,
          shareCode: _this.data.sharecode,
          id:member.id,
          familyId:member.familyId,
          header:member.header,
          firstname:member.firstname,
          lastname:member.lastname,
          gender: member.gender,
          birthTime:_this.data.birthTime,
          deathTime: _this.data.deathTime,
          age: _this.data.age,
          templeTitle: member.templeTitle ? member.templeTitle : '',
          childOrder:member.childOrder,
          isLiving: member.isLiving,
          gName:member.gName,
          mobile: member.mobile,
          motherId: _this.data.motherId,
          originAreaDetails: member.originAreaDetails,
          other:member.other,
          idCard:member.idCard,
          cardName: member.cardName,
          zi: member.zi,
          liveArea: is_empty(member.liveArea) ? '' : member.liveArea.join(","),
          liveDetails: member.liveDetails,
          birthArea: is_empty(member.birthArea) ? '' : member.birthArea.join(","),
          birthAreaDetails: member.birthAreaDetails,
          nation: _this.data.nation_list[_this.data.index],
          mailbox:member.mailbox,
          description:member.description,
          buryAddr: _this.data.buryAddr,
          coordinate: _this.data.coordinate,
        }
      }
      var url = _this.data.type=="add"?"/wx/familyMember/saveFamilyMember":"/wx/familyMember/updateFamilyMember"
      if(_this.data.type=="add"){
        data.inmap["sourseId"] = _this.data.fromid
        data.inmap["relationType"] = _this.data.relationship
      }
      if(!_this.data.postFlag){
        _this.data.postFlag = true;
        doPost(url,data,function(res){
          if(res.code==0){
            wx.hideLoading()
            wx.showToast({
              title: (_this.data.type=="add"?"添加":"编辑")+"成员成功",
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.navigateBack({delta:1});//模拟返回操作
            }, 2000);
          }else{
            _this.data.postFlag = false;
            _this.setData({ is_Submission: true }); //提交按钮置灰
            wx.hideLoading()
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  },
  changeAvatar:function(){
    var _this = this;
    if (_this.data.isSave || (!is_empty(_this.data.userid) && _this.data.isUpdate)){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePath = res.tempFilePaths[0]
          if (tempFilePath) {
            _this.data.alert.imageSelect(tempFilePath, true, function (tImageFile) {
              //上传文件到服务器功能开始
              doUpload('/user/uploadHeadImg', 'headImg', tImageFile, {
                familyId: parseInt(_this.data.familyid),
              }, function (res) {
                if (res.code == 0) {
                  _this.setData({
                    ['member.header']: res.data
                  })
                } else {
                  _this.data.alert.tips(res.msg, 2000);
                }
              })
            })
          }else{
            wx.showToast({
              title: '请选择图片',
              icon: 'error',
              duration: 2000
            })
          }
        }
      })
    }
  },
  birthTime:function(e){
    let _this =this;
    let birth = e.detail.value;
    let deathTime = _this.data.deathTime;
    var birArr = birth.split(/[^0-9]/ig);
    let birthTime = birArr[0] + '年' + birArr[1] + '月' + birArr[2] + '日';
    _this.setData({ birthTime: birthTime });
    _this.ages(birthTime, deathTime);
  },
  input_birthTime:function(e) {
    let _this = this;
    let birthTime = e.detail.value;
    let deathTime = _this.data.deathTime;
    _this.setData({ birthTime: birthTime });
  },
  deathTime: function (e) {
    let _this = this;
    let death = e.detail.value;
    let birthTime = _this.data.birthTime;
    var dirArr = death.split(/[^0-9]/ig);
    let deathTime = dirArr[0] + '年' + dirArr[1] + '月' + dirArr[2] + '日';
    _this.setData({ deathTime: deathTime });
    _this.ages(birthTime, deathTime);
  },
  input_deathTime: function (e) {
    let _this = this;
    let deathTime = e.detail.value;
    let birthTime = _this.data.deathTime;
    _this.setData({ deathTime: deathTime });
  },
  //算享年
  ages: function (birthTime, deathTime){
    let _this = this;
    let time_zz = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$|(^\d{4}年\d{1,2}月\d{1,2}日$)$/;//出生年月日正常 xxxx-xx-xx
    if (time_zz.test(birthTime) && time_zz.test(deathTime) && is_empty(_this.data.age)) {
      var birArr = birthTime.split(/[^0-9]/ig);
      var birYear = parseInt(birArr[0]);
      var birMonth = parseInt(birArr[1]);
      var birDay = parseInt(birArr[2]);
      var dirArr = deathTime.split(/[^0-9]/ig);
      var dirYear = parseInt(dirArr[0]);
      var dirMonth = parseInt(dirArr[1]);
      var dirDay = parseInt(dirArr[2]);
      let ageDiff = dirYear - birYear;
      if (ageDiff > 0){
        _this.setData({ age: ageDiff + 1 })
      } else if (ageDiff == 0){
        if (dirMonth - birMonth > 0) {
          _this.setData({ age: ageDiff + 1 })
        } else if (dirMonth - birMonth ==0){
          if (dirDay - birDay > 0 || dirDay - birDay == 0) {
            _this.setData({ age: ageDiff + 1 })
          }
        }
      }else{
        showToast('辞世日期小于出生日期')
      }
    }
  },
  input_age:function(e){
    console.log(e);
    let _this = this;
    _this.setData({age:e.detail.value})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //监听页面高度(上滑或者下滑)
  onPageScroll: function (obj) {
    this.setData({
      scrollTop: obj.scrollTop
    })
  },
  goTop: function () {  // 一键回到顶部
    let _this = this;
    if (_this.data.scrollTop>280) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
    }
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