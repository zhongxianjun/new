import util from '../../../utils/util';
Page({
  data: {
    areaList: []
  },
  onLoad: function (options) {
    console.log(options);
    this.data.changeIndex = options.changeIndex;
    let _this = this;
    util.GET({
      url: '/Interface/YXK/PublicApi.ashx?',
      params: {
        action: 'GetProvinceList',
      },
      success: function (res) {
        console.log(res);
        if (res.S === '1') {
          _this.setData({
            areaList: res.pList
          });
        }
      }
    });
  },
  selectSchool(e) {
    console.log(e.currentTarget);
    let id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/vs/selectschool/selectschool?id=${id}&changeIndex=${this.data.changeIndex}`
    });
  },
  onReady: function () {
  
  },
  onShow: function () {
  
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