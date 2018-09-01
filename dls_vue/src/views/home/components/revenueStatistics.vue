<template>
    <div class="revenueStatistics">
        <Row type="flex" justify="space-around" class="content">
            <Col span="5" class="info">
                <div class="text">
                    <span>{{info.InviteAt}}</span>
                    <h3>用户人数</h3>
                </div>
            </Col>
            <Col span="5" class="info">
                <div class="text">
                    <span>{{info.Money}}</span>
                    <h3>账户余额</h3>
                </div>
            </Col>
        </Row>
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
            //
        };
    },
    mounted () {
        
    },
    methods: {
    
    }
};
</script>

<style lang="less" scoped>
.revenueStatistics{
    .content{
        display: flex;
        align-items: center;
        min-height: 240px;
        .info{
            .text{
                text-align: center;
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

