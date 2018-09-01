import Vue from 'vue';
import iView from 'iview';
import switchKemu from './components/switch-kemu.vue';
import buyKemu from './components/buy-kemu.vue';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import animate from 'animate.css';
window.eventHub = new Vue(); // 注册全局事件监听
Vue.use(VueI18n); // 中英文
Vue.use(iView);
Vue.use(animate);
Vue.component('switch-kemu', switchKemu);// 全局注册组件
Vue.component('buy-kemu', buyKemu);
Vue.http = Vue.prototype.$http = util.http; // 全局注册网络请求库
Vue.ajax = Vue.prototype.$ajax = util.ajax;
Vue.openPage = Vue.prototype.$openPage = util.openPage; // 打开新页面
Vue.parseInfo = Vue.prototype.$parseInfo = util.parseInfo; // 解析UserID UserToken cookie
Vue.updateUserInfo = Vue.prototype.$updateUserInfo = util.updateUserInfo;// 用户信息更新
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
    // 全局的检测
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    // iview-admin检查更新
    // util.checkUpdate(this);
    },
    created () {
        let tagsList = [];
        appRouter.map(item => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
