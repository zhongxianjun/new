import util from '../../utils/util';
Component({
  externalClasses: [],
  properties: {
    school: {
      type: Object,
      value: {}
    }
  },
  data: {
    height: 0,
    vScore: ''
  },
  methods: {
    checkDetails(e) {
      const _this = this;
      let school = _this.data.school;
      wx.createSelectorQuery().in(this).select(`#details`).boundingClientRect((res) => {
        console.log(res.height);
        if (_this.data.height > 0) {
          _this.setData({
            height: 0
          });
        } else {
          _this.setData({
            height: res.height
          });
        }
      }).exec();
    },
    checkLine() {
      let _this = this;
      let school = _this.data.school;
      console.log(school);
      util.GET({
        url: '/Interface/YXK/FractionalLineApi.ashx?',
        params: {
          action: 'GetFractionalLine',
          schoolid: school.ID,
          provinceid: school.queryArea,
          year: school.queryYear,
          wlid: school.queryWenli,
          Page: 1
        },
        success: function (res) {
          console.log(res);
          if (res.S === '1') {
            _this.setData({
              line: res.LineList
            });
          }
          _this.checkDetails();
        }
      });
    },
    addVs() {
      const school = this.data.school;
      const id = school.ID;
      console.log(id);
      const _this = this;
      let vsList = wx.getStorageSync('vsList') ? wx.getStorageSync('vsList') : [];
      console.log(vsList);
      let changeIndex = this.data.changeIndex;
      if ((changeIndex !== 'undefined') && (changeIndex !== undefined) && (changeIndex !== '')) {
        let changeIndex = this.data.changeIndex;
        console.log('有替换changeIndex', changeIndex);
        vsList.splice(changeIndex, 1, id);
        
        wx.showToast({
          title: '替换成功',
          icon: 'none',
          duration: 1000
        });
      } else {
        console.log('没有替换changeIndex', changeIndex);
        if (vsList.indexOf(id) !== -1) {
          wx.showToast({
            title: '当前院校已经加入对比',
            icon: 'none',
            duration: 1000
          });
        } else if (vsList.length >= 4) {
          wx.showToast({
            title: '最多对比4所院校',
            icon: 'none',
            duration: 1000
          });
        } else {
          vsList.push(id);
          wx.setStorageSync('vsList', vsList);
          this.triggerEvent('callback', '');
          console.log(wx.getStorageSync('vsList'));
          wx.showToast({
            title: '加入成功',
            icon: 'none',
            duration: 500
          });
        }
      }
    }
  },
  created() {

  },
  attached() {
    
  },
  ready() {
    
  }
})
