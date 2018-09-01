import util from '../../../utils/util';
import * as echarts from '../../../components/ec-canvas/echarts';
const app = getApp();
function setOption(chart, options) {
  const option = options;
  chart.setOption(option);
}
Page({
  data: {
    currentYear: '',
    yearList: [],
    resultList: [],
    list: [],

    currentPici: '',
    piciList: [{id: '0', value: '本科一批'}, {id: '1', value: '本科二批'}, {id: '2', value: '本科三批'}, {id: '3', value: '专科一批'}, {id: '4', value: '专科二批'}],
    
    ec: {
      lazyLoad: true 
    }
  },
  onLoad: function (options) {
    
    this.data.options = options;

    
    this.ecComponent = this.selectComponent('#ec-canvas-dom');
  },
  setYearList() {
    let _this = this;
    let yearList = [];
    let currentYear = (new Date).getFullYear();
    let currentMonth = (new Date).getMonth();
    console.log(currentYear, currentMonth);
    if (currentMonth >= 5) {
      for (let i = 0; i < 10; i++) {
        yearList.push({
          id: (currentYear - i).toString(),
          value: (currentYear - i).toString()
        });
      }
    } else {
      for (let i = 0; i < 10; i++) {
        yearList.push({
          id: (currentYear - i - 1).toString(),
          value: (currentYear - i - 1).toString()
        });
      }
    }
    
    this.setData({
      currentYear: yearList[0].id,
      yearList: yearList
    });
    util.GET({
      url: '/Interface/YXK/GradeLineApi.ashx?',
      params: {
        action: 'GetGradeLineYear',
        provinceid: _this.data.id
      },
      success: function (res) {
        console.log(res);
        if (res.S === '1') {
          _this.setData({
            list: res.GradeLineList
          });
          _this.checkLine();
          _this.checkPici();
        }
      }
    }); 
  },
  checkLine(e) {
    // wx.showLoading();    
    let _this = this;
    let year = this.data.yearList[0].id;
    if (e) {
      year = e.currentTarget.dataset.id;
    }
    console.log(year);
    _this.setData({
      currentYear: year
    });
    let resultList = [];
    let list = this.data.list;
    list.forEach((item, index) => {
      if (item.year == year) {
        resultList.push(item);
      }
    });
    console.log(resultList);
    
    _this.setData({
      resultList: resultList
    });
    
    // wx.hideLoading();
  },
  checkPici(e) {
    // wx.showLoading();    
    let _this = this;
    let pici = this.data.piciList[0].id;
    if (e) {
      pici = e.currentTarget.dataset.id;
    }
    console.log(pici);
    _this.setData({
      currentPici: pici
    });
    
    this.initChart(this.chartOptions());
    
    // wx.hideLoading();
  },
  onReady: function () {
    
  },
  chartOptions() {
    let _this = this;
    let barTitle = this.data.barTitle;
    let piciList = this.data.piciList;
    let currentPici = this.data.currentPici;
    let yearList = this.data.yearList.map((item, index) => {
      return item.value.toString();
    });

    let list = this.data.list;
    console.log(list);
    let piciName = piciList[currentPici].value;
    let likeLine = new Array(yearList.length);
    let wenkeLine = new Array(yearList.length);
    console.log(likeLine, wenkeLine);

    console.log('遍历成绩');
    list.forEach((item, index) => {
      if (item.bath === piciName) {
        _this.data.yearList.forEach((itemY, indexY) => {
          if (item.year === itemY.value) {
            console.log(item.year, item.bath);
            const index = yearList.indexOf(item.year);
            if (item.type === '理科') {
              console.log('理科', item.score);
              likeLine.splice(index, 1, item.score);
            }
            if (item.type === '文科') {
              console.log('文科', item.score); 
              wenkeLine.splice(index, 1, item.score);
            }
          }
        });
      }
    });
    console.log(likeLine, wenkeLine);
    console.log(likeLine);
    return {
      title: {
        text: `【${barTitle}】【${piciName}】分数线走势`,
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
  // 点击按钮后初始化图表
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
  onShow: function () {
    const options = this.data.options;
    this.data.id = options.areaId;
    this.data.barTitle = options.name;

    let showhome = options.showhome;
    if (showhome) {
      this.setData({
        showhome: true
      });
    }

    wx.setNavigationBarTitle({
      title: options.name
    });
    this.setYearList();
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
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
  onShareAppMessage: function () {
    const id = this.data.id;
    const name =  this.data.barTitle;
    return {
      title: '志愿填报系统',
      path: `/pages/fenshuxian/diquline/diquline?areaId=${id}&name=${name}&showhome=${true}`
    }
  }
});