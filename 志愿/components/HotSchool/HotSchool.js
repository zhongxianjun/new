import util from '../../utils/util';
Component({
  externalClasses: [],
  properties: {
    category: {
      type: String,
      value: ''
    }
  },
  data: {
    current: 0,
    selectName: ['一本院校', '二本院校', '专科院校'],
    schoolList: [[], [], []]
  },
  methods: {
    selectCurrent(e) {
      let current = e.currentTarget.dataset.index
      this.setData({
        current: current
      });
      this.selectType(current);
    },
    selectType(index) {
      let _this = this;
      let schoolList = _this.data.schoolList;
      util.GET({
        url: '/Interface/YXK/AcademyApi.ashx?',
        params: {
          action: 'GetAcademyOrder',
          schooltype: index + 1
        },
        success: function (res) {
          console.log(res);
          schoolList.splice(index, 1, res.SchoolList)
          _this.setData({
            schoolList: schoolList
          });
        }
      });
    },
    vsCountBack() {
      console.log('HotSchool的vsCountBack函数');
      this.triggerEvent('callback', '');
    }
  },
  created() {

  },
  attached() {
    this.selectType(this.data.current);
  },
  ready() {
    
  }
})
