<style lang="less" scoped>
@import "./withdrawal.less";
</style>

<template>
  <div class="widthdrawal">
    <div class="content">
      <Card class="card">
        <div class="header">
          <Row :gutter="10" class="btn">
            <Col><Button @click="remittance">打 款</Button></Col>
            <Col><Button @click="refuse">拒 绝</Button></Col>
          </Row>
          <Row :gutter="8" class="search">
            <Input placeholder="手机号查询">
              <span slot="append">
                <Button type="primary" icon="ios-search" @click="search"></Button>
              </span>
            </Input>
          </Row>
        </div>
        <div class="table">
          <Table ref="selection" :columns="columns" :data="TableData" :loading="loading" @on-selection-change="handleRowChange"></Table>
          <Page :total="total" v-if="total >= 11" class-name="page" @on-change="paging" ></Page>
        </div>
      </Card>
    </div>
    <div class="copyright">
      Copyright © 长沙求知信息技术有限公司
    </div>
  </div>
</template>

<script>
import util from "../../libs/util.js";
export default {
  name: "withdrawal-audit",
  data() {
    return {
      columns: [
          {
              type: 'selection',
              width: 60,
              align: 'center'
          },
          {
              title: '用户名',
              key: 'name',
              align: 'center'
          },
          {
              title: '手机号',
              key: 'phone',
              align: 'center'
          },
          {
              title: '账户状态',
              key: 'state',
              align: 'center'
          },
          {
              title: '申请时间',
              key: 'time',
              align: 'center',
              "sortable": true
          },
          {
              title: '提现金额',
              key: 'withdrawal',
              align: 'center'
          },
          {
              title: '税费',
              key: 'TaxesFees',
              align: 'center'
          },
          {
              title: '打款金额',
              key: 'amount',
              align: 'center'
          },
          {
              title: '打款渠道',
              key: 'channel',
              align: 'center',
              filters: [
                  {
                      label: '微信',
                      value: 1
                  },
                  {
                      label: '支付宝',
                      value: 2
                  }
              ],
              filterMultiple: false,
              filterMethod (value, row) {
                if (value === 1) {
                    return row.channel == '微信';
                } else if (value === 2) {
                    return row.channel == '支付宝';
                }
              }
          },
          {
              title: '打款账号',
              key: 'account',
              align: 'center'
          },
          {
              title: '操作',
              key: 'screen',
              align: 'center',
              filters: [
                  {
                      label: '未审核',
                      value: 1
                  },
                  {
                      label: '已审核',
                      value: 2
                  },
                  {
                      label: '审核未通过',
                      value: 3
                  },
                  {
                      label: '已发放',
                      value: 4
                  }
              ],
              filterMultiple: false,
              filterMethod (value, row) {
                if (value === 1) {
                    return row.screen == '未审核';
                } else if (value === 2) {
                    return row.screen == '已审核';
                } else if (value === 3) {
                    return row.screen == '审核未通过';
                } else{
                    return row.screen == '已发放';
                }
              },
              render: (h, params) => {
                  return h('Select', {
                    props: {
                        value: params.row.screen,
                        placeholder: params.row.screen
                    },
                    on: {
                        'on-change': (e) => {
                            this.bulkChanges();
                            this.Table(this.CurrentPage, 10);
                            params.row.screen = e;
                        }
                    }
                },[
                    h('Option',{
                        props: {
                            value: '未处理'
                        }
                    }),
                    h('Option',{
                        props: {
                            value: '已处理'
                        }
                    }),
                    h('Option',{
                        props: {
                            value: '拒绝'
                        }
                    })
                ]);
              }
          },
          {
              title: '发票状态',
              key: 'invoiceState',
              align: 'center',
              render: (h, params) => {
                  return h('Select', {
                    props: {
                        value: params.row.invoiceState,
                        placeholder: params.row.invoiceState
                    },
                    on: {
                        'on-change': (e) => {
                            var result  = '';
                            switch (e) {  //0：无发票,1:有发票,3收到发票
                                case '无发票':
                                    result = '0';
                                    break;
                                case '有发票':
                                    result = '1';
                                    break;
                                case '收到发票':
                                    result = '3';
                                    break;
                            }
                            this.modifyInvoiceInfo(params.row.ID, result);
                            this.Table(this.CurrentPage, 10);
                            params.row.invoiceState = e;
                        }
                    }
                },[
                    h('Option',{
                        props: {
                            value: '无发票'
                        }
                    }),
                    h('Option',{
                        props: {
                            value: '未收到发票'
                        }
                    }),
                    h('Option',{
                        props: {
                            value: '已收到发票'
                        }
                    })
                ]);
              }
          },
          {
              title: '发票号',
              key: 'invoiceNum',
              align: 'center'
          }
      ],
      TableData: [
        //  信息填入模板
      ],
      total: 0,
      loading: false,
      CurrentPage: 0,
      currentRow: ''
    };
  },
  methods: {
    
  },
  beforeCreate(){
    
  },
  created() {
   
  },
  mounted() {
    this.Table(1, 10);
  },
  methods: {
    // 分页点击事件
    paging(value){
        this.Table(value, 10);
    },


    //批量打款
    remittance(){
        this.bulkChanges(3);
        this.Table(this.CurrentPage, 10);
    },
    //批量拒绝
    refuse(){
        this.bulkChanges(4);
        this.Table(this.CurrentPage, 10);
    },
    //多选事件
    handleRowChange(currentRow){
        currentRow.map((item,k)=>{
            this.currentRow += item.ID+',';
        });
        let len = this.currentRow.length - 1;
        this.currentRow = this.currentRow.substring(1,len);
    },
    //批量修改 函数
    async bulkChanges(PaymentSta){
        let data = await this.EditWithdrawCash(PaymentSta);
        if(data.S == 1){
            this.$Message.success(data.msg);
        }else{
            this.$Message.error(data.msg);
        }
    },
    //批量修改提现数据状态 接口调用 函数封装
    EditWithdrawCash(PaymentSta){   //3：已打款 ,4：拒绝
        const {AdminID, UserToken} = util.parseInfo();
        return new Promise((resolve, reject)=>{
            this.$http({
                url: '/Interface/MarketAdmin/MarketMoneyApi.ashx?',
                params: {
                    action: 'EditWithdrawCash',
                    UserID: AdminID,
                    UserToken,
                    IdStr: this.currentRow,
                    PaymentSta
                }
            }).then((res)=>{
                resolve(res);
            })
        })
    },


    // 修改发票信息 函数
    async modifyInvoiceInfo(Id, InvoiceStatus){
        let data = await this.EditWithdrawCashInvoice(Id, InvoiceStatus);
        if(data.S == 1){
            this.$Message.success(data.msg);
        } else {
            this.$Message.error(data.msg);
        }
    },
    //修改发票信息 接口调用 函数封装
    EditWithdrawCashInvoice(Id, InvoiceStatus){
        const {AdminID, UserToken} = util.parseInfo();
        return new Promise((resolve, reject)=>{
            this.$http({
                url: '/Interface/MarketAdmin/MarketMoneyApi.ashx?',
                params: {
                    action: 'EditWithdrawCashInvoice',
                    UserID: AdminID,
                    UserToken,
                    Id,
                    InvoiceStatus
                }
            }).then((res)=>{
                resolve(res);
            })
        })
    },
    
    
    //表格数据渲染 函数
    dataRender(elem){
        var Locked = '';
        var AccountType = '';
        var Status = '';
        var InvoiceStatus = '';

        switch (elem.Locked) {  //0正常, 1锁定 ,2待审核,3待激活
            case "0":
                Locked = '正常';
                break;
            case "1":
                Locked = '锁定';
                break;
            case "2":
                Locked = '待审核';
                break;
            case "3":
                Locked = '待激活';
                break;
        }
        switch (elem.AccountType) { //1：微信,2：支付宝, 3:银联
            case '1':
                AccountType = '微信';
                break;
            case '2':
                AccountType = '支付宝';
                break;
            case '3':
                AccountType = '银联';
                break;
        }
        switch (elem.Status) {  //0：申请提现, 3：已打款 ,4：拒绝
            case '0':
                Status = '申请提现';
                break;
            case '3':
                Status = '已打款';
                break;
            case '4':
                Status = '拒绝';
                break;
        }
        switch (elem.InvoiceStatus) {  //0：无发票,1:有发票,3收到发票
            case '0':
                InvoiceStatus = '无发票';
                break;
            case '1':
                InvoiceStatus = '有发票';
                break;
            case '3':
                InvoiceStatus = '收到发票';
                break;
        }
        
        this.TableData.push({
            name: elem.UserName,
            phone: elem.Mobile,
            state: Locked,    //0正常, 1锁定 ,2待审核,3待激活
            time: elem.ExMonth,
            withdrawal: elem.RewardMoney,
            TaxesFees: elem.TaxRate,
            amount: elem.TaxMoney,
            channel: AccountType,  //1：微信,2：支付宝, 3:银联
            account: elem.Account,
            screen: Status,    //0：申请提现, 3：已打款 ,4：拒绝
            invoiceState: InvoiceStatus,   //0：无发票,1:有发票,3收到发票
            invoiceNum: elem.InvoiceNo,
            ID: elem.ID
        });
    },
    //调用 表格数据渲染函数 进行数据渲染
    async Table(CurrentPage, PageSize){
        this.loading = true;
        this.TableData = [];
        this.CurrentPage = CurrentPage;
        let data = await this.GetAgentsWithdrawCash(CurrentPage, PageSize);
        this.loading = false;

        if(data.S == 1) {
            this.total = parseInt(data.CountNum);
                
            data.WithdrawCashList.map((elem,i)=>{
                this.dataRender(elem);
            });
        }
    },
    //获取提现审核数据 接口调用 函数封装
    GetAgentsWithdrawCash(CurrentPage, PageSize){
        const {AdminID, UserToken} = util.parseInfo();
        return new Promise((resolve, reject)=>{
            this.$http({
                url: '/Interface/MarketAdmin/MarketMoneyApi.ashx?',
                params: {
                    action: 'GetAgentsWithdrawCash',
                    UserID: AdminID,
                    UserToken,
                    CurrentPage,
                    PageSize
                }
            }).then((res)=>{
                resolve(res);
            })
        })
    },

    
    //搜索功能 函数
    async search(){
        if(this.value !== ''){
            this.total = 1;
            this.loading = true;
            this.TableData = [];

            let data = await this.GetAgentsWithdrawCash(1, 10);
            this.loading = false;

            if(data.S == 1){
                let elem = data.WithdrawCashList[0];
                this.dataRender(elem);
            }
        } else {
            this.Table(1, 10);
        }

    },
  }
};
</script>

<style>
.ivu-table-wrapper{
  border: 0;
}
.ivu-input-group-append{
    padding: 4px 5px;
}
.ivu-input{
    height: 40px;
}
.ivu-btn{
    height: 39px;
}
</style>