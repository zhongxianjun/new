import util from '../../utils/util';
import urlencode from '../../utils/urlencode.min.js';
Page({
  data: {
    input: '',
    resultList: [],
    historyList: []
  },
  onLoad: function (options) {
    this.getHistory();
  },
  input(e) {
    this.data.input = e.detail.value;
    console.log(this.data.input);
    let input = this.data.input;
    if (input === '') {
      this.setData({
        resultShow: false,
        resultList: []
      });
    }
  },
  confirm(e) {
    let _this = this;
    let input = this.data.input;
    console.log(input);
    if (!input) {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none',
        duration: 1000
      });
    } else {
      console.log('开始搜索');
      let searchRseultUrl = {
        urlRoot: '/Interface/YXK/AcademyApi.ashx?',
        action: `GetAcademyList`,
        search: {
          page: '1',
          schoolname: urlencode(input, 'gbk')
        }
      }
      
      this.setData({
        resultShow: true
      });
      this.setData({
        resultList: [],
        searchRseultUrl: searchRseultUrl
      });
      this.selectComponent("#search-rseult").loadFirst();
    }
  },
  searchBack(e) {
    console.log(e.detail);
    let _this = this;
    if (e.detail.S === '1') {
      let resultList = e.detail.SchoolList;

      this.setData({
        noData: false,
        resultList: _this.data.resultList.concat(resultList)
      });
    } else {
      this.setData({
        noData: true,
        resultShow: false
      });
    }
    this.addHistory(this.data.input);
  },
  onReady: function () {
  
  },
  vsCountBack() {
    console.log('search的vsCountBack函数', wx.getStorageSync('vsList'),'---');
    this.selectComponent("#school-vs").check();
  },
  onShow: function () {
    this.vsCountBack();
  },
  getHistory() {
    let historyList =  wx.getStorageSync('historyList') ? wx.getStorageSync('historyList') : [];
    console.log(historyList);

    this.setData({
      historyList: historyList
    });
  },
  addHistory(input) {
    console.log(input);
    let historyList =  wx.getStorageSync('historyList') ? wx.getStorageSync('historyList') : [];
    console.log(historyList);
    if (!(historyList.indexOf(input) !== -1)) {
      if (historyList.length >= 10) {
        historyList.splice(0, 1, input);
      } else {
        historyList.push(input);
      }
      wx.setStorageSync('historyList', historyList);
      this.setData({
        historyList: historyList
      });
    }
  },
  deleteHistory() {
    let historyList = [];
    wx.setStorageSync('historyList', historyList);
    this.setData({
      historyList: historyList
    });
  },
  searchBefore(e) {
    console.log(e.currentTarget.dataset.value);
    let value = e.currentTarget.dataset.value
    this.data.input = value;
    this.setData({
      inputValue: value
    });
    this.confirm();
  },
  onHide: function () {
  
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
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
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