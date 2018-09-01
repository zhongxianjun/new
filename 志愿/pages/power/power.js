// pages/power/power.js
const app = getApp().globalData;
import util from '../../utils/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    getCoupon: {
      type: Boolean,
      value: false
    },
    me_show: {
      type: String,
      observer: function (newVal, oldVal) { }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shows: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo: function (e) {
      //检查登录态是否过期
      let data = e.detail
      const that = this;
      const info = wx.getStorageSync('info');
      that.setData({ shows: false })
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效

          if (that.properties.me_show) {

            that.login(data);
          } else {
            if (info) {
              //更新数据
              wx.showTabBar({
                animation: true
              })
              that.triggerEvent('callback', info)
            } else {
              console.log(info, '未过期');
              that.login(data);
            }
          }


        },
        fail: function () {

          that.login(data);

        }
      })


      console.log('允许授权', data)


    },
    login: function (data) {

      const that = this;
      if (data.iv) {
        wx.setStorageSync('user', data.userInfo);
        wx.login({
          success: res => {

            console.log(app.code, res.code, '用户数据')

            let code = app.code ? app.code : res.code;

            //code换取openidN
            console.log(this.properties)
            if (that.properties.getCoupon) {
              let myEventDetail = { data, code }// detail对象，提供给事件监听函数
              console.log(myEventDetail)
              // 触发事件的选项
              that.triggerEvent('callback', myEventDetail)
            } else {
              util.GET({
                cache: true,
                url: '/Interface/UserApi.ashx?',
                params: {
                  action: 'WeiXinApiCodeLoginNew',
                  code: code,
                  encryptedData: data.encryptedData,
                  iv: data.iv,
                  xcxver: app.xcxver,
                  xid: app.xid
                },
                success: function (res) {
                  console.log(res, '获取用户的信息', res)

                  //登录成功
                  if (res.S == 1) {

                    app.code ? app.code = '' : '';
                    wx.showTabBar({
                      animation: true
                    })
                    that.setData({ shows: false })
                    // 获取用户信息
                    wx.setStorage({
                      key: 'info',
                      data: { ...res.UserList[0] },
                      success: function (json) {
                        console.log(json, '写入成功')
                      }
                    })
                    let myEventDetail = { ...res.UserList[0], data, code }// detail对象，提供给事件监听函数
                    // 触发事件的选项
                    that.triggerEvent('callback', myEventDetail)
                  } else if (res.S == -1) {
                    wx.showModal({
                      title: '自动授权失败',
                      content: res.msg,
                    })
                  } else {
                    wx.showModal({
                      title: '登录失败',
                      content: res.msg,
                    })
                  }
                }
              })
            }


          },
          fail: function (res) {
            console.log('调用失败', res)
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
            that.setData({ shows: true });
            wx.hideTabBar({ animation: true })

          }
        })
      } else {
        that.setData({ shows: true });
        wx.hideTabBar({ animation: true })

      }
    }
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function () {
    const info = wx.getStorageSync('info');
    const that = this;
    console.log('生命周期', info);
    this.setData({
      shows: that.properties.me_show ? true : false
    })
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('未过期')
        if (!info) {
          wx.hideTabBar({ animation: true })
          that.setData({
            shows: true
          });
        }
      },
      fail: function () {
        //session_key 过期
        console.log('已过期')
        that.setData({
          shows: true
        });
        wx.hideTabBar({ animation: true })
      }
    })

  },
  // 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
  moved: function () {
    console.log('组件生命周期函数，在组件实例被移动到节点树另一个位置时执行')
  },
  //组件生命周期函数，在组件实例被从页面节点树移除时执行
  detached: function () {
    console.log('组件生命周期函数，在组件实例被从页面节点树移除时执行')
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
  created: function () {
    console.log('组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用')
  },
  //组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
  ready: function () {
    console.log('组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用')
  }
})
