<style lang="less">
@import "./home.less";
</style>
<template>
    <div class="home-main">
        <Card>
            <div class="top">
                <Row class="container">

                    <Col class="left">
                        <Card class="content" v-if="revenueDate">
                            <div class="header">
                                <div class="title">
                                    分销营收
                                </div>
                                <div class="time">
                                    <DatePicker
                                        :value="revenueDate"
                                        type="month"
                                        format="yyyy-MM"
                                        :editable="false"
                                        :options="options"
                                        placeholder="revenueDate"
                                        style="width: 200px"
                                        @on-change="changeRevenueDate"
                                    >
                                    </DatePicker>
                                </div>
                            </div>
                            <div style="width: 540px;">
                                <dataSourcePie :revenueDate="revenueDate"></dataSourcePie>
                            </div>
                        </Card>
                        <Card class="content" v-if="agentsDayRevenue">
                            <div class="header">
                                <div class="title">
                                    今日营收
                                </div>
                            </div>
                            <todayRevenue :info="agentsDayRevenue"></todayRevenue>
                        </Card>
                    </Col>

                    <Col class="right">
                        <Card class="card" v-if="inviteInfo">
                            <div class="header">
                                分销情况
                            </div>
                            <Row type="flex" justify="start" class="content" v-if="show">
                                <Col span="5" class="info">
                                    <div class="text">
                                        <span>{{inviteInfo.TotalInvite}}</span>
                                        <h3>主动邀请人</h3>
                                    </div>
                                </Col>
                                <Col span="5" class="info">
                                    <div class="text">
                                        <span>{{inviteInfo.AllInvite}}</span>
                                        <h3>总被邀请人</h3>
                                    </div>
                                </Col>
                                <Col span="5" class="info">
                                    <div class="text">
                                        <span>{{inviteInfo.UpgradeNum}}</span>
                                        <h3>升级数</h3>
                                    </div>
                                </Col>
                                <Col span="5" class="info">
                                    <div class="text">
                                        <span>{{inviteInfo.SearchVIP}}</span>
                                        <h3>搜题VIP</h3>
                                    </div>
                                </Col>
                                <Col span="4" class="info">
                                    <div class="text">
                                        <span>{{inviteInfo.BuySubject}}</span>
                                        <h3>购买题库</h3>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card class="card" v-if="agentsDayRevenue">
                            <div class="header">
                                营收统计
                            </div>
                            <revenueStatistics :info="agentsDayRevenue"></revenueStatistics>
                        </Card>
                    </Col>
                </Row>
            </div>


            <div class="bottom">
                <Card class="container">
                    <div class="header">
                        <div class="title">
                            销量分析
                        </div>
                        <div class="time">
                            <DatePicker 
                                :value="salesDate"
                                type="month"
                                format="yyyy-MM"
                                :editable="false" 
                                :options="options" 
                                placeholder="salesDate" 
                                style="width: 200px"
                                @on-change="changeSalesDate"
                            >
                            </DatePicker>
                        </div>
                    </div>
                    <salesTrend v-if="salesDate" :salesDate="salesDate"></salesTrend>
                </Card>
            </div>
        </Card> 
        
        <div class="copyright">
            Copyright © 长沙求知信息技术有限公司
        </div>
    </div>
</template>

<script>
import util from "@/libs/util.js";
import Cookies from "js-cookie";
import axios from "axios";
import dataSourcePie from "./components/dataSourcePie";
import salesTrend from "./components/salesTrend";
import revenueStatistics from "./components/revenueStatistics";
import todayRevenue from "./components/todayRevenue";
export default {
    components: {
        dataSourcePie,
        salesTrend,
        todayRevenue,
        revenueStatistics
    },
    data() {
        return {
            options: {
                disabledDate (month) {
                    return month && month.valueOf() > Date.now() - 86400000;
                }
            },

            revenueDate: null,
            salesDate: null,

            inviteInfo: null,

            show: true,
            
            agentsDayRevenue: null
        };
    },
    computed: {
        currentMonth() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            var currentMonth = year + "-" + month;
            return currentMonth;
        },
    },
    mounted() {
        const {AdminID, UserToken, GroupID} = util.parseInfo();
        if ((GroupID === '1') || (GroupID === '19')) {
            console.info('显示 管理员 首页');
            this.revenueDate = this.currentMonth;
            this.inviteSituation();

        } else {
            console.info('显示 代理商 首页');
            this.todayRevenue();
        }

        this.salesDate = this.currentMonth;
    },
    methods: {
        changeRevenueDate(e) {
            //营收时间
            this.revenueDate = e;
        },
        changeSalesDate(e) {     
            //销售额趋势时间
            this.salesDate = e;
        }, 
        async inviteSituation() {
            const {AdminID, UserToken} = util.parseInfo();
            let data = await this.$http({
                url: '/Interface/MarketAdmin/MarketIndexData.ashx?',
                params: {
                    action: 'GetIndexUserData',
                    UserID: AdminID,
                    UserToken
                }
            });
            console.log('管理员 分销情况', data);
            if (data.S == 1) {
                this.inviteInfo = data;
            }
        },


        async todayRevenue() {
            const {AdminID, UserToken} = util.parseInfo();

            let data = await this.$http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: 'GetAgentsDayRevenue',
                    UserID: AdminID,
                    UserToken
                }
            });
            console.log('代理商 今日营收', data);
            if (data.S == 1) {
                this.agentsDayRevenue = data.Data[0];
            }
        }
    }
};
</script>

<style lang="less">
    .ivu-card{
        background: #fff;
    }
    .ivu-card-body{
        padding: 0;
        min-height: 300px;
    }
</style>
