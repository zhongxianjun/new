// components/UniversityNav/UniversityNav.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    navList:{
      type:Array,
      value:[
        {
          name:'院校详情',
          navUrl:'pages/university/university'
        },
        {
          name: '各省录取线',
          navUrl: 'pages/university/university'
        },
        {
          name: '专业录取线',
          navUrl: 'pages/university/university'
        },
        {
          name: '招生信息',
          navUrl: 'pages/university/university'
        },
        {
          name: '报考指南',
          navUrl: 'pages/university/university'
        }
        ,
      ]
    },
    navIndex:{
      type:String,
      value:'0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _act:function(event){
      console.log(event)
      let index = event.currentTarget.dataset['index']
      let offsetLeft = event.currentTarget.offsetLeft
      let windowWidth = wx.getSystemInfoSync().windowWidth 
      let x = event.detail.x;
      console.log(x,'4564')
      let navList = this.data.navList;
      navList.map(function(v){
          v.act = false;
      })
      navList[index].act = true;
      console.log(offsetLeft)
      console.log(windowWidth)
      if (offsetLeft > windowWidth/2){
        this.setData({
          offsetLeft: offsetLeft - windowWidth / 4
        })
      }else if (x < windowWidth / 2){
        console.log(x, windowWidth / 2)
        this.setData({
          offsetLeft: offsetLeft - windowWidth / 4
        })
      }
      
      
      this.setData({
        navIndex: index,
        navList: navList
      })
    },
  },
  attached() {
   let navindex = this.data.navIndex;
   let navList = this.data.navList;
     navList[navindex].act = true;
     console.log(navList[navindex].act)
     this.setData({
       navList: navList
     })
     console.log(this.data.navList)
  }
 
})
