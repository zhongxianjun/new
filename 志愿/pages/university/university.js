import util from '../../utils/util';
import * as echarts from '../../components/ec-canvas/echarts';
const app = getApp();
function setOption(chart, options) {
  const option = options;
  chart.setOption(option);
}
Page({
  /**
   * 页面的初始数据
   */
  data: {    
    schoolID:31, 
   
    ec: {
      lazyLoad: true
    },
    nofen:true,
  },

  
  filter:function(event){
    let filtrateList = this.data.filtrateList
    filtrateList.map(function(v,i){
      v.act = false;
    })
    let index = event.currentTarget.dataset['index']
    filtrateList[index].act = true;
    this.setData({filtrateList:filtrateList})

  },
  yearNav:function(event){
    let index = event.currentTarget.dataset.index;
    let val = event.currentTarget.dataset.val;
    let wenke = this.data.wenke
    let like = this.data.like
    let width = 150 * index + 'rpx'
    let wenkeArr = []
    let likeArr = []
    
    if (!wenke || !like){
      wx.showToast({
        title: '请点击按钮查询',
        icon: 'none',
        duration: 1000
      });
      this.setData({
        nofen:true
      })
      return;
    }else{
      this.setData({
        nofen: false
      })
    }
    like.map(function (v) {
      if(v.year==val){
        likeArr.push(v)
      }
     })
    wenke.map(function (v) { 
      if (v.year == val) {
        wenkeArr.push(v)
      }
    })
    if (likeArr.length == 0 && wenkeArr.length==0){
      this.setData({
        nofen: true
      })
    }else{
      this.setData({
        nofen: false
      })
    }
    this.setData({
      yearWidth: width,
      likeArr: likeArr,
      wenkeArr: wenkeArr
    })
    console.log(likeArr)
    console.log(wenkeArr)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.options = options;
    
    
    let schoolID = options.id || this.data.schoolID || wx.getStorageSync("schoolID") || "";
    this.setData({
      schoolID: schoolID
    })
    let that = this;
    util.GET({
      url: '/Interface/YXK/AcademyApi.ashx?',
      params: {
        action: 'GetAcademyByID',
        Id: schoolID
      },
      success: function (res) {
        if (res.S == 1) {
          console.log(res.SchoolList,"学院详情")
          that.setData({
            SchoolList: res.SchoolList[0]
          })
          wx.setNavigationBarTitle({
            title: that.data.SchoolList.oldname//页面标题为路由参数
          })
        }
      }
    });
    this.getIntroduceXQ(options)
    this.getIntroduceBKZN(options);
    this.getIntroduceZSXX(options);
    this.setYearList();
    this.ecComponent = this.selectComponent('#ec-canvas-dom');
  },
  setYearList() {
    let _this = this;
    let yearList = [];
    let currentYear = (new Date).getFullYear();
    for (let i = 0; i < 5; i++) {
      yearList.push({
        id: (currentYear - i - 1).toString(),
        value: (currentYear - i - 1).toString()
      });
    }
    this.setData({
      currentYear: yearList[0].id,
      yearList: yearList
    });
  },
  setWenli(e) {
    console.log('高校分数线文理：', e.detail);
    this.data.wenliId = e.detail.id;
    this.setData({
      wenliIndex: e.detail.index
    });
  
  },
  setYear(e) {
    console.log('高校分数线年份：', e.detail);
    this.data.yearId = e.detail.id;
    this.setData({
      yearIndex: e.detail.index
    });
  
  },
  setArea(e) {
    console.log('高校分数线地区：', e.detail);
    this.data.areaId = e.detail.id;
    this.setData({
      areaIndex: e.detail.index
    });
   
  },
  setPici(e) {
    console.log("地区id", e.detail);
    this.data.piciId = e.detail.id;
    this.setData({
      piciIndex: e.detail.index
    });
    
  },
  checkMajor() {
    let _this = this;
    util.GET({
      url: "/Interface/YXK/AcademyMajorApi.ashx?",
      params: {
        action: "GetSchoolMajorLine",
        province: _this.data.areaId,
        Year: _this.data.yearId,
        wl: _this.data.wenliId,
        page: 1,
        SchoolID: _this.data.schoolID
      },
      success: function (res) {
        console.log(res, '查询结果')
        if(res.S==1){
          _this.setData({
            schoolMajorList: res.sList,
            hasData: false
          })
        }else{
          _this.setData({
            hasData: true
          })
        }
      }
    });
  },
  chartOptions() {
    let _this = this;
    let barTitle = this.data.barTitle;
    
    let currentPici = this.data.currentPici;
    let yearList = this.data.yearList.map((item, index) => {
      return item.value.toString();
    });

    let list = this.data.historyList;
    console.log(list);
    
    let likeLine = new Array(yearList.length);
    let wenkeLine = new Array(yearList.length);
    let title = this.data.SchoolList.oldname
    
    list.map((item, index) => {
      _this.data.yearList.map((itemY, indexY) => {
          if (item.year === itemY.value) {
            const index = yearList.indexOf(item.year);
            if (item.studenttype === '理科') {
              likeLine.splice(index, 1, item.provincescore);
            }
            if (item.studenttype === '文科') {
              wenkeLine.splice(index, 1, item.provincescore);
            }
          }
        });
    });
    console.log(likeLine, wenkeLine);
    console.log(likeLine);
    return {
      title: {
        text: `【${title}】历年分数线走势`,
        left: 'center',
        top: 0,
        textStyle: {
          color: '#419aff',
          fontSize: 16,
          lineHeight: 16
        },
      },
      color: ["#5688c1", "#ca7aa3"],
      legend: {
        data: ['理科', '文科'],
        top: 28,
        left: 'center',
        backgroundColor: 'transparent',
        z: 100
      },
      grid: {
        containLabel: true
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: yearList
      },
      yAxis: {
        x: 'center',
        type: 'value',
        // max: 750,
        // min: 150,
        scale: true
      },
      series: [
        {
          name: '理科',
          type: 'line',
          smooth: true,
          data: likeLine,
          areaStyle: {
            color: '#5688c1',
            opacity: 0.5
          }
        },
        {
          name: '文科',
          type: 'line',
          smooth: true,
          data: wenkeLine,
          areaStyle: {
            color: '#ca7aa3',
            opacity: 0.5
          }
        }
      ]
    }
  },
  initChart(options) {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, options);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  dispose() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  query() {
    let that = this;
    util.GET({
      url: "/Interface/YXK/FractionalLineApi.ashx?",
      params: {
        action: "GetFractionalLine",
        page: 1,
        provinceid: this.data.piciId,
        schoolid: this.data.schoolID,
      },
      success: function (res) {
        if(res.S==1){
          console.log(res)
          that.setData({
            historyList:res.LineList,
            hasFen:false
          })
          that.initChart(that.chartOptions());
          let list = res.LineList;
          console.log(list,'111111111111111111111')
          let yearList = that.data.yearList.map((item, index) => {
            return item.value.toString();
          });
          let like = new Array(yearList.length);
          let wenke = new Array(yearList.length);
          list.map(function(v){
            if (v.studenttype == "文科" && v.year >= yearList[4]){
              wenke.push(v)
            } else if (v.studenttype == "理科" && v.year >= yearList[4]){
              like.push(v)
            }
          })
          that.setData({
            wenke: wenke,
            like:like
          })
          
        }else{
          that.setData({
            hasFen: true
          })
        } 
       
      }
    });
    
  },
  getIntroduceXQ: function (options){
    let schoolID = options.id || this.data.schoolID || wx.getStorageSync("schoolID") || "";
    let that = this;
    util.GET({
      url: '/Interface/YXK/IntroduceApi.ashx?',
      params: {
        action: 'GetIntroduceList',
        SchoolID: schoolID,
        CategoryID:1
      },
      success: function (res) {
        console.log(res,'zzz')
        if (res.S == 1) {
          let filtrateList = res.IntroduceList
          console.log(filtrateList,'111111111111111111111111')
          filtrateList.map(function(v){
            v.Introduce = v.Introduce.replace(/<img([\s\S]*?)\/>/gi, (match) => {
              console.log(match);
              let reg = /style="([\s\S]*?)"/gi;
              if (reg.test(match)) {
                console.log('有style')
                return match.replace(reg, (res) => {
                  console.log(res);
                  return `style="max-width: 100%; height: aoto;"`;
                });
              } else {
                console.log('没有style');
                return match.replace(/<img([\s\S]*?)/, (res) => {
                  console.log(res);
                  return `<img style="max-width: 100%; height: aoto;"`;
                });
              }
            }).replace(/http:([\s\S]*?).gif/g,"");
          })
          filtrateList[0].act = true;
          that.setData({
            filtrateList: filtrateList
          })
        }
      }
    });
  },
  getIntroduceBKZN: function (options) {
    let schoolID = options.id || this.data.schoolID || wx.getStorageSync("schoolID") || "";
    let that = this;
    util.GET({
      url: '/Interface/YXK/IntroduceApi.ashx?',
      params: {
        action: 'GetIntroduceList',
        SchoolID: schoolID,
        CategoryID: 3
      },
      success: function (res) {
        console.log(res, '报考指南')
        if (res.S == 1) {
          let list = res.IntroduceList
          list.map(function (v) {
            v.Introduce = v.Introduce.replace(/<img([\s\S]*?)\/>/gi, (match) => {
              console.log(match);
              let reg = /style="([\s\S]*?)"/gi;
              if (reg.test(match)) {
                console.log('有style')
                return match.replace(reg, (res) => {
                  console.log(res);
                  return `style="max-width: 100%; height: aoto;"`;
                });
              } else {
                console.log('没有style');
                return match.replace(/<img([\s\S]*?)/, (res) => {
                  console.log(res);
                  return `<img style="max-width: 100%; height: aoto;"`;
                });
              }
            }).replace(/http:([\s\S]*?).gif/g, "");
          })
          that.setData({
            BkznList: list
          })
        }
      }
    });
  },
  getIntroduceZSXX: function (options) {
    let schoolID = options.id || this.data.schoolID || wx.getStorageSync("schoolID") || "";
    let that = this;
    util.GET({
      url: '/Interface/YXK/IntroduceApi.ashx?',
      params: {
        action: 'GetIntroduceList',
        SchoolID: schoolID,
        CategoryID: 2
      },
      success: function (res) {
        console.log(res, '招生信息')
        if (res.S == 1) {
          let list = res.IntroduceList
          list.map(function (v) {
            v.Introduce = v.Introduce.replace(/<img([\s\S]*?)\/>/gi, (match) => {
              console.log(match);
              let reg = /style="([\s\S]*?)"/gi;
              if (reg.test(match)) {
                console.log('有style')
                return match.replace(reg, (res) => {
                  console.log(res);
                  return `style="max-width: 100%; height: aoto;"`;
                });
              } else {
                console.log('没有style');
                return match.replace(/<img([\s\S]*?)/, (res) => {
                  console.log(res);
                  return `<img style="max-width: 100%; height: aoto;"`;
                });
              }
            }).replace(/http:([\s\S]*?).gif/g, "");;
          })
          that.setData({
            ZsxxList: list
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let showhome = this.data.options.showhome;
    if (showhome) {
      this.setData({
        showhome: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
  onShareAppMessage: function () {
    const schoolId = this.data.schoolID;
    return {
      title: '志愿填报系统',
      path: `/pages/university/university?id=${schoolId}&showhome=${true}`
    }
  }
})