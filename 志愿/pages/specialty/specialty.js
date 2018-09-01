import util from '../../utils/util';
import urlencode from '../../utils/urlencode.min.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zid: "50531",
    name:'导游', 
    act:false,
    current:1,
  },
  tabOpen:function(){ 
    this.setData({
       act: true,
       current:0
    })
   
  },
  tabParticulars: function () {
    this.setData({ act: false, current: 1})
  
  },
  vsCountBack() {
    console.log('index的vsCountBack函数', wx.getStorageSync('vsList'), '---');
    this.selectComponent("#school-vs").check();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options)
    console.log(this.data.msg)
  },
  change:function(event){
    let current = event.detail.current
    console.log(current)
    if (current == 0 ){
      this.setData({
        act:true
      })
    } else if (current==1){
      this.setData({
        act: false
      })
    }
  },
  init: function (options){
    let zid = options.id || this.data.zid || wx.getStorageSync("zid") || ""
    let name = options.name || this.data.name || wx.getStorageSync("name") || ""
    let schoolID = options.schoolid || this.data.schoolid || wx.getStorageSync("schoolid") || ""
    let that = this
    console.log(name)
    if (schoolID && zid){
      util.GET({
        url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
        params: {
          action: 'GetSpecialtyIntro',
          zid: zid,
          schoolid: schoolID
        },
        success: function (res) {
          console.log(res, )
          if (res.S == 1) {
            that.setData({
              msg: res.pList[0]
            })
            console.log(that.data.msg, "專業詳情")
          }
        }
      });
    }else{
      util.GET({
        url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
        params: {
          action: 'SelectProfessionalByid',
          zid: zid
        },
        success: function (res) {
          console.log(res ,"專業詳情")
          if (res.S == 1) {
            that.setData({
              msg:res.pList[0]
            })
            console.log(that.data.msg[0])
          }
        }
      });
    }
    if (name){
      util.GET({
        url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
        params: {
          action: 'SpecialtyOpneSchool',
          specialname: urlencode(name, 'gbk'),
          Page: 1
        },
        success: function (res) {
          console.log(res, '开设院校')
          if (res.S == 1) {
            that.setData({
              schoolList: res.SchoolList
            })
          }
        }
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  pageScroll() {
    clearTimeout(this.data.timeOut);
    this.selectComponent("#school-vs").isShow(true);
    this.selectComponent("#share").isShow(true);
    this.data.timeOut = setTimeout(() => {
      this.selectComponent("#school-vs").isShow(false);
      this.selectComponent("#share").isShow(false);
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.vsCountBack();
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
  onShareAppMessage: function () {
    return {
      title: '志愿填报系统',
      path: '/pages/index/index'
    }
  }
})