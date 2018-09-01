import util from '../../utils/util';
Component({
  properties: {

  },
  data: {
    majorList: []
  },
  methods: {

  },
  attached() {
    let _this = this;
    util.GET({
      url: '/Interface/YXK/AcademyMajorApi.ashx?',
      params: {
        action: 'GetTopMajorList'
      },
      success: function (res) {
        console.log(res);
        if (res.S === '1') {
          _this.setData({
            majorList: res.MajorList
          });
        }
      }
    });
  },
  ready() {
    
  }
})
