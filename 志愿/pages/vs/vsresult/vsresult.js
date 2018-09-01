import util from '../../../utils/util';
Page({
  data: {
    resultList: []
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
    let _this = this;
    let vsResult = wx.getStorageSync('vsResult') ? wx.getStorageSync('vsResult') : [];
    console.log(vsResult);
    vsResult = vsResult.map((item, index) => {
      return Object.assign(item, {
        jianjie: item.jianjie.replace(/((&ldquo;)|(&undefinedrundefineddundefinedqundefineduundefinedoundefined;)|(&rdquo;)|(&mdash;)|(&amp;rdquo;)|(&amp;ldquo;))*/gi, (match) => {
          console.log(match);
          let value = '';
          if (match === '&undefinedrundefineddundefinedqundefineduundefinedoundefined;') {
            value = '';
          }
          if ((match === '&ldquo;') || (match === '&amp;ldquo;')) {
            value = '"';
            console.log(value);
          }
          if ((match === '&rdquo;') || (match === '&amp;rdquo;')) {
            value = '"';
            console.log(value);
          }
          if (match === '&mdash;') {
            value = '—';
            console.log(value);
          }
          return value;
        })
      });
    });
    this.setData({
      resultList: vsResult
    });
  },
  onHide: function () {
    
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  }
})