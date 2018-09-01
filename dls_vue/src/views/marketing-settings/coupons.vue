<style lang="less">
    @import '../../styles/common.less';
    @import './marketing-settings.less';
</style>

<template>
    <div>
        <Card>
            <div class="coupons-container">
                <div class="options">
                    <Button type="primary" icon="md-add" @click="operation({type: 'add'})">新增</Button>
                    <Button>查看全部</Button>
                    <Button>查看有效</Button>
                </div>
                <div class="coupons-box">
                    <template v-for="item in 10">
                        <div class="coupon">
                            <div class="content">
                                <div class="left">
                                    <div class="sum">
                                        ￥<span>3</span>
                                    </div>
                                    <div class="status">
                                        发放中
                                    </div>
                                </div>
                                <div class="right">
                                    <aside>起用金额：<span>28.00</span></aside>
                                    <aside>发放对象：<span>新用户</span></aside>
                                    <aside>时效：<span>31天</span></aside>
                                    <aside>发放至：<span>2020-2-20</span></aside>
                                </div>
                            </div>
                            <div class="operate"><span @click="operation({type: 'editor'})">修改</span></div>
                        </div>
                    </template>
                </div>
            </div>
        </Card>
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
        };
    },
    computed: {

    },
    methods: {
        operation({
            type = null,
            data = null
        } = {}) {
            const UserInfo = util.parseInfo();
        }
    },
    mounted () {
        
    }
};
</script>
