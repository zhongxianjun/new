//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    show: false
  },
  //事件处理函数
  open() {
    this.setData({ show: true });
  },
  close() {
    this.setData({ show: false });
  },
  onReady: function() {},
  onLoad: function() {}
});
