import util from '../../utils/util';
Page({
  data: {
    
  },
  onLoad: function (options) {
    
  },
  vsCountBack() {
    console.log('index的vsCountBack函数', wx.getStorageSync('vsList'),'---');
    this.selectComponent("#school-vs").check();
  },
  onReady: function () {
  
  },
  onShow: function () {
    this.vsCountBack();
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
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
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
    return {
      title: '志愿填报系统',
      path: '/pages/index/index'
    }
  }
})