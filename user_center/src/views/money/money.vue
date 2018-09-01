<style lang="less">
    @import '../../styles/common.less';
    @import './money.less';
</style>

<template>
    <div class="money-container-box">
        <Card>
            <p slot="title">
                <Icon type="social-yen"></Icon>
                我的钱包
            </p>
            <div class="money-box">
                <Menu mode="horizontal" active-name="consume" @on-select="changeMenu">
                    <MenuItem name="consume">
                        <Icon type="social-yen"></Icon>
                        消费记录
                    </MenuItem>
                    <MenuItem name="coupon">
                        <Icon type="ios-paper-outline"></Icon>
                        优惠券
                    </MenuItem>
                </Menu>
                <div class="result-box">
                    <Record v-if="name === 'consume'"></Record>
                    <Coupon v-if="name === 'coupon'"></Coupon>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import Record from './components/Record';
import Coupon from './components/Coupon';
export default {
    components: {
        Record, Coupon
    },
    data () {
        return {
            name: ''
        };
    },
    computed: {

    },
    methods: {
        changeMenu (name) {
            if (name === 'consume') {
                console.log('consume');
                this.name = 'consume';
            } else if (name === 'coupon') {
                console.log('coupon');
                this.name = 'coupon';
            }
        }
    },
    mounted () {
        this.name = 'consume';
    }
};
</script>
