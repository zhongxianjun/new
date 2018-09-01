import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import env from '../../build/env';
import SortUrl from "csqz-encrypt";
import {
    routers,
    otherRouter,
    appRouter
} from './router';
import store from '@/store';
Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);
console.log(routers);
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    console.log('查看跳转', Cookies.get('QZ_KSUser'), to.name, env)
    Util.title(to.meta.title);
    if (Cookies.get('QZ_KSUser')) {
        Util.http({
            url: '/Interface/UserApi.ashx?',
            params: {
                action: 'GetUserModel'
            },
            auto: true
        }).then(data => {
            const Rnd = Cookies.get('Rnd');
            console.log(data, '页面切换获得的数据');
            if (data.S == 1) {
                const UserInfo = data.UserList[0];

                if (Rnd && Rnd != UserInfo.RndPassword) {
                    router.push('/403?permissions=none');
                } else {
                    let url = `https://data.api.ppkao.com/Interface/YXK/PublicApi.ashx?action=GetProvinceByIP&IP=${UserInfo.LastLoginIP}&UserID=${UserInfo.UserID}&UserToken=${UserInfo.UserToken}`

                    console.warn(SortUrl(url), '获取ID')
                    Util.ajax(
                        SortUrl(url)
                    ).then(res => {

                        Cookies.set('add', res.msg);
                    });
                    store.commit('SetUserInfo', UserInfo);

                    store.commit('setAvator', UserInfo.UserFace);
                    store.commit('SetUserInfo', UserInfo);
                    if (env === 'development') {
                        Cookies.set(
                            'QZ_KSUser',
                            `UserID=${UserInfo.UserID}&UserName=${UserInfo.UserName}&UserToken=${
                            UserInfo.UserToken
                            }`, {
                                expires: 7
                            }
                        );
                    } else if (env === 'production') {
                        Cookies.set(
                            'QZ_KSUser',
                            `UserID=${UserInfo.UserID}&UserName=${UserInfo.UserName}&UserToken=${
                            UserInfo.UserToken
                            }`, {
                                expires: 7,
                                domain: '.ppkao.com'
                            }
                        );
                    } else {
                        Cookies.set(
                            'QZ_KSUser',
                            `UserID=${UserInfo.UserID}&UserName=${UserInfo.UserName}&UserToken=${
                            UserInfo.UserToken
                            }`, {
                                expires: 7,
                                domain: '.ppkao.com'
                            }
                        );
                    }
                }
            } else {
                // 登录失败
                // router.push(`/403?loginfail=${data.msg}`);
            }
        });
    }
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('QZ_KSUser') && to.name !== 'login') {
            // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('QZ_KSUser') && to.name === 'login') {
            // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            // const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            // if (curRouterObj && curRouterObj.access !== undefined) {
            //     // 需要判断权限的路由
            //     if (curRouterObj.access === parseInt(Cookies.get('access'))) {
            //         Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
            //     } else {
            //         next({ replace: true, name: 'error-403' });
            //     }
            // } else {
            //     // 没有配置权限的路由, 直接通过
            // }
            Util.toDefaultPage([...routers], to.name, router, next);
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});