
import Cookies from 'js-cookie';
import env from '../../../config/env';
import util from '@/libs/util.js';

export default {
  state: {
    userName: '',
    avatorImgPath: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    access: '',
    UserInfo: {}
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setUserInfo (state, data) {
      state.UserInfo = data
    }
  },
  actions: {
    // 登录
    handleLogin (state, data) {
      console.log(data, '登录后的数据');
      let UserInfo = data;
      let access = [];
      UserInfo.access = access;
      
      return new Promise((resolve, reject) => {
        state.UserInfo = UserInfo;
        
        if (env === 'development') {
            Cookies.set( 'QZ_FXLoginInfo', JSON.stringify( UserInfo ), { expires: 7 } );
        } else if (env === 'production') {
            Cookies.set( 'QZ_FXLoginInfo', JSON.stringify( UserInfo ), { expires: 7, domain: '.ppkao.com' } );
        } else {
            Cookies.set( 'QZ_FXLoginInfo', JSON.stringify( UserInfo ), { expires: 7, domain: '.ppkao.com' } );
        }
        
        resolve();
      })
    },
    // 退出登录
    handleLogOut (state, data) {
      Cookies.remove('QZ_FXLoginInfo');
      Cookies.remove('QZ_FXLoginInfo', { domain: '.ppkao.com' });
      localStorage.removeItem('tagNaveList');
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
          let UserInfo = state.UserInfo;
          console.log(UserInfo);
          // commit('setAvator', data.avator)
          commit('setUserName', UserInfo.UserName)
          commit('setAccess', UserInfo.access)
          resolve(UserInfo)
      })
    }
  }
}
