import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css';

import util from '@/libs/util';

Vue.use(iView);

Vue.http = Vue.prototype.$http = util.http;

Vue.config.productionTip = false

new Vue({
  store: store,
  router: router,
  render: h => h(App)
}).$mount('#app')
