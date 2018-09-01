import util from '../../utils/util';
import urlencode from '../../utils/urlencode.min.js';
Page({
  data: {
    current: 0,
    selectName: ['各省批次线', '高校录取线', '专业录取线'],
    areaList: [],
    schoolRseultList: [],
    majorRseultList: []
  },
  selectCurrent(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    });
  },
  onLoad: function (options) {
    let _this = this;

    // 获取省份列表
    util.GET({
      url: '/Interface/YXK/PublicApi.ashx?',
      params: {
        action: 'GetProvinceList',
      },
      success: function (res) {
        console.log(res);
        if (res.S === '1') {
          let list = res.pList.map((item, index) => {
            return {
              id: item.ID,
              value: item.ProvinceName
            }
          });
          console.log(list);
          _this.setData({
            areaList: list
          });
        }
      }
    });
  },

  // 高校分数线参数
  setWenli(e) {
    console.log('高校分数线文理：', e.detail);
    this.data.wenliId = e.detail.id;
    this.setData({
      wenliIndex: e.detail.index
    });
  },
  setYear(e) {
    console.log('高校分数线年份：', e.detail);
    this.data.yearId = e.detail.id;
    this.setData({
      yearIndex: e.detail.index
    });
  },
  setLocation(e) {
    console.log('高校分数线地区：', e.detail);
    this.data.locationId = e.detail.id;
    this.setData({
      locationIndex: e.detail.index
    });
  },
  setArea(e) {
    console.log('高校分数线地区：', e.detail);
    this.data.areaId = e.detail.id;
    this.setData({
      areaIndex: e.detail.index
    });
  },
  setPici(e) {
    console.log('高校分数线批次：', e.detail);
    this.data.piciId = e.detail.id;
    this.setData({
      piciIndex: e.detail.index
    });
  },
  checkSchoolLine() {
    console.log('查询高校分数线');
    let _this = this;
    let schoolRseultUrl = {
      urlRoot: '/Interface/YXK/AcademyApi.ashx?',
      action: `GetAcademyList`,
      search: {
        province: _this.data.locationId,
        pcid: _this.data.piciId,
        page: 1
      }
    }
    
    this.setData({
      schoolRseultUrl: schoolRseultUrl,
      schoolRseultList: []
    });
    this.selectComponent("#school-rseult").loadFirst();
  },
  schoolLineBack(e) {
    console.log(e.detail);
    let _this = this;
    if (e.detail.S === '1') {
      let schoolRseultList = e.detail.SchoolList.map((item, index) => {
        return Object.assign(item, {
          queryArea:  _this.data.areaId,
          queryYear:  _this.data.yearId,
          queryWenli:  _this.data.wenliId
        });
      });

      this.setData({
        schoolLineShow: false,
        schoolRseultList: this.data.schoolRseultList.concat(schoolRseultList)
      });
    } else {
      this.setData({
        schoolLineShow: true
      });
    }
    this.setData({
      hotSchool: true
    });
  },

  setBigClass(e) {
    console.log('专业大类：', e.detail);
    this.data.bigClassId = e.detail.id;
    this.setData({
      bigClassIndex: e.detail.index
    });
    this.selectComponent("#small-class").setSmallClassList(e.detail.id);
  },
  setSmallClass(e) {
    console.log('专业小类：', e.detail);
    this.data.smallClassId = e.detail.id;
    this.data.smallClassName = e.detail.value;
  },
  // 专业分数线参数
  checkMajorLine() {
    console.log('查询专业分数线');
    let _this = this;

    let majorRseultUrl = {
      urlRoot: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
      action: `SpecialtyOpneSchool`,
      search: {
        specialname: urlencode(_this.data.smallClassName, 'gbk'),
        page: 1
      }
    }

    this.setData({
      majorRseultUrl: majorRseultUrl,
      majorRseultList: []
    });
    this.selectComponent("#major-rseult").loadFirst();
  },
  majorLineBack(e) {
    console.log(e.detail);
    let _this = this;
    if (e.detail.S === '1') {
      let majorRseultList = e.detail.SchoolList.map((item, index) => {
        return Object.assign(item, {
          area: _this.data.areaId,
          Year: _this.data.yearId,
          wl: _this.data.wenliId,
          pcid: _this.data.piciId,
        })
      });

      this.setData({
        majorLineShow: false,
        majorRseultList: this.data.majorRseultList.concat(majorRseultList)
      });
    } else {
      this.setData({
        majorLineShow: true
      });
    }
    this.setData({
      hotMajor: true
    });
  },
  
  onReady: function () {
  
  },
  onReachBottom: function () {
    
  },
  onShow: function () {
    this.vsCountBack();
  },
  vsCountBack() {
    console.log('fenshuxian的vsCountBack函数', wx.getStorageSync('vsList'),'---');
    this.selectComponent("#school-vs").check();
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
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
  onPullDownRefresh: function () {
  
  },
  onShareAppMessage: function () {
    return {
      title: '志愿填报系统',
      path: '/pages/index/index'
    }
  }
})