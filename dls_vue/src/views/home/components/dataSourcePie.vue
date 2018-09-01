<template>
    <div class="dataSourcePie">
        <div style="width: 75%; min-height: 200px;" id="data_source_con"></div>
        <div class="allMoney">
            <h4 class="title">总收入</h4>
            <div class="stat">¥ {{money}}</div>
        </div>
        <ul>
            <li v-for=" (item, i) in listArr">{{item}}</li>
        </ul>
    </div>
</template>

<script>
import echarts from 'echarts';
import util from "@/libs/util.js";

export default {
    name: 'dataSourcePie',
    props: {
        revenueDate: {
            type: ''
        }
    },
    data () {
        return {
            listArr: [],
            money: '',
            value: []
        };
    },
    watch: {
        revenueDate: {
            handler(newVal, oldVal) {
                console.log(newVal, oldVal);
                this.revenue();
            },
            deep: true
        }
    },
    computed: {
        
    },
    mounted () {
        this.revenue();
    },
    methods: {
        //营收情况 数据渲染 函数
        async revenue() {
            const {AdminID, UserToken} = util.parseInfo();
            let revenueInfo = await this.$http({
                url: '/Interface/MarketAdmin/MarketIndexData.ashx?',
                params: {
                    action: 'GetIndexMarketData',
                    UserID: AdminID,
                    UserToken,
                    DateTime: this.revenueDate
                }
            });
            console.log(revenueInfo, '营收情况');
            this.listArr = [];
            this.value = [];

            const { AllMoney, OnlineMoney, UpVipMoney, BuySubjectMoney, BuyYaTiMoney, PhotMoney, DisparityMoney } = revenueInfo;
            this.listArr.push('￥'+OnlineMoney, '￥'+UpVipMoney, '￥'+BuySubjectMoney, '￥'+BuyYaTiMoney,'￥'+PhotMoney, '￥'+DisparityMoney);
            this.value.push(OnlineMoney, UpVipMoney, BuySubjectMoney, BuyYaTiMoney, PhotMoney, DisparityMoney);
            console.log(this.listArr);
            this.money = AllMoney;

            var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a}{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    padding: [ 20, 0],
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: '#000',
                        fontSize: 14
                    },
                    data: ['在线充值金额', '升级会员金额', '购买科目金额', '购买押题密卷金额', '购买拍照搜索金额', '补差价升级科目金额']
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['60%','80%'],
                        center: ['35%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {value:this.value[0], name: '在线充值金额', itemStyle: {normal: {color: '#9bd598'}}},
                            {value:this.value[1], name: '升级会员金额', itemStyle: {normal: {color: '#ffd58f'}}},
                            {value:this.value[2], name: '购买科目金额', itemStyle: {normal: {color: '#abd5f2'}}},
                            {value:this.value[3], name: '购买押题密卷金额', itemStyle: {normal: {color: '#ab8df2'}}},
                            {value:this.value[4], name: '购买拍照搜索金额', itemStyle: {normal: {color: '#ec9df3'}}},
                            {value:this.value[5], name: '补差价升级科目金额', itemStyle: {normal: {color: '#e14f60'}}}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener('resize', function () {
                dataSourcePie.resize();
            });
        }
    }
};
</script>

<style lang="less">
.dataSourcePie{
    width: 100%;
    position: relative;
    display: flex;
    .allMoney{
        position: absolute;
        width: 100px;
        left: 95px;
        top: 80px;
        h4{
            text-align: center;
        }
        .stat{
            font-size: 22px;
            text-align: center;
        }
    }
    ul{
        width: 25%;
        height: 158px;
        list-style: none;
        padding: 18px 0 0 10px;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        li{
            width: 100%;
        }
    }
}
</style>
