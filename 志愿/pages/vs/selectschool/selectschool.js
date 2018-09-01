import util from '../../../utils/util';
Page({
  data: {
    schoolList: []
  },
  onLoad: function (options) {
    console.log('选学校页面参数', options);
    this.data.areaId = options.id;
    this.setData({
      changeIndex: options.changeIndex
    });
    this.checkSchoolList();
  },
  checkSchoolList() {
    console.log('查询学校列表');
    let _this = this;
    let schoolRseultUrl = {
      urlRoot: '/Interface/YXK/AcademyApi.ashx?',
      action: `GetAcademyList`,
      search: {
        province: _this.data.areaId,
        page: 1
      }
    }
    
    this.setData({
      schoolRseultUrl: schoolRseultUrl
    });

    this.selectComponent("#select-school").loadFirst();
  },
  schoolRseultBack(e) {
    console.log(e.detail);
    let schoolList = e.detail.SchoolList;
    this.setData({
      schoolList: this.data.schoolList.concat(schoolList)
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