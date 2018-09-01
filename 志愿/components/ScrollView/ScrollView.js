import util from '../../utils/util';
Component({
  properties: {
    scrollX: {
      type: Boolean,
      value: false
    },
    scrollY: {
      type: Boolean,
      value: true
    },
    width: {
      type: String,
      value: ''
    },
    height: {
      type: String,
      value: '100%'
    },
    lowerThreshold: {
      type: Number,
      value: 50
    },
    currentPage: {
      type: Number,
      value: 1
    },
    pageCount: {
      type: Number,
      value: 1
    },
    params: {
      type: Object,
      value: {
        urlRoot: {
          type: String,
          value: ''
        },
        action: {
          type: String,
          value: ''
        },
        search: {
          type: Object,
          value: {}
        }
      }
    }
  },
  data: {

  },
  methods: {
    scrollToLower() {
      console.log('触底');
      let _this = this;
      
      this.data.currentPage++;

      let currentPage = this.data.currentPage;
      let pageCount = this.data.pageCount;
      console.log(currentPage, pageCount);
      if (currentPage <= pageCount) {
        console.log('继续加载一次');
        let search = this.data.params.search;
        this.data.params.search = Object.assign(search, {
          page: currentPage
        });
        this.loadData();
      } else {
        console.log('没有更多了');
        if (!this.data.check) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1000
          });
          this.data.check = true;
        }
      }
    },
    loadFirst() {
      this.data.check = false;
      let params = this.data.params;
      this.data.currentPage = parseInt(params.search.page);
      this.loadData();
    },
    loadData() {
      let _this = this;
      let params = _this.data.params;
      if (params) {
        console.log('有params', params);
        let url = `${params.urlRoot}action=${params.action}`;

        Object.keys(params.search).forEach((item, index) => {
          url += `&${item}=${params.search[item]}`;
        });
        console.log(url);
        
        util.GET({
          url: url,
          success: function (res) {
            console.log(res);
            if (res.S == '1') {
              _this.data.currentPage = parseInt(res.CurrentPage);
              _this.data.pageCount = parseInt(res.PageCount);
              console.log(_this.data.currentPage, _this.data.pageCount);
              _this.triggerEvent('callback', res);
            } else {
              _this.triggerEvent('callback', '');
            }
          }
        });
      } else {
        console.log('没有params');
      }
    },
    pageScroll() {
      this.triggerEvent('scroll', '');
    }
  },
  attached() {
    this.loadData();
  },
  ready() {
    
  }
})
