<style lang="less" scoped>
  .box {
    font-size: 14px; line-height: 2;
    pre {
      margin: 0;
      display: inline-block;
      font-family: inherit;
    }
  }
</style>

<template>
  <div class="box">
       <Tabs type="card" :value="name" :animated="false" @on-click="tabChange">
          <TabPane name="firm" label="提供发票" >
            <div>
              <p>账单结算：{{ExMonth}}</p>
              <p>您选择了：<pre>提供发票      将扣除税点：0%</pre></p>
              <p>实际付款金额：{{RewardMoney}}</p>
              <p>收款账户：{{CardNumber}}</p>
              <p>收款名称：{{Cardholder}}</p>
              <p style="color: #a5a5a5;">每月20日统一处理，请耐心等待。</p>
            </div>
            <div style="margin-top: 12px;">
              <p>发票要求</p>
              <p>发票抬头：长沙求知信息技术有限公司</p>
              <p>求知税号：9415646514561N</p>
              <p>发票类型：增值税普通发票</p>
              <p>开票内容：信息服务费/技术服务费</p>
            </div>
            <div style="margin-top: 12px;">
              <p>邮寄地址</p>
              <p>地址湖南省长沙市xx区xxxxxxxx</p>
              <p>邮编：410000</p>
              <p>电话：150 0000 0000</p>
              <p>收件人：长沙求知</p>
              <div style="display: flex;">
                发票号：
                <div style="width: 500px;" >
                    <Input v-model="InvoiceNo" size="large" placeholder="多张发票以英文逗号隔开，如“25415278,25415278”"  />
                    <aside>请在发票开出后填写此信息。</aside>
                </div>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <Button @click="EditWithdrawCashInvoice" type="primary" size="large" style="margin-right: 30px; width: 86px;">确定</Button>
              <Button size="large" style="width: 86px;" @click="closeInvoice">取消</Button>
            </div>
          </TabPane>
          <TabPane name="person" label="不提供发票" >
            <div>
              <p>账单结算：</p>
              <p>您选择了：<pre>不提供发票      将扣除税点：{{parseFloat(TaxRate) * 100 + '%'}}</pre></p>
              <p>实际付款金额：{{TaxMoney}}</p>
              <p>收款账户：{{CardNumber}}</p>
              <p>收款名称：{{Cardholder}}</p>
              <p style="color: #a5a5a5;">每月20日统一处理，请耐心等待。</p>
            </div>
            <div style="margin-top: 20px;">
              <Button @click="EditWithdrawCashInvoice" type="primary" size="large" style="margin-right: 30px; width: 86px;">确定</Button>
              <Button size="large" style="width: 86px;" @click="closeInvoice">取消</Button>
            </div>
          </TabPane>
      </Tabs>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import urlencode from 'urlencode';
export default {
    props: {
      WithdrawCash: {
        default: null
      },
      startWithdrawCash: {
        default: null
      }
    },
    components: {

    },
    data() {
        return {
          name: 'firm', // person

          FinanceInfo: '',

          ExMonth: '',
          RewardMoney: '',
          TaxMoney: '',
          TaxRate: '6%',

          InvoiceNo: '',

          CardNumber: '',
          Cardholder: '',
        }
    },
    computed: {

    },
    methods: {
        closeInvoice() {
          this.$emit('closeInvoice');
        },
        tabChange(name) {
          console.log(name);
          this.name = name;
        },
        async EditWithdrawCashInvoice() {
          let name = this.name;
          console.log(name);
          const UserInfo = util.parseInfo();
          let FinanceInfo = this.FinanceInfo;
          let WithdrawCash = this.WithdrawCash;

          let GetMeberAgentsList = await this.GetMeberAgentsList();
          if (!(GetMeberAgentsList.UserList && GetMeberAgentsList.UserList[0].Mobile)) {
            this.$Message.success('请先填写联系方式');
            return;
          }

          let startWithdrawCash = this.startWithdrawCash;
          if (startWithdrawCash) {
              console.log('提现', startWithdrawCash);
              let url = '/Interface/MarketAdmin/MarketMoneyApi.ashx';
              let params = {
                action: 'AddUserWithdrawCash',
                UserID: UserInfo.AdminID,
                UserToken: UserInfo.UserToken,
                TheUserID: UserInfo.AdminID,
                AccountType: '3',
                Account: FinanceInfo.CardNumber,
                Month: startWithdrawCash.Month,
                UserName: FinanceInfo.UserName,
                Mobile: GetMeberAgentsList.UserList[0].Mobile
              };
              if (name === 'firm') {
                params = Object.assign(params, {
                  Invoice: '1'
                });
              } else if (name === 'person') {
                params = Object.assign(params, {
                  Invoice: '0'
                });
              }

              util.http({
                  url: url,
                  params: params
              })
              .then((values) => {
                  console.log('提现', values)
                  if (values.S === '1') {
                    this.$Message.success(values.msg);
                    
                  } else {
                    this.$Message.error(values.msg);
                  }
              });
          } else {
              // 修改发票数据
              if (!(WithdrawCash && WithdrawCash.ID)) {
                this.$Message.error('未查询到提现信息');
                return;
              }
              if ((name === 'firm') && (FinanceInfo.AccountType === '1')) {
                this.$Message.error('请先变更财务信息为企业，并完善相关资料');
                return;
              }
              
              let url = '/Interface/MarketAdmin/MarketMoneyApi.ashx';
              let params = {
                action: 'EditWithdrawCashInvoice',
                UserID: UserInfo.AdminID,
                UserToken: UserInfo.UserToken,
                Id: WithdrawCash.ID
              };

              if (name === 'firm') {
                params = Object.assign(params, {
                  InvoiceStatus: '1',
                  InvoiceNo: this.InvoiceNo
                });
              } else if (name === 'person') {
                params = Object.assign(params, {
                  InvoiceStatus: '0'
                });
              }

              util.http({
                  url: url,
                  params: params
              })
              .then((values) => {
                  console.log('修改发票信息', values)
                  if (values.S === '1') {
                    this.$Message.success(values.msg);
                    this.closeInvoice();
                  } else {
                    this.$Message.error(values.msg);
                  }
              });
          }
        },
        GetUserFinanceInfo() {
            const UserInfo = util.parseInfo();
            return util.http({
                url:'/Interface/MarketAdmin/MarketMemberListApi.ashx',
                params: {
                    action: "GetUserFinanceInfo",
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    TheUserID: UserInfo.AdminID,
                    UserName: UserInfo.UserName
                }
            })
        },
        // 获取代理商成员/详情 接口
        GetMeberAgentsList(){
            const {AdminID, UserToken} = util.parseInfo();
            console.log(util.parseInfo(), '登录信息');
            return new Promise((resolve, reject) => {
                this.$http({
                    url:'/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                    params: {
                        action: "GetMeberAgentsList",
                        UserID: AdminID,
                        UserToken,
                        TheUserID: AdminID,
                        CurrentPage: 1,
                        PageSize: 10
                    }
                }).then(res => {
                    resolve(res);
                });
            });
        },
    },
    async mounted() {
        // 财务信息
        let FinanceInfo = await this.GetUserFinanceInfo();
        console.log(FinanceInfo);
        
        if (FinanceInfo.S === '1') {
            FinanceInfo = FinanceInfo.UserFinanceList[0];
        } else {
            FinanceInfo = '';
            this.$Message.error(FinanceInfo.msg);
        } 
        this.FinanceInfo = FinanceInfo;

        let WithdrawCash = this.WithdrawCash;

        let startWithdrawCash = this.startWithdrawCash;
        console.log(startWithdrawCash);
        if (startWithdrawCash) {
            this.ExMonth = startWithdrawCash.Month;
            this.RewardMoney = startWithdrawCash.RewardMoney;
            this.TaxMoney = startWithdrawCash.TaxMoney;
        }

        if (FinanceInfo) {
          this.CardNumber = FinanceInfo.CardNumber;
          this.Cardholder = FinanceInfo.Cardholder;
        }

        if (WithdrawCash) {
          this.ExMonth = WithdrawCash.ExMonth;
          this.RewardMoney = WithdrawCash.RewardMoney;
          this.TaxMoney = WithdrawCash.TaxMoney;
          this.TaxRate = WithdrawCash.TaxRate;
        }

        if (FinanceInfo && FinanceInfo.AccountType === '1') {
          this.name = 'person';
        } else if (FinanceInfo && FinanceInfo.AccountType === '2') {
          this.name = 'firm';
        }
    }
};
</script>

