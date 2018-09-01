import util from '../../utils/util';
Page({
  data: {
    vsList: [],
    resultList: []
  },
  onLoad: function (options) {
    
  },
  addSchool() {

  },
  startVs() {

  },
  onShow: function () {
    this.loadPage();
    this.promise(126);
  },
  loadPage() {
    let _this = this;
    let vsList = wx.getStorageSync('vsList') ? wx.getStorageSync('vsList') : [];
    console.log(vsList);
    this.setData({
      vsList: vsList
    });

    this.getSchoolInfo()
    .then((values) => {
      wx.setStorageSync('vsResult', values);
      _this.setData({
        resultList: []
      });
      _this.setData({
        resultList: values
      });
    });
  },
  getSchoolInfo() {
    wx.showLoading();
    let _this = this;
    let arr = this.data.vsList.map((item, index) => {
      return _this.promise(item);
    });
    return Promise.all(arr).then((values) => {
      wx.hideLoading();
      return values;
    });;
  },
  promise(id) {
    return new Promise((resolve, reject) => {
      util.GET({
        url: '/Interface/YXK/AcademyApi.ashx?',
        params: {
          action: 'GetAcademyByID',
          Id: id
        },
        success: function (res) {
          console.log(res);
          if (res.S === '1') {
            resolve(res.SchoolList[0]);
          } else {
            resolve({});
          }
        }
      });
    });
  },
  vsBack(e) {
    console.log(e.detail.scrollY);
    if (e.detail.scrollY !== undefined) {
      this.setData({
        scrollY: e.detail.scrollY
      });
    } else {
      this.loadPage();
    }
  },
  onReady: function () {
  
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
    return {
      title: '志愿填报系统',
      path: '/pages/index/index'
    }
  }
})