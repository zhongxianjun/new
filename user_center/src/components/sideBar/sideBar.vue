<style lang="less">
@import "./sideBar.less";
</style>

<template>
    <div class="side-bar" v-show="show">
        <div class='pk_gotop'>  
            <div class="gotop_icon goTop_phone" target='_blank'>
                <img class="qr" src="@/images/erweima.png" />
            </div>
        </div>
        <div class='pk_gotop'>  
            <a :href="kefuTime" class="gotop_icon goTop_callKF" target='_blank' ></a>
        </div>
        <backtop></backtop>
    </div>
</template>

<script>

import backtop from '../backtop/backtop.vue';
export default {
    name: 'sideBar',
    components: {
        backtop
    },
    props: {
        target: {
            type: String,
            default: '.single-page-con'
        }
    },
    data () {
        return {
            show: false
        };
    },
    methods: {
        _scroll () {
            let dom = document.querySelector(this.target);
            let currentTop = dom.scrollTop;
            if (currentTop >= 200) {
                // console.log('出现返回顶部');
                this.show = true;
            } else {
                this.show = false;
            }
        }
    },

    computed: {
        kefuTime () {
            return this.$store.state.app.kefuTime;
        }
    },

    mounted () {
        let dom = document.querySelector(this.target);
        dom.addEventListener('scroll', this._scroll);
    },

    destroyed () {
        let dom = document.querySelector(this.target);
        if (dom) {
            dom.removeEventListener('scroll', this._scroll);
        }
    }
};
</script>

