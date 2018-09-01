<template>
    <div class="salesTrend">
        <div style="width:100%;min-height:300px;" id="visite_volume_con" v-show="show"></div>
        <div class="noData" style="text-align:center;" v-show="!show">暂无数据</div>
    </div>
</template>

<script>
import echarts from 'echarts';
import util from "@/libs/util.js";
export default {
    name: 'visiteVolume',
    props: {
        salesDate: {
            type: ''
        }
    },
    watch: {
        salesDate() {
            this.sales();
        }
    },
    data () {
        return {
            show: true
        };
    },
    mounted () {
        this.sales();
    },
    methods: {
        async sales() {
            let courseName = [];
            let value = [];
            let tempData = [];
            this.show = true;

            const {AdminID, UserToken} = util.parseInfo();
            let saleData = await this.$http({
                url: '/Interface/MarketAdmin/MarketIndexData.ashx?',
                params: {
                    action: 'GetMarketBuySubjectData',
                    UserID: AdminID,
                    UserToken,
                    DateTime: this.salesDate
                }
            });
            console.log(saleData);

            if(saleData.S == 1){
                if(saleData.SubjectList.length !== 0){
                    this.show = true;
                    saleData.SubjectList.map((elem, i)=>{
                        
                        courseName.push(elem.TName);
                        value.push(elem.Num);
                        tempData.push({value: value[i], name: courseName[i], itemStyle: {normal: {color: '#2d8cf0'}}});
                    });
                    console.log(courseName, value);

                    let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));

                    const option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            top: '5%',
                            left: '2%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            axisLabel:{
                                rotate: 45
                            },
                            data: courseName,
                            axisTick: {
                                alignWithLabel: true
                            }
                        },
                        yAxis: {
                            type: 'value',
                            nameTextStyle: {
                                color: '#c3c3c3'
                            }
                        },
                        series: [
                            {
                                name: '',
                                type: 'bar',
                                barWidth: '60%',
                                data: tempData
                            }
                        ]
                    };
                    console.log(option)
                    visiteVolume.setOption(option);

                    window.addEventListener('resize', function () {
                        visiteVolume.resize();
                    }); 
                } else {
                    this.show = false;
                }
            }
        }
    }
};
</script>
