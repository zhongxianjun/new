//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    envelopeList: [
      { full: 100, reduce: 50 },
      { full: 300, reduce: "" },
      { full: 100, reduce: 50 }
    ],
    show: false,
    current: 0
  },
  //事件处理函数
  //打开弹出层
  open(e) {
    let index = e.target.dataset.index;
    this.setData({ current: index });
    let cur = this.data.current;

    if (index == cur) {
      this.setData({ show: true });
    }
  },
  //关闭弹出层
  close() {
    this.setData({ show: false });
  },
  //删除优惠
  delete() {
    let cur = this.data.current;
    let tempList = this.data.envelopeList;
    tempList.splice(cur, 1);
    this.setData({ envelopeList: tempList });

    this.close();
  },
  //新增优惠
  add() {
    let tempList = this.data.envelopeList;
    tempList.push({ full: "", reduce: "" });
    this.setData({ envelopeList: tempList });
  },
  //输入框双向绑定
  doubleBind(e) {
    let _this = this;
    let index = e.target.dataset.index;
    let title = e.target.dataset.title;
    let value = e.detail.value;

    let envelopeList = this.data.envelopeList;
    envelopeList.map((item, i) => {
      if (i === index) {
        switch (title) {
          case "full":
            item.full = value;
            _this.setData({ envelopeList: envelopeList });
            break;
          case "reduce":
            item.reduce = value;
            _this.setData({ envelopeList: envelopeList });
            break;
        }
      }
    });
  },
  onReady: function() {},
  onLoad: function() {}
});
