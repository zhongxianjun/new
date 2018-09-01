Component({
  properties: {
    bottom: {
      type: String,
      value: ''
    }
  },
  data: {

  },
  methods: {
    start(e) {
      console.log('触摸开始', e);
      this.data.offsetLeft = e.currentTarget.offsetLeft;
      this.data.offsetTop = e.currentTarget.offsetTop;
      this.data.left =  e.currentTarget.offsetLeft;
      this.data.top = e.currentTarget.offsetTop;
      if (!this.data.checkLeft) {
        this.data.constLeft = e.currentTarget.offsetLeft;
        this.data.checkLeft = true;
      }
      console.log(this.data.offsetLeft, this.data.offsetTop);
  
      this.data.startX = e.changedTouches[0].clientX;
      this.data.startY = e.changedTouches[0].clientY;
      console.log(this.data.startX, this.data.startY);
  
      this.setData({ 
        alpha: 0.6,
        transition: false
      });
    },
    move(e) {
      console.log('触摸中', e);
      let laterX = e.changedTouches[0].clientX - this.data.startX;
      let laterY = e.changedTouches[0].clientY - this.data.startY;
  
      let offsetLeft = this.data.offsetLeft;
      let offsetTop = this.data.offsetTop;
      console.log(laterX, laterY);
      this.setData({
        left: offsetLeft + laterX,
        top: offsetTop + laterY
      });
    },
    end(e) {
      console.log('触摸结束', e);
      let windowWidth = wx.getSystemInfoSync().windowWidth;
      let windowHeight = wx.getSystemInfoSync().windowHeight;
      let left = this.data.left;
      let top = this.data.top;
      let constLeft = this.data.constLeft;
      let offsetWidth = this.data.offsetWidth;
      let offsetHeight = this.data.offsetHeight;
      if ((left + offsetWidth / 2) <= (windowWidth / 2)) {
        left = constLeft;
      } else {
        left = windowWidth - offsetWidth - constLeft;
      }
      if (top < 0) {
        top = 0;
      }
      if (top > (windowHeight - offsetHeight)) {
        top = windowHeight - offsetHeight;
      }
      console.log(left, top, constLeft, offsetWidth, windowWidth);
      this.setData({
        left: left,
        top: top,
        alpha: 1,
        transition: true
      });
    },
    isShow(boolean) {
      this.setData({
        hideVs: boolean
      });
    }
  },
  ready() {
    // wx.createSelectorQuery().in(this).select(`#share`).boundingClientRect((res) => {
    //   console.log(res);
    //   this.data.offsetWidth = res.width;
    //   this.data.offsetHeight = res.height;
    // }).exec();
  }
})
