import util from '../../utils/util';
Component({
  behaviors: [],
  externalClasses: [],
  properties: {
    school: {
      type: Object,
      value: {}
    },
    changeIndex: {
      type: String,
      value: undefined
    }
  },
  data: {
    height: 0
  },
  methods: {
    checkDetails(e) {
      const _this = this;
      console.log(this.data.school);
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
    addVs() {
      const school = this.data.school;
      const id = school.ID;
      console.log(id);
      const _this = this;
      let vsList = wx.getStorageSync('vsList') ? wx.getStorageSync('vsList') : [];
      console.log(vsList);
      let changeIndex = this.data.changeIndex;
      if ((changeIndex !== 'undefined') && (changeIndex !== undefined) && (changeIndex !== '')) {
        let changeIndex = parseInt(this.data.changeIndex);
        console.log('有替换changeIndex', changeIndex);
        if (vsList.indexOf(id) !== -1) {
          wx.showToast({
            title: '当前院校已经加入对比',
            icon: 'none',
            duration: 1000
          });
        } else {
          vsList.splice(changeIndex, 1, id);
          wx.setStorageSync('vsList', vsList);
          wx.showToast({
            title: '替换成功',
            icon: 'none',
            duration: 1000
          });
        }
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
});
