import util from '../../utils/util';
Component({
  externalClasses: [],
  properties: {
    name: {
      type: String,
      value: ''
    },
    pickerIndex: {
      type: Number,
      value: 0
    },
    width: {
      type: Number,
      value: 194
    },
    bigClassId: {
      type: String,
      value: null
    },
    list: {
      type: String,
      value: ''
    }
  },
  data: {
    resultList: []
  },
  methods: {
    pickerChange(e) {
      let index = e.detail.value;
      console.log('picker发送选择改变', index);
      this.setData({
        pickerIndex: index
      });
      let id = this.data.resultList[index]['id'];
      let value = this.data.resultList[index]['value'];
      console.log('id:', id, '值：', value);
      this.triggerEvent('callback', {
        id: id,
        index: index,
        value: value
      });
    },
    trigger() {
      let _this = this;
      let id = this.data.resultList[0]['id'];
      let value = this.data.resultList[0]['value'];
      this.triggerEvent('callback', {
        id: id,
        value: value,
        index: 0
      });
    },


    setWenliList() {
      let wenliList = [{id: '', value: '不限'}, {id: 2, value: '理科'}, {id: 1, value: '文科'}];
      this.setData({
        resultList: wenliList
      });
      this.trigger();
    },
    setYearList() {
      const currentDate = new Date;
      let currentYear = currentDate.getFullYear();
      console.log('当前年份：', currentYear);
      let yearList = [];
      for (let i = 0; i < 15; i++) {
        yearList.push({
          id: currentYear - i - 1,
          value: currentYear - i - 1
        });
        if (i === 14) {
          this.setData({
            resultList: yearList
          });
          this.trigger();
        }
      }
    },
    setAreaList() {
      let _this = this;
      util.GET({
        url: '/Interface/YXK/PublicApi.ashx?',
        params: {
          action: 'GetProvinceList',
        },
        success: function (res) {
          console.log(res);
          if (res.S === '1') {
            let list = res.pList.map((item, index) => {
              return {
                id: item.ID,
                value: item.ProvinceName
              }
            });
            console.log(list);
            _this.setData({
              resultList: list
            });
            _this.trigger();
          }
        }
      });
    },
    setPiciList() {
      let _this = this;
      util.GET({
        url: '/Interface/YXK/PublicApi.ashx?',
        params: {
          action: 'GetBatchList',
        },
        success: function (res) {
          console.log(res);
          if (res.S === '1') {
            let list = res.pList.map((item, index) => {
              return {
                id: item.ID,
                value: item.Name
              }
            });
            console.log(list);
            _this.setData({
              resultList: list
            });
            _this.trigger();
          }
        }
      });
    },
    setBigClassList() {
      let _this = this;
      util.GET({
        url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
        params: {
          action: 'GetProfessionalMax',
        },
        success: function (res) {
          console.log(res);
          if (res.S === '1') {
            let list = res.pList.map((item, index) => {
              return {
                id: item.ID,
                value: item.Name
              }
            });
            console.log(list);
            _this.setData({
              resultList: list
            });
            _this.trigger();
          }
        }
      });
    },
    setSmallClassList(id) {
      console.log(id);
      let _this = this;
      util.GET({
        url: '/Interface/YXK/SchoolSpecialtyApi.ashx?',
        params: {
          action: 'GetProfessionalSmall',
          zytypeid: id
        },
        success: function (res) {
          console.log(res);
          if (res.S === '1') {
            let list = res.pList.map((item, index) => {
              return {
                id: item.ID,
                value: item.specialname
              }
            });
            console.log(list);
            _this.setData({
              pickerIndex: 0,
              resultList: list
            });
            _this.trigger();
          }
        }
      });
    },


    
  },
  created() {
    
  },
  attached() {
    if (this.data.list === 'wenliList') {
      this.setWenliList();
    }
    if (this.data.list === 'yearList') {
      this.setYearList();
    }
    if (this.data.list === 'areaList') {
      this.setAreaList();
    }
    if (this.data.list === 'piciList') {
      this.setPiciList();
    }
    if (this.data.list === 'bigClassList') {
      this.setBigClassList();
    }
    if (this.data.list === 'smallClassList') {
      // this.setSmallClassList(this.data.bigClassId);
    }
  },
  ready() {
    
  }
})
