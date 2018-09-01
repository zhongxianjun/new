//index.js
//获取应用实例
const app = getApp();
import { POST } from "./../../utils/api.js";

Page({
  data: {
    classfyList: [
      "日用百货",
      "家用电器",
      "儿童玩具",
      "生鲜食品",
      "休闲食品",
      "家用纺织",
      "五金家电",
      "体育用品"
    ],
    shareShow: false,
    posterShow: false
  },
  //事件处理函数
  openShare: function() {
    this.setData({ shareShow: true });
  },
  closeShare: function() {
    this.setData({ shareShow: false });
  },
  openPoster: function() {
    this.setData({ posterShow: true });
    this.closeShare();
  },
  closePoster: function() {
    this.setData({ posterShow: false });
  },
  onShareAppMessage: function(res) {
    this.closeShare();
    return {
      title: "分享抽大奖",
      path: "/pages/index/index"
    };
  },
  onLoad: function() {
    HTTP.POST();
  }
});
