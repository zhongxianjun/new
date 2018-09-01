<style lang="less" scoped>
    .settlement-rules {
        padding: 10px 10px;
        line-height: 2;
        background-color: #eee;
        border-radius: 5px;
    }
    .settlement-container {
        margin-top: 20px;

        .container-title {
            display: flex; align-items: center; justify-content: space-between;
            .earning {
                h2 {
                    font-size: 18px;
                }
            }
        }
        .month-list-box {
            padding: 10px 0;
            .list-container-box {
                 padding: 20px 0;
                 &:nth-of-type(n+2) {
                    border-top: 1px solid #eee;
                }
                .list-box {
                    line-height: 1.4;
                    text-align: center;
                    
                    .year {
                        font-size: 22px; font-weight: bold;
                    }
                    .blue {
                    color: #419aff; 
                    }

                    .right {
                        p {
                            cursor: pointer;
                            &:nth-of-type(n+2) {
                                margin-left: 12px;
                            }
                        }
                    }
                }
                .list-step {
                    margin-top: 20px;
                    // height: 0;
                    // overflow: hidden;
                }
            }
        }
    }

    .userconsume-box {
        padding: 24px;
        position: absolute; left: 0; top: 0; z-index: 9;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5);
        animation: opacity 0.4s;

        .userconsume-title {
            display: flex; align-items: center; justify-content: space-between;
            padding: 20px 0;
            background-color: #fff;
            border-radius: 4px;
        }
    }
    .invoice-details {
        padding: 24px;
        position: absolute; left: 0; top: 0; z-index: 9;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5);
        animation: opacity 0.4s;

        .invoice-details-title {
            display: flex; align-items: center; justify-content: space-between;
            padding: 20px 0;
            background-color: #fff;
            border-radius: 4px;
        }
    }
</style>

<template>
    <div>
        <Card>
            <div class="settlement-rules">
                <p>结算规则：</p>
                <p>1.每月收入在次月7号之后才可进行提现。</p>
                <p>2.当月结算将在次月7号之后才可以申请提现。</p>
                <p>3.客服打款将在每月20日进行统一处理，20日后提交的申请，将在次月处理。</p>
                <p>4.提供发票者，需在20日前将发票寄达，否则将在次月进行处理。</p>
            </div>
            <div class="settlement-container">
                <div class="container-title">
                    <DatePicker type="year" size="large" @on-change="dateChange" :placeholder="String(currentYear)" style="width: 200px"></DatePicker>
                    <div class="earning">
                        <h2><span>总收入：{{RewardMoney}}</span><span style="margin-left: 16px;">余额：{{Money}}</span></h2>
                    </div>
                </div>
                <div class="month-list-box">
                    <template v-for="(item, index) in settleList">
                        <div class="list-container-box">
                            <Row class-name="list-box" type="flex" align="middle" justify="space-between">
                                <Col span="14">
                                    <Row class-name="left" type="flex" align="middle" justify="space-between">
                                        <Col class-name="year">{{parseInt(item.Month)}}月</Col>
                                        <Col>
                                            <p>总收入</p>
                                            <p class="blue">{{item.RewardMoney}}</p>
                                        </Col>
                                        <Col>
                                            <p>订单数</p>
                                            <p>{{item.Mete}}</p>
                                        </Col>
                                        <Col>
                                            <p>状态</p>
                                            <p>
                                                {{`${item.Status === '0' ? '未提现' : ''}`}}
                                                {{`${item.Status === '1' ? '已提取' : ''}`}}
                                                {{`${item.Status === '2' ? '申请提现' : ''}`}}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row class-name="right" type="flex" align="middle" justify="space-between">
                                        <p class="blue" @click="startWithdraw(item)" v-if="item.Status === '0'">提现</p>
                                        <p class="blue" @click="settleOperate(item.Month, 'progress')" v-if="item.Status !== '0'">提现进度</p>
                                        <p class="blue" @click="settleOperate(item.Month, 'invoice')" v-if="item.Status !== '0'">发票信息</p>
                                        <p class="blue" @click="consumeExtra = item.UserID">收入详情</p>
                                    </Row>
                                </Col>
                            </Row>
                            <div class="list-step" :ref="item.Month" v-if="item.GetAgentsWithdrawCash">
                                <Steps :current="item.GetAgentsWithdrawCash.current">
                                    <Step title="发起提现" content=""></Step>
                                    <Step title="发票已签收" content="" v-if="item.GetAgentsWithdrawCash.InvoiceStatus !== '0'"></Step>
                                    <Step title="财务打款" content=""></Step>
                                </Steps>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </Card>
        <div class="userconsume-box" v-if="consumeExtra">
            <div style="background-color: #fff; padding: 20px; border-radius: 4px;">
                <div class="userconsume-title">
                    <h2>{{consumeExtra.UserName}}消费记录</h2>
                    <Icon type="ios-close-circle-outline" size="24" @click="consumeExtra=''" style="cursor: pointer;" />
                </div>
                <UserConsume :extra="consumeExtra"></UserConsume>
            </div>
        </div>
        <div class="invoice-details" v-if="WithdrawCash || startWithdrawCash">
            <div style="background-color: #fff; padding: 20px; border-radius: 4px;">
                <div class="invoice-details-title">
                    <h2></h2>
                    <Icon type="ios-close-circle-outline" size="24" @click="closeInvoice" style="cursor: pointer;" />
                </div>
                <InvoiceDetails :WithdrawCash="WithdrawCash" :startWithdrawCash="startWithdrawCash" @closeInvoice="closeInvoice"></InvoiceDetails>
            </div>
        </div>
        <Spin fix v-if="spinShow">
            <img src="@/images/load.gif" style="width:40px;"/>
            <p style="padding-top:20px;">正在为您加载中</p>
        </Spin>
    </div>
</template>

<script>
import util from "@/libs/util.js";
import UserConsume from './components/UserConsume.vue';
import InvoiceDetails from './components/InvoiceDetails.vue';
export default {
    components: {
        UserConsume, InvoiceDetails
    },
    data() {
        return {
            spinShow: false,

            RewardMoney: '',
            Money: '',

            settleList: [],

            Year: (new Date()).getFullYear(),

            consumeExtra: '',

            WithdrawCash: '',

            startWithdrawCash: ''
        }
    },
    computed: {
        currentYear() {
            let currentYear = (new Date()).getFullYear();
            return currentYear;
        },
        currentMonth() {
            let currentMonth = (new Date()).getMonth() + 1;
            return currentMonth;
        },
        currentDay() {
            let currentDay = (new Date()).getDate();
            return currentDay;
        }
    },
    methods: {
        closeInvoice() {
            this.WithdrawCash = '';
            this.startWithdrawCash = '';
        },
        agentsDetails() {
            const UserInfo = util.parseInfo();
            util.http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx',
                params: {
                    action: 'GetMeberAgentsList',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    TheUserID: UserInfo.AdminID
                }
            })
            .then((values) => {
                console.log(values)
                if (values.S === '1') {
                   this.RewardMoney = values.UserList[0].RewardMoney; 
                   this.Money = values.UserList[0].Money;
                }
            });
        },
        dateChange(year) {
            console.log(year);
            this.settleList = [];
            this.Year = year;
            this.getSettleList(year);
        },
        getSettleList(year) {
            const UserInfo = util.parseInfo();
            util.http({
                url: '/Interface/MarketAdmin/MarketMoneyApi.ashx',
                params: {
                    action: 'GetAgentsMonthlyBilling',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    TheUserID: UserInfo.AdminID,
                    Year: year
                }
            })
            .then((values) => {
                console.log('月结算', values)
                if (values.S === '1') {
                    this.settleList = values.UserLogList;
                }
            });
        },
        async settleOperate(Month, operate) {
            console.log(Month, operate);
            const UserInfo = util.parseInfo();

            if (operate === 'progress') {
                let settleList = this.settleList;

                let WithdrawCash = await this.GetAgentsWithdrawCash(`${this.Year}-${Month}`);
                console.log(WithdrawCash);

                if (WithdrawCash.S === '1') {
                    let GetAgentsWithdrawCash = WithdrawCash.WithdrawCashList[0];
                    this.settleList = settleList.map((item, index) => {
                        if (item.Month === Month) {
                            let current = GetAgentsWithdrawCash.InvoiceStatus === '3' ? 2 : (
                                GetAgentsWithdrawCash.Status === '0' ? 1 : (
                                    GetAgentsWithdrawCash.Status === '3' ? (GetAgentsWithdrawCash.InvoiceStatus !== '0' ? 3 : 2) : 1
                                )
                            );
                            return Object.assign(item, {
                                GetAgentsWithdrawCash: {
                                    InvoiceStatus: GetAgentsWithdrawCash.InvoiceStatus,
                                    current: current
                                }
                            });
                        } else {
                            return item;
                        }
                    });
                } else {
                    this.$Message.error(WithdrawCash.msg);
                }
            } else if (operate === 'invoice') {
                this.startWithdrawCash = '';

                // 提现信息
                let WithdrawCash = await this.GetAgentsWithdrawCash(`${this.Year}-${Month}`);
                console.log(WithdrawCash);

                if (WithdrawCash.S === '1') {
                    this.WithdrawCash = WithdrawCash.WithdrawCashList[0];
                } else {
                    this.$Message.error(WithdrawCash.msg);
                } 
                console.log(WithdrawCash);
            }  
        },
        GetAgentsWithdrawCash(Month) {
            const UserInfo = util.parseInfo();
            return util.http({
                url: '/Interface/MarketAdmin/MarketMoneyApi.ashx',
                params: {
                    action: 'GetAgentsWithdrawCash',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    TheUserID: UserInfo.AdminID,
                    Month: Month
                }
            })
        },
        startWithdraw(data) {
            console.log(data);
            this.WithdrawCash = '';
            let Month = data.Month;
            this.startWithdrawCash = Object.assign(data, {
                Month: `${this.Year}-${Month}`
            });
        }
    },
    mounted() {
        this.getSettleList(String(this.currentYear));
        this.agentsDetails();
        console.log(this.currentYear, this.currentMonth, this.currentDay);
    },
};
</script>

