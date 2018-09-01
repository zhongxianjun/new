Component({
  properties: {
     bottom: {
       type: String,
       value: ''
     }
  },
  data: {
    vsList: []
  },
  methods: {
    check() {
      console.log('check check check check check');
      let _this = this;
      let vsList = wx.getStorageSync('vsList') ? wx.getStorageSync('vsList') : [];
      console.log(vsList);
      this.setData({
        vsList: vsList
      });
    },
    isShow(boolean) {
      this.setData({
        hideVs: boolean
      });
    }
  },
  attached() {
    this.check();
  },
  ready() {
    
  }
});

