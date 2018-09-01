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
  },
  created() {

  },
  attached() {

  },
  ready() {

  }
})
