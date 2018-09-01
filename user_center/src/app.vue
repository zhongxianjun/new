<template>
    <div id="main" class="app-main">
        <router-view></router-view>
       
        <transition  enter-active-class="animated zoomInDown" leave-active-class="animated zoomOutDown"  :duration="{enter:600,leave:400}"  >
          <switch-kemu v-if="openModal"></switch-kemu>
        </transition>

        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="200"   >
         <div class="dialogModal"  v-if="openModal"></div>
        </transition>
          <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut"  :duration="200"  >
         <div class="dialogModal"  v-if="openBuyModal"></div>
        </transition>
        <transition  enter-active-class="animated zoomInDown" leave-active-class="animated zoomOutDown"  :duration="{enter:600,leave:400}"  >
          <buy-kemu v-if="openBuyModal"></buy-kemu>
        </transition>


      
        

       
    </div>
</template>

<script>
import store from '@/store';
export default {
    data () {
        return {
            theme: this.$store.state.app.themeColor
        };
    },
    computed: {
        openModal () {
            return this.$store.state.app.openModal;
        },
        openBuyModal () {
            return this.$store.state.app.openBuyModal;
        }
    },
    methods: {
        checkTime () {
            let ar = ['08:30', '16:00'];
            var d = new Date();
            var current = d.getHours() * 60 + d.getMinutes();
            var ar_begin = ar[0].split(':');
            var ar_end = ar[1].split(':');
            var b = parseInt(ar_begin[0]) * 60 + parseInt(ar_begin[1]);
            var e = parseInt(ar_end[0]) * 60 + parseInt(ar_end[1]);
            if (current >= b && current <= e) {
                return true;
            } else {
                return false;
            }
        }
    },
    mounted () {
        console.log(this.checkTime(), '客服时间');
        if (this.checkTime()) {
            store.commit(
                'setKefuTime',
                'http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDEwMDExOV8zODA2MTBfODAwMTAwMTE5XzJf'
            );
        } else {
            store.commit('setKefuTime', 'http://q.url.cn/s/i1qOmXm');
        }
    },
    beforeDestroy () {}
};
</script>

<style>
.ava .ivu-form-item-label {
  width: 100px;
  line-height: 58px;
}
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
.ivu-icon-ios-search {
  cursor: pointer;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.dialogModal {
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(55, 55, 55, 0.6);
  height: 100%;
  width: 100%;
}
</style>
