import util from '../../utils/util';
import urlencode from '../../utils/urlencode.min.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigHeight:'150rpx',
    Unfold:'展开全部专业',
    inputTxt:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  input(e) {
    this.data.input = e.detail.value;
    console.log(this.data.input);
  },
  confirm(e) {
    let input = this.data.input;
    let that = this;
    let broadList = this.data.broadList
    
    if (!input) {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none',
        duration: 1000
      });
    } else {
      broadList.map(function (v) {
        v.act = false;
      })
      that.setData({
        broadList: broadList
      })
      util.GET({
        url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
        params: {
          action: 'SelectProfessional',
          specialname: urlencode(input, 'gbk'),
        },
        success: function (res) {
          console.log(res)
          if (res.S == 1) {
            that.setData({
              subclassList:res.pList,
              bigHeight: '150rpx',
              Unfold: '展开全部专业'
            })
          }else{
            wx.showToast({
              title: '请输入正确的关键字',
              icon: 'none',
              duration: 1000
            });
            that.setData({
              input: ''
            })
          }
        }
      });
    }
    
  },
  init:function(){
    let that = this;
    util.GET({
      url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
      params: {
        action: 'GetProfessionalMax',
      },
      success: function (res) {
        console.log(res.pList,"专业大类")
        if(res.S == 1){
            that.setData({
              broadList:res.pList
            })
        }
      }
    });
  },
  bigClass:function(){
    let bigHeight = this.data.bigHeight;
    if (bigHeight=='150rpx'){
      this.setData({
        bigHeight:'auto',
        Unfold:'收起全部专业'
      })
    }else{
      this.setData({
        bigHeight: '150rpx',
        Unfold: '展开全部专业'
      })
    }
  },
  chooseSmall:function(event){
    let id = event.currentTarget.dataset.id
    let that = this;
    let broadList = this.data.broadList
    broadList.map(function(v){
        v.act = false;
    })
    broadList[id-1].act = true
    this.setData({
      broadList: broadList
    })
    util.GET({
      url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
      params: {
        action: 'GetProfessionalSmall',
        zytypeid: id
      },
      success: function (res) {
        console.log(res.pList, "专业小类")
        if (res.S == 1) {
          that.setData({
            subclassList: res.pList,
          })
         
        }
      }
    });
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
  onPageScroll(e) {
    clearTimeout(this.data.timeOut);
    this.selectComponent("#school-vs").isShow(true);
    this.selectComponent("#share").isShow(true);
    this.data.timeOut = setTimeout(() => {
      this.selectComponent("#school-vs").isShow(false);
      this.selectComponent("#share").isShow(false);
    }, 1000);
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