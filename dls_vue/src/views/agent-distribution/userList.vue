<style lang="less" scoped>
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
    
</style>

<template>
  <div>
    <Card>
        <Table border ref="selection" :columns="tabColumns" :data="tabData"></Table>
        <div class="page-box" style="text-align: center; margin: 20px 0;">
            <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="changePage" show-elevator></Page>
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
    <Spin fix v-if="spinShow">
        <img src="@/images/load.gif" style="width:40px;"/>
        <p style="padding-top:20px;">正在为您加载中</p>
    </Spin>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import urlencode from 'urlencode';
import UserConsume from './components/UserConsume.vue';
export default {
    components: {
        UserConsume
    },
    data() {
        return {
            spinShow: false,
            currentPage: 1,
            pageSize: null,
            total: null,

            tabColumns: [],
            tabData: [],

            consumeExtra: '',
        };
    },
    computed: {

    },
    methods: {
        changePage (e) {
            console.log(e);
            this.currentPage = e;
            this.memberList = [];
            this.init();
        },
        loadInviteList() {
            const UserInfo = util.parseInfo();
            return util.http({
                url: '/Interface/MarketAdmin/MarketUserApi.ashx',
                params: {
                    action: 'GetInviterUserList',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    CurrentPage: this.currentPage,
                    PageSize: '20',
                    OrderBy: 'UserID'
                }
            }) 
            .then((values) => {
                return values;
            });
        },
        async init() {
            this.spinShow = true;

            this.tabColumns = [
                {
                    title: '用户名',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '手机号',
                    key: 'phone',
                    align: 'center'
                },
                {
                    title: '邀请人数',
                    key: 'invite',
                    align: 'center'
                },
                {
                    title: '升级会员数量',
                    key: 'upgrade',
                    align: 'center'
                },
                {
                    title: '奖励金额',
                    key: 'award',
                    align: 'center'
                },
                {
                    title: '会员组别',
                    key: 'group',
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#419aff'
                                },
                                on: {
                                    click: () => {
                                        console.log(params);
                                        this.consumeExtra = params.row.UserID;
                                    }
                                }
                            }, '查看消费记录')
                        ]);
                    }
                }
            ];

            let inviteList = await this.loadInviteList();

            console.log(inviteList);
            if (inviteList.S === '1') {
                this.pageSize = parseInt(inviteList.PageSize);
                this.total = parseInt(inviteList.CountNum);
                this.tabData = inviteList.UserList.map((item, index) => {
                    return Object.assign(item, {
                        name: item.UserName,
                        id: item.UserID,
                        phone: item.Mobile,
                        invite: item.InviterNum,
                        upgrade: item.UpgradeNum,
                        award: item.RewardMoney,
                        group: `${item.GroupID === '2' ? '普通会员' : ''}${item.GroupID === '17' ? '超级会员' : ''}${item.GroupID === '24' ? 'VIP' : ''}`
                    });
                });
            }
            this.spinShow = false;
        }
    },
    mounted() {
        this.init();
    },
};
</script>

