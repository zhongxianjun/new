<style lang="less" scoped>

</style>

<template>
  <div>
        <Table border ref="selection" :columns="tabColumns" :data="tabData"></Table>
        <div class="page-box" style="text-align: center; margin: 20px 0;">
            <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="changePage" show-elevator></Page>
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
export default {
    props: {
      extra: {
        type: String,
        default: null
      }
    },
    components: {

    },
    data() {
        return {
            spinShow: false,
            currentPage: 1,
            pageSize: null,
            total: null,

            tabColumns: [
              {
                    title: '用户名',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '消费时间',
                    key: 'PayDate',
                    align: 'center'
                },
                {
                    title: '购买项目',
                    key: 'Remark',
                    align: 'center'
                },
                {
                    title: '提成比例',
                    key: 'Ratio',
                    align: 'center'
                },
                {
                    title: '全价',
                    key: 'PayMoney',
                    align: 'center'
                },
                {
                    title: '收入',
                    key: 'RewardMoney',
                    align: 'center'
                }
            ],

            tabData: []

        };
    },
    computed: {

    },
    methods: {
        changePage (e) {
            console.log(e);
            this.currentPage = e;
            this.userConsume();
        },
        userConsume() {
            this.spinShow = true;
            const UserInfo = util.parseInfo();
            let TheUserID = this.extra;
            util.http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx',
                params: {
                    action: 'GetMarketLog',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    TheUserID: TheUserID,
                    CurrentPage: '1',
                    PageSize: '20'
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                   this.pageSize = parseInt(values.PageSize);
                   this.total = parseInt(values.CountNum);

                   this.tabData = values.MarketLogList.map((item, index) => {
                      return Object.assign(item, {
                          name: item.UserName,
                      });
                  });
                }
                this.spinShow = false;
            });
        },
    },
    mounted() {
        this.userConsume();
    }
};
</script>

