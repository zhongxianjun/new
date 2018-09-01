// pages/lucky-draw/lucky-draw.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    redEnvelopeList: [
      { text: "一" },
      { text: "二" },
      { text: "三" },
      { text: "一" },
      { text: "二" },
      { text: "三" }
    ],
    show: true,
    permit: true,
    flashing: true,
    winInfo: [
      {
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "iPad大奖"
      },
      {
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "500元大红包"
      },
      {
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "iPad大奖"
      },
      {
        date: "08-25",
        time: "14:28",
        phone: "135****6521",
        prize: "500元大红包"
      }
    ]
  },
  lamp() {
    let _this = this;

    setInterval(() => {
      _this.setData({ flashing: false });

      let timmer = setTimeout(() => {
        _this.setData({ flashing: true });
        clearTimeout(timmer);
      }, 250);
    }, 500);
  },
  pressBtn() {
    if (this.data.permit) {
      let _this = this;
      this.setData({ show: false });
      let timmer = setTimeout(() => {
        _this.setData({ show: true });
        clearTimeout(timmer);
      }, 200);
    }
  },
  onShareAppMessage: function(res) {
    return { title: "分享抽大奖", path: "/pages/index/index" };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.lamp();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
