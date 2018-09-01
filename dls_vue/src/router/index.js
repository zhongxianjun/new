import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { canTurnTo } from '@/libs/util'
import Cookies from 'js-cookie';
import util from '../libs/util';
import env from '../../config/env';

Vue.use(Router)

const router = new Router({
  routes,
  mode: 'hash'
})


router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    let UserInfo = Cookies.get("QZ_FXLoginInfo");
    UserInfo = ( UserInfo ? JSON.parse( UserInfo ) : null );
    if (UserInfo) {
        util.http({
            url: '/Interface/MarketAdmin/MarketMuneApi.ashx',
            params: {
                action: 'GetAdminMenuList',
                UserID: UserInfo.AdminID,
                UserToken: UserInfo.UserToken
            }
        })
        .then((values) => {
            console.info('当前登录用户菜单', values);
            let access = [];
            function checkMenus(values) {
                Object.keys(values).forEach((item, index) => {
                    access.push(values[item].ID);
                    if (values[item].children && values[item].children.length) {
                        checkMenus(values[item].children);
                    }
                });
            }
            checkMenus(values);
            UserInfo.access = access;
            console.info('当前用户信息', UserInfo);
            store.commit('setUserInfo', UserInfo);
            return UserInfo;
        })
        .then((values) => {
            if (!UserInfo && to.name === 'login') {
                next();
            } else if (!UserInfo && to.name !== 'login') {
                next({ name: 'login' });
            } else if (UserInfo && to.name === 'login') {
                next({ name: 'home' });
            } else {store.dispatch('getUserInfo').then(user => {
                // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
                if (canTurnTo(to.name, user.access, routes)) next() // 有权限，可访问
                else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
                })
            }    
        });   
    } else {
        if (!UserInfo && to.name === 'login') {
            next();
        } else if (!UserInfo && to.name !== 'login') {
            next({ name: 'login' });
        }
    }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
