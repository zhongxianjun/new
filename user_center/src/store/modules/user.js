import Cookies from 'js-cookie';
import env from '../../../build/env';
import util from '../../libs/util.js';
import SortUrl from "csqz-encrypt";
const user = {
    state: {
        UserInfo: {},
        time: null // 全局的定时器
    },
    mutations: {
        logout(state, vm) {

            Cookies.remove('password');
            Cookies.remove('password', {
                domain: '.ppkao.com'
            });
            Cookies.remove('QZ_KSUser');
            Cookies.remove('Rnd');
            Cookies.remove('QZ_KSUser', {
                domain: '.ppkao.com'
            });
            Cookies.remove('Rnd', {
                domain: '.ppkao.com'
            });

            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        SetUserInfo(state, UserInfo) {
            console.log(UserInfo, '查看用户信息')
            state.UserInfo = UserInfo;
        },
        clearTime(state) {
            clearInterval(state.time);
            // 清空全局定时器
        },
        updateUserFace(state, url) {
            state.UserInfo.UserFace = url;
        },
        login(state, json) {
            let {
                data,
                fn
            } = json;
            localStorage.avatorImgPath = data.UserFace;
            if (env === 'development') {
                Cookies.set(
                    'QZ_KSUser',
                    `UserID=${data.UserID}&UserName=${
                    data.UserName
                    }&UserToken=${data.UserToken}`, {
                        expires: 7
                    }
                );

            } else if (env === 'production') {
                Cookies.set(
                    'QZ_KSUser',
                    `UserID=${data.UserID}&UserName=${
                    data.UserName
                    }&UserToken=${data.UserToken}`, {
                        expires: 7
                    }
                );


            } else {
                Cookies.set(
                    'QZ_KSUser',
                    `UserID=${data.UserID}&UserName=${
                    data.UserName
                    }&UserToken=${data.UserToken}`, {
                        expires: 7,
                        domain: '.ppkao.com'
                    }
                );

            }
            // 设置单点登录
            Cookies.set('Rnd', data.RndPassword, {
                expires: 365
            });
            console.log('开始执行跳转')
            fn && fn();
            util.ajax(

                SortUrl(`https://data.api.ppkao.com/Interface/YXK/PublicApi.ashx?action=GetProvinceByIP&IP=${
                    data.LastLoginIP
                    }&UserID=${data.UserID}&UserToken=${
                    data.UserToken
                    }`)

            ).then(res => {
                Cookies.set('add', res.msg);
            });
            state.UserInfo = data;
            // this.$store.commit("SetUserInfo", data);
        }
    }
};

export default user;