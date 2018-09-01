Component({
  properties: {
    school: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: null
    }
  },
  data: {
    translateX: 0,
    laterX: 0,

    scroll: true
  },
  methods: {
    touchstart(e) {
      console.log('触摸开始：');
      const touches = e.touches[0];
      this.data.startX = touches.clientX;
      this.data.startY = touches.clientY;
      this.data.startTime = (new Date()).getTime();
      console.log(this.data.startX, this.data.startY);
    },
    touchmove(e) {
      console.log('触摸中：', e);
      const touches = e.touches[0];
      let laterX = touches.clientX - this.data.startX;
      let laterY = touches.clientY - this.data.startY;
      this.data.laterX = laterX;
      this.data.laterY = laterY;

      let translateX = this.data.translateX;

      if ((Math.abs(laterX) > Math.abs(laterY) && laterX > 0) || (Math.abs(laterX) > Math.abs(laterY) && laterX < 0)) {
        // 右滑 或 左滑
        this.setData({
          laterX: laterX / 3,
          transition: false,
          confirmDelete: false,
          scroll: false
        });

        this.triggerEvent('callback', {
          scrollY: true
        });
      }
      if ((Math.abs(laterY) > Math.abs(laterX) && laterY > 0) || (Math.abs(laterY) > Math.abs(laterX) && laterY < 0 )) {
        // 下滑 或 上滑
        this.setData({
          scroll: true
        });
        this.triggerEvent('callback', {
          scrollY: false
        });
      }
    },
    touchend(e) {
      console.log('触摸结束：');
      this.data.endTime = (new Date()).getTime();
      const time = this.data.endTime - this.data.startTime;
      console.log('滑动时间', time);
      let laterX = this.data.laterX;
      let translateX = this.data.translateX;
      console.log('laterX', laterX);
      if (this.data.scroll || (Math.abs(laterX) < 50) && (time > 150)) {
        this.setData({
          laterX: 0,
          translateX: translateX,
          transition: true,
          confirmDelete: false
        });
      } else {
        console.log('出现');
        if (Math.abs(laterX) <= 15) {
          this.setData({
            laterX: 0,
            translateX: translateX,
            transition: true,
            confirmDelete: false
          });
        } else if (laterX >= 0) {
          this.setData({
            laterX: 0,
            translateX: 0,
            transition: true,
            confirmDelete: false
          });
        } else if (laterX < 0) {
          this.setData({
            laterX: 0,
            translateX: -150,
            transition: true,
            confirmDelete: false
          });
        }
      }
      this.triggerEvent('callback', {
        scrollY: false
      });
    },
    change() {
      console.log('换一个');
      let changeIndex = this.data.index;
      console.log(changeIndex);
      this.setData({
        laterX: 0,
        translateX: 0,
        transition: true,
        confirmDelete: false
      });
      wx.navigateTo({
        url: `/pages/vs/selectarea/selectarea?changeIndex=${changeIndex}`
      });
    },
    delete() {
      console.log('删除');
      this.setData({
        confirmDelete: true
      });
    },
    confirmDelete() {
      console.log('确认删除');
      let index = this.data.index;
      console.log(index);
      let vsList = wx.getStorageSync('vsList') ? wx.getStorageSync('vsList') : [];
      console.log(vsList);
      vsList.splice(index , 1);
      wx.setStorageSync('vsList', vsList);
      this.triggerEvent('callback', '');
    }
  },
  created() {

  },
  attached() {
    
  },
  ready() {
    
  }
})
