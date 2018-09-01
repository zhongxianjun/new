<template>
    <div class='pk_gotop' @click="goTop">  
        <div class="gotop_icon goTop_back" target='_blank' ></div>
    </div>
</template>
<script>
export default {
    name: 'backtop',
    props: {
        target: {
            type: String,
            default: '.single-page-con'
        }
    },
    data () {
        return {
            
        }
    },
    methods: {
        goTop () {
            console.log('返回顶部');
            let dom = document.querySelector(this.target);
            let currentTop = dom.scrollTop;
            dom.scrollTop = 0;
            // if (currentTop > 0) {
            //   let scrollToTop = setInterval(function() {
            //       let scrollTop = dom.scrollTop;
            //       if ( scrollTop > 0 ) {
            //           dom.scrollTop = scrollTop - 20;
            //       } else {
            //           clearInterval( scrollToTop );
            //       }
            //   }, 4);
            // }
        }
    },
    mounted () {
        
    }
};
</script>
<style lang="less" scoped>
.pk_gotop {
  cursor: pointer;
  z-index: 999;
  
  span {
    display: block;
    margin: 0 auto;
    text-align: center;
  }
  .gotop_icon {
    width: 61px;
    height: 48px;
    display: block;
    margin-top: 6px;
    font-size: 14px;
    line-height: 35px;
    text-align: center;
    background-color: #fff;
    color: #a5a5a5;
  }
  .gotop_icon:hover {
    background-position-y: -48px;
    background-color: #2273c0;
    color: #fff;
  }
  .goTop_phone {
    background: url("~@/images/gongneng.png") no-repeat 0 0;
    position: relative;
    transition: background-position 0.4s;
  }
  .goTop_callKF {
    background: url("~@/images/gongneng.png") no-repeat -61px 0;
    transition: background-position 0.4s;
  }
  .goTop_back {
    background: url("~@/images/gongneng.png") no-repeat -122px 0;
    transition: background-position 0.4s;
  }
}
</style>
