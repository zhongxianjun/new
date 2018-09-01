<template>
    <div class="todayRevenue">
        <div class="todayRevenue-content">
            <Row type="flex" justify="start" class="textContent">
                <Col span="5" class="info">
                    <div class="text">
                        <span>{{info.DayRed}}</span>
                        <h3>新增用户</h3>
                    </div>
                </Col>
                <Col span="5" class="info">
                    <div class="text">
                        <span>{{info.DayOrders}}</span>
                        <h3>今日订单</h3>
                    </div>
                </Col>
                <Col span="5" class="info">
                    <div class="text">
                        <span>{{info.DayIncome}}</span>
                        <h3>今日收入</h3>
                    </div>
                </Col>
                <Col span="5" class="info">
                    <div class="text">
                        <span>{{info.ExamIncome}}</span>
                        <h3>题库收入</h3>
                    </div>
                </Col>
                <Col span="4" class="info">
                    <div class="text">
                        <span>{{info.SelQuesIncome}}</span>
                        <h3>搜题收入</h3>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import util from "@/libs/util.js";
export default {
    props: {
        info: {
            type: Object
        }
    },
    data () {
        return {
            
        };
    },
    mounted () {
        
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
.todayRevenue{
    width: 100%;
    &-content{
        width: 100%;
        min-height: 300px;
        .header{
            display: flex;
            align-items: center;
            .title{
                width: 303px;
                min-height: 35px;
                line-height: 35px;
                font-size: 16px;
                padding: 16px 24px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                color: rgba(0,0,0,.85);
                font-weight: 500;
            }
        }
    }
    .textContent{
        padding: 0 24px;
        min-height: 230px;
        display: flex;
        align-items: center;
        .ivu-col{
            text-align: center;
        }
        .info{
            .text{
                
                span{
                    display: inline-block;
                    width: 100%;
                    font-size: 45px;
                    font-weight: 700;
                    line-height: 80px;
                    min-height: 80px;
                }
                h3{
                    min-height: 60px;
                    line-height: 60px;
                    margin-top: 0;
                    margin-bottom: .5em;
                    color: rgba(0,0,0,.85);
                    font-weight: 500;
                }
            }
        }
    }
}
</style>

