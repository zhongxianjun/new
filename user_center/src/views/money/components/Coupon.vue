<style lang="less">
    @import '../../../styles/common.less';
    @import '../money.less';
</style>

<template>
    <div>
        <div class="coupon-box">
            <div class="coupon">
                <template v-for="(item, index) in couponList">
                    <div class="item" :key="index">
                        <div>
                            <div class="top">
                                <div>
                                    <div class="left">
                                        ￥<span>{{parseInt(item.AvailableMoney)}}</span>
                                    </div>
                                    <div class="right">
                                        <h2>优惠券</h2>
                                        <h3>满{{parseInt(item.MinAmount)}}元可使用</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom">
                                <p>到期时间：{{item.EndDate}}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="no-coupon" v-if="noData">
                <img src="@/images/nocoupon.png" />
                <p>亲，还没有优惠券哦</p>
            </div>
        </div>
        <Spin fix v-if="spinShow">
            <img src="@/images/load.gif" style="width:40px;"/>
            <p style="padding-top:20px;">正在为您加载中</p>
        </Spin>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    components: {

    },
    data () {
        return {
            spinShow: false,
            couponList: [],
            noData: false
        };
    },
    computed: {

    },
    methods: {
        getCoupon () {
            this.spinShow = true;
            util.GroupNum()
                .then((values) => {
                    console.log(values);
                    this.noData = !values;
                    this.couponList = values || [];
                    this.spinShow = false;
                });
        }
    },
    mounted () {
        this.getCoupon();
    }
};
</script>
