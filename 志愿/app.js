//app.js
//====================================================
//                       _oo0oo_                     //
//                      o8888888o                    //
//                      88" . "88                    //
//                      (|＾_＾|)                    //
//                      0\  =  /0                    //
//                    ___/`---'\___                  //
//                  .' \|     |// '.                 //
//                 / \|||  :  |||// \                //
//                / _||||| -:- |||||- \              //
//               |   | \  -  /// |     |             //
//               | \_|  ''\---/''  |_/ |             //
//               \  .-\__  '-'  ___/-. /             //
//             ___'. .'  /--.--\  `. .'___           //
//          ."" '<  `.___\_<|>_/___.' >' "".         //
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |       //
//         \  \ `_.   \_ __\ /__ _/   .-` /  /       //
//     =====`-.____`.___ \_____/___.-`___.-'=====    //
//                                                   //
//                 佛祖保佑       永无BUG             //
//                                                   //
//          本程序已经经过开光处理，绝无可能再产生bug   //
//==================================================//
import decode from './utils/decode.js';
let auth = true;
let fn;
App({
  onLaunch: function (options) {
    console.log('init', options)
    const kmid = wx.getStorageSync('kmid');
    this.globalData.url = options.path;
    // this.auth();
    //保存userID token
    const that = this;
    if(!wx.getStorageSync('tips')){
    wx.setStorage({
      key:'tips',
      data:{
        subject:true,
        exam:true,
        voice:true,
        search:true
      }
    })}
    
    const { SDKVersion, model, brand, language, version, system, platform } = wx.getSystemInfoSync();
    that.globalData.SDKVersion = SDKVersion;
    var data = model.substring(0, model.lastIndexOf("X")) + "X";
    if (data == "iPhone X") {
      console.log("机型判断正确")
      that.globalData.isIpx = true
    }
  },

  onShow: function (referrerInfo) {
    console.log('授权状态',  referrerInfo);
    const { extraData, path, scene } = referrerInfo;
    if (extraData && extraData.open){
    
      this.globalData.open = true;
    }else{
      this.globalData.open = false;
    }
    if (scene == 1037 && referrerInfo.referrerInfo && referrerInfo.referrerInfo.extraData  && referrerInfo.referrerInfo.extraData){
      //多重判断保证是进来购买的
      this.globalData.params = referrerInfo.referrerInfo;
      console.log(this.globalData.params,'跳转进来购买')
    }

    const { UserID, UserToken } = wx.getStorageSync('info');
    // wx.checkSession({
    //   success: function () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     console.log('未过期')
    //     if (!UserID || !UserToken) {
    //        wx.switchTab({
    //          url:'pages/me/me'
    //        })
    //     }
    //   },
    //   fail: function () {
    //     //session_key 过期
    //     wx.switchTab({
    //       url: 'pages/me/me'
    //     })
    //   }
    // })
    this.verUpdate();
  },
  verUpdate: function (toast, fn) {
    const that = this;
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      console.log('查看是否有新版本', res.hasUpdate);
      if (res.hasUpdate) {
        that.globalData.hasUpdate = true;
        wx.showTabBarRedDot({
          index: 4
        })
        fn && fn();
        queryUpdate();
        if (toast) {
          wx.showModal({
            title: '是否更新',
            content: `检查到版本有更新， 点击确认稍后会弹出更新提示框！`,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                that.globalData.queryUpdate = true;
                queryUpdate();
              } else if (res.cancel) {
                console.log('用户点击取消');
                that.globalData.queryUpdate = false;
              }
            }
          })
        }
      } else {
        wx.hideTabBarRedDot({
          index: 4
        })
        if (toast) {
          wx.showToast({
            title: '未检查到更新',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
      
    function queryUpdate() {
      updateManager.onUpdateReady(function () {
        if (that.globalData.queryUpdate) {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              } else {
                that.globalData.queryUpdate = false;
              }
            }
          })
        }
      });
    }
  },
  reject: function () {
    const that = this;
    wx.showModal({
      title: '登录失败',
      content: '您曾拒绝过用户信息授权,请前往小程序的“设置”中,允许使用您的“用户信息”。设置完成后，返回进行授权登录，选择自动创建将为您自动创建账号',
      confirmColor: '#419aff',
      confirmText: '去设置',
      cancelText: '不了',
      success: function (success) {

        if (success.confirm) {
          //确定就打开设置
          wx.openSetting({
            success: function (res) {
              if (res.authSetting['scope.userInfo']){
                //授权成功
                that.auth();

              }
              console.log('授权结果', res)
            }
          })
        } else {
          let user = wx.getStorageSync('info')

        }
      }
    })
  },
  auth: function (fn) {
    const that = this;
    let user = wx.getStorageSync('info')
    if (wx.getSetting) {
     
      wx.getSetting({
        success(res) {
          console.log(res, '授权状态')
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                wx.getUserInfo({
                  
                  success: res => {
                    
                    that.init(res, fn);
                    wx.setStorageSync('user', res.userInfo);
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback(res)
                    }
                  },
                  fail: function () {
                    that.reject();
                    auth = false;

                  },
                  complete:function(res){
                    console.log('授权结果',res)
                  }
                })
              },
              fail: function () {
                //一直提示授权失败
                console.log('拒绝授权')
                that.reject();
                auth = false;
              }

            })
          } else {
            //如果存在授权

            wx.getUserInfo({
              withCredentials: true,
              success: res => {
                auth = true;
                console.log('授权成功', res)
                that.init(res, fn);
                // 可以将 res 发送给后台解码出 unionId
                // that.setData({ userInfo: res.userInfo, show: true })
                // that.globalData.userInfo = res.userInfo
                wx.setStorageSync('user', res.userInfo);
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              },
              fail: function () {
                that.reject();
                auth = false;
              }
            })
          }

        },
      })
    } 
    
  },
  init: function (data, fns) {
    const that = this;
    // 登录
    const kmid = wx.getStorageSync('kmid');
    
    if (fns) {
      console.log('保存', fns)
      this.globalData.fn = fns;
      return false;
    }
    console.log('进来就初始化')
    
    wx.login({
      success: res => {
        //code换取openidN
        wx.request({
          url: 'https://data.api.ppkao.com/Interface/UserApi.ashx?',
          data: {
            action: 'WeiXinApiCodeLoginNew',
            code: res.code,
            encryptedData: data.encryptedData,
            iv: data.iv,
            xcxver: that.globalData.xcxver,
            xid: that.globalData.xid
          },
          success: function (res) {
            console.log(res, '获取用户的信息', decode(res.data))
            let data = decode(res.data);
            //登录成功
            if (data.S == 1) {
              auth = true;
              // 获取用户信息
              wx.setStorage({
                key: 'info',
                data: { ...data.UserList[0] },
                success: function (json) {
                  console.log(json, '写入成功')
                }
              })
              console.log(that.globalData.fn)
              that.globalData.fn && that.globalData.fn.update();
              if ('pages/me/discount/discount') {
                
               
              }



            } else {
              //否则就是登陆失败的情况  重新拉起授权  需要一个解决方案
              wx.showModal({
                title: '温馨提示',
                content: '登录失败,数据异常,请退出重进',
                success: function (res) {
                  if (res.confirm) {

                  }
                }
              })

            }
          }
        })
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '登录失败了,数据异常,请退出重进',
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    })

  },
  onError: function () {
    // wx.showModal({
    //   title: '错误提示',
    //   content: '当前程序发生错误,请退出重试',
    //   showCancel:false
    // })
  },
  //更新数据
  update: function(){
    wx.request({
      url: 'https://data.api.ppkao.com/Interface/UserApi.ashx?',
      data: {
        action: 'GetUserModel',
        UserID: UserID,
        UserToken: UserToken,
        xid:this.globalData.xid,
        xcxver: this.globalData.xcxver
      },
      success: function (res) {
        console.log(res, '获取用户的信息', decode(res.data))
        let data = decode(res.data);
        wx.stopPullDownRefresh()
        //登录成功
        if (data.S == 1) {
          // 获取用户信息

         
          wx.setStorage({
            key: 'info',
            data: { ...data.UserList[0] },
            success: function (json) {
              console.log(json, '写入成功')
            }
          })
 

        } else {
          //否则就是登陆失败的情况  重新拉起授权  需要一个解决方案
          wx.showModal({
            title: '温馨提示',
            content: res.msg,
            icon:'none',
             
          })

        }
      }
    })
  } , 
  globalData: {
    userInfo: null,//用户信                                息
    cache: {},//缓存数据
    isLoad:false,
    KSTKList: [],
    photo: true, //是否开启拍照功能
    imagePath: '',//拍照搜索图片路径
    Kemu: {},
    shows:false,//控制组件显示
    xcxver: 1.0,//小程序版本 
    xid: 31,
    params:'',
    ExamList: {}, //题目列表
    queryUpdate: true, // 是否允许更新
    hasUpdate: false // 是否有版本更新
  }
})
