// pages/winning-list/winning-list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winning_list: [
      //winning_list数据列表
      {
        awiat_list: [
          {
            src: "",
            name: "bibi11",
            prize: "夏普50寸电视机"
          },
          {
            src: "",
            name: "天王盖地虎",
            prize: "500大润发购物卡"
          },
          {
            src: "",
            name: "仙女",
            prize: "苹果电脑一体机"
          }
        ]
      },
      {
        awiat_list: [
          {
            src: "",
            name: "bibi22",
            prize: "夏普50寸电视机"
          },
          {
            src: "",
            name: "天王盖地虎",
            prize: "500大润发购物卡"
          },
          {
            src: "",
            name: "仙女",
            prize: "苹果电脑一体机"
          }
        ]
      }
    ],
    index: 0,
    navData: [
      {
        text: "待领奖"
      },
      {
        text: "已领奖"
      }
    ]
  },

  // 滑片滑动触发事件
  onSlideChangeEnd: function(e) {
    this.setData({ index: e.detail.current });
  },
  setSlideIndex: function(e) {
    this.setData({ index: e.currentTarget.dataset.index });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
