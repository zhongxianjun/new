// pages/set-prize/set-prize.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    prizeList: [
      {
        level: "一等奖",
        prizeName: "夏普50寸电视机",
        price: "1000元"
      },
      {
        level: "二等奖",
        prizeName: "",
        price: ""
      }
    ],
    current: 0
  },
  //输入框双向绑定
  doubleBind(e) {
    let _this = this;
    let index = e.target.dataset.index;
    let title = e.target.dataset.title;
    let value = e.detail.value;

    let prizeList = this.data.prizeList;
    prizeList.map((item, i) => {
      if (i === index) {
        switch (title) {
          case "level":
            item.level = value;
            _this.setData({ prizeList: prizeList });
            break;
          case "prizeName":
            item.prizeName = value;
            _this.setData({ prizeList: prizeList });
            break;
          case "price":
            item.price = value;
            _this.setData({ prizeList: prizeList });
            break;
        }
      }
    });
  },
  //删除奖品
  delete(e) {
    let index = e.target.dataset.index;
    this.setData({ current: index });

    let cur = this.data.current;
    let tempList = this.data.prizeList;

    if(tempList.length > 1){
      tempList.splice(cur, 1);
      this.setData({ prizeList: tempList });
    }
  },
  //新增奖品
  add() {
    let tempList = this.data.prizeList;
    tempList.push({ level: "", prizeName: "", price: "" });
    this.setData({ prizeList: tempList });
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
