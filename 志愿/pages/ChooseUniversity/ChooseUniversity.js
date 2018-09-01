import util from '../../utils/util.js';
let listArr = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClick:false,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  setPici(e) {
    console.log("高校分数线批次：", e.detail);
    this.data.piciId = e.detail.id;
    this.setData({
      piciIndex: e.detail.index,
      page:1,
      PageCount:1
    });
    listArr = []
  },
  setArea(e) {
    console.log("高校分数线地区：", e.detail);
    this.data.areaId = e.detail.id;
    this.setData({
      areaIndex: e.detail.index,
      page: 1,
      PageCount: 1
    });
    listArr = []
  },
  query(event){
    let that = this;
    wx.showLoading()
    console.log(event,'11111111111111111')
    if(event){
      if (event.type = "tap") {
        listArr = []
      }
    }
    console.log(listArr)
    
    util.GET({
      url: "/Interface/YXK/AcademyApi.ashx?",
      params: {
        action: "GetAcademyList",
        page: this.data.page,
        province: this.data.areaId,
        pcid: this.data.piciId
      },
      success:function(res){
        console.log(res,'查询结果')
        if(res.S==1){
          listArr.push(...res.SchoolList)
          console.log(listArr)
          that.setData({
            schoolList: listArr,
            PageCount: res.PageCount
          })
        }else{
          that.setData({
            isClick: true,
            schoolList: [],
          })
        }
        wx.hideLoading()
        console.log(that.data.schoolList)
      }
      
    });
    console.log(`高校分数线批次：${this.data.piciId},高校分数线地区：${this.data.areaId}`);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.vsCountBack();
  },
  vsCountBack() {
    console.log('index的vsCountBack函数', wx.getStorageSync('vsList'),'---');
    this.selectComponent("#school-vs").check();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    listArr = [];
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let page = this.data.page;
    if (page >= this.data.PageCount){
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if (this.data.schoolList){
      this.setData({ page: ++page });
      this.query();
    }
    
  },
  onPageScroll(e) {
    clearTimeout(this.data.timeOut);
    this.selectComponent("#school-vs").isShow(true);
    this.selectComponent("#share").isShow(true);
    this.data.timeOut = setTimeout(() => {
      this.selectComponent("#school-vs").isShow(false);
      this.selectComponent("#share").isShow(false);
    }, 1000);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '志愿填报系统',
      path: '/pages/index/index'
    }
  }
});