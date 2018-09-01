// pages/merchant-index/merchant-index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userData: [
      {
        text: "推广人数",
        data: 743
      },
      {
        text: "消费人数",
        data: 8862
      },
      {
        text: "中奖人数",
        data: 365
      }
    ],
    moduleCss: [
      {
        text: "优惠验证",
        EnglishText: "Verification",
        background: "#e1ddd9",
        textColor: "#666",
        EnglishColor: "#c1bebb"
      },
      {
        text: "中奖登记",
        EnglishText: "Registration",
        background: "#ffde7c",
        textColor: "#f67b00",
        EnglishColor: "#fbb14d"
      },
      {
        text: "设置奖品",
        EnglishText: "Prize",
        background: "#373a4b",
        textColor: "#ffffff",
        EnglishColor: "#545663"
      },
      {
        text: "设置优惠",
        EnglishText: "Preferential",
        background: "#3c99ff",
        textColor: "#ffffff",
        EnglishColor: "#89bbff"
      }
    ]
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
