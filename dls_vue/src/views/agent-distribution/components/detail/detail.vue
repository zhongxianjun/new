<style lang="less" scoped>
@import "./detail.less";
</style>

<template>
  <div class="detail">
    
    <div class="header">
      <Row type="flex" justify="start">
        <Col span="12" class="left">
          <div class="userinfo">
            <span>
              <Icon type="md-person" size="24" color="#fff"></Icon>
            </span>
            <div class="infotext">
              <h3>{{accountInfo.UserName}}</h3>
              <p>ID：{{accountInfo.UserID}}</p>
            </div>
          </div>
          <Row type="flex" justify="start" class="left-bottom">
            <Col span="8">加入时间：{{accountInfo.RegDate}}</Col>
            <Col span="8">代理等级：{{accountInfo.GroupName}}</Col>
            <Col span="8">提成比例：{{accountInfo.Ratio*100}}%</Col>
          </Row>
        </Col>
        <Col span="4">
          <div class="content">
            <h1>{{accountInfo.Money}}</h1>
            <p>账户余额</p>
          </div>
        </Col>
        <Col span="4">
          <div class="content">
            <h1>{{accountInfo.RewardMoney}}</h1>
            <p>总收入</p>
          </div>
        </Col>
        <Col span="4">
          <div class="content">
            <h1>{{accountInfo.InviteAt}}</h1>
            <p>用户总数</p>
          </div>
        </Col>
      </Row>
    </div>

    <div class="detailedInfo" style="font-size: 14px;">
      <div class="headlines">
        详细信息
      </div>
      <div class="contact">
        <div class="title"><span>联系方式</span><i v-if="editorState" @click="showPopUp(1, true)">编辑</i></div>
        <div class="infoContent">
          <div class="content">
            <p>联系方式：{{accountInfo.Mobile ? accountInfo.Mobile : '--'}}</p>
            <p>地址：{{accountInfo.Address ? accountInfo.Address : '--'}}</p>
          </div>
        </div>
      </div>
      <div class="financialInfo">
        <div class="title">
          <span>财务信息</span>
          <i v-if="editorState" @click="showPopUp(2, true)">
            {{JSON.stringify(financInfo) === '{}' ? '新增' : '编辑'}}
          </i>
        </div>
        <div class="infoContent" v-if="JSON.stringify(financInfo) !== '{}'">
            <div class="content">
              <p>财务对象：{{`${financInfo.AccountType === '1' ? '个人' : ''}${financInfo.AccountType === '2' ? '企业' : ''}`}}</p>
              <p>
                {{`${financInfo.AccountType === '1' ? '开户人姓名' : (financInfo.AccountType === '2' ? '企业名称' : '开户人姓名/企业名称')}`}}：{{financInfo.Cardholder}}
              </p>
            </div>
            <div class="content">
              <p>卡号：{{financInfo.CardNumber}}</p>
              <p>开户行：{{financInfo.AccountBank}}</p>
            </div>
            <div class="content" v-if="financInfo.AccountType === '2'">
              <p>发票类型：{{financInfo.InvoiceType == 0 ? '无发票' : ''}}{{financInfo.InvoiceType == 1? '普通增值税': ''}}{{financInfo.InvoiceType == 2 ? '增值税专用': ''}}</p>
              <p>税号：{{financInfo.TaxID !== '0' ? financInfo.TaxID : '--'}}</p>
            </div>
        </div>
        <div class="infoContent" v-if="JSON.stringify(financInfo) === '{}'">
          <div class="content">暂未设置</div>
        </div>
      </div>
      <div class="safe" v-if="editorState">
        <div class="title"><span>安全设置</span><i @click="showPopUp(3, true)">修改密码</i></div>
      </div>
    </div>

    <div class="withdrawal">
      <div class="headlines">
        提现进度
      </div>
      <div class="container">
        <template v-for="(item, index) in withdrawals">
              <div class="content">
                <div class="top">
                  <div class="text">
                    {{item.ExMonth}}结算：{{item.RewardMoney}}元
                  </div>
                  <Steps :current="item.InvoiceStatus === '3' ? 2 : (
                    item.Status === '0' ? 1 : (
                      item.Status === '3' ? (item.InvoiceStatus !== '0' ? 3 : 2) : 1
                    )
                  )">
                    <Step content="发起提现"></Step>
                    <Step content="发票已签收" v-if="item.InvoiceStatus !== '0'"></Step>
                    <Step content="财务打款"></Step>
                  </Steps>
                </div>
              </div>
        </template>
        <div class="noData" v-if="!withdrawals.length">
          暂无数据
        </div>
      </div>
    </div>

    <div class="record">
      <div class="title">
        <div class="titleList" v-for="(item,i) in record" :class="cur==i?'cur':''" @click="addClass(i)">{{item}}</div>
      </div>
      <div class="table">
        <Table :columns="cur == 0? loginColumns: operationColumns" :data="cur == 0? loginData: operationData" :loading="loading"></Table>
        <Page :total="total" v-if="total >= 11" class-name="page" @on-change="paging"></Page>
      </div>
    </div>

    <popUp v-if="show"  @showPopUp="showPopUp" @refresh="intoDetailInfo" :ID="ID" :status="status" :financInfo="financInfo"></popUp>
  </div>
</template>

<script>
import util from "../../../../libs/util.js";
import popUp from "../popUp/popUp.vue";
export default {
  components: {
    popUp
  },
  data() {
    return {
      loginColumns: [
        {
          title: '登录时间',
          key: 'time',
          width: 383,
          align: 'left'
        },
        {
          title: '登录IP',
          key: 'IP',
          align: 'left'
        }
      ],
      loginData: [
        
      ],
      operationColumns: [
        {
          title: '行为',
          key: 'behavior',
          width: 383,
          align: 'left'
        },
        {
          title: '操作时间',
          key: 'time',
          align: 'left'
        }
      ],
      operationData: [

      ],
      total: 0,
      record: ['登录记录', '操作记录'],
      cur: 0,
      //编辑显示状态 管理员隐藏
      editorState: true,
      // 表格变量
      loading: false,
      //传给弹出层组件的值
      show: false,
      ID: '',
      status: {
        pwdState: true,
        addressState: false,
        financialState: false
      },
      //用户信息
      financInfo: {},
      accountInfo: {},
      //提现审核 数据状态
      withdrawals: [] ,
      
      currentMonth: '',
      Month: ''
    };
  },
  watch: {
    detailInfo(newVal, oldVal){
      console.log(newVal, oldVal, 'vuex信息');
      this.intoDetailInfo();
    }
  },
  async created() {
    
  },
  mounted() {
    this.intoDetailInfo();

  },
  computed: {
    detailInfo() {
      return this.$store.state.app.detailInfo;
    }
  },
  methods: {
    //开启 弹出层
    showPopUp(num,showState) {
      this.show = true;
      this.show = showState;
      switch (num) {
        case 1:
          this.status.addressState = true;
          this.status.financialState = false;
          this.status.pwdState = false;
          break;
        case 2:
          this.status.addressState = false;
          this.status.financialState = true;
          this.status.pwdState = false;
          break;
        case 3:
          this.status.addressState = false;
          this.status.financialState = false;
          this.status.pwdState = true;
          break;
      }
    },
    //分页
    paging(e){
      this.recordTable(1, e, 10);
    },
    // 登录 操作 动态添加class并数据渲染
    addClass(i){
      this.cur = i;
      if(i == 0){
        this.recordTable(1, 1, 10);
      } else {
        this.recordTable(2, 1, 10);
      }
    },
    //详情页整体信息渲染
    async intoDetailInfo() {
      if (this.detailInfo.ID) {
        this.editorState = false;
      } else {
        this.editorState = true;
      }

      this.intoUserInfo();

      this.withdrawCash();

      this.recordTable(1, 1, 10);

      this.intoFinanceInfo();
    },
    // 用户信息渲染 函数
    async intoUserInfo (){
      this.accountInfo = {};
      if(!this.detailInfo.ID){ //代理商 登录的详情页
        var { UserName, GroupID, AdminID } = util.parseInfo();
        this.ID = AdminID;
      } else {  //管理员 登录的详情页
        console.log(this.detailInfo,'详情信息');
        var { ID } = this.detailInfo;
        var UserName = ID;
        var GroupID = '';
        this.ID = ID;
      }
      let data = await this.GetMeberAgentsList();
      console.log( '代理商详情：', data);

      if (data.S == 1) {
        this.accountInfo = data.UserList[0];
        console.log(this.accountInfo);
      }
    },
    // 用户财务信息渲染 函数
    async intoFinanceInfo () {
      this.financInfo = {};
      let data = await this.GetUserFinanceInfo();
      console.log('财务信息', data);
      if (data.S == 1) {
        this.financInfo = data.UserFinanceList[0];
      }
    },
    // 提现审核 数据渲染 函数
    async withdrawCash() {
      let data = await this.GetAgentsWithdrawCash();
      console.log('提现审核', data);

      if (data.S == 1) {
        
        this.withdrawals = data.WithdrawCashList;
        
      } else {
       
      }
    },
    // 表格数据渲染 函数
    async recordTable(InfoID, CurrentPage, PageSize){
      this.loginData = [];
      this.operationData = [];
      this.loading = true;
      let data = await this.GetUserLog(InfoID, CurrentPage, PageSize);
      this.loading = false;

      console.log(data);
      if(data.S == 1){
        this.total = parseInt(data.CountNum);
        data.UserLogList.map((elem,k)=>{
          this.loginData.push({
            time: elem.AddDate,
            IP: elem.UserIP
          });
          this.operationData.push({
            behavior: elem.CopyFrom,
            time: elem.AddDate
          });
        })
      }
      
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
                    TheUserID: this.ID,
                    CurrentPage: 1,
                    PageSize: 10
                }
            }).then(res => {
                resolve(res);
            });
        });
    },
    //获取用户操作日志 接口调用 函数封装
    GetUserLog(InfoID, CurrentPage, PageSize){
      const {AdminID, UserToken} = util.parseInfo();
      return new Promise((resolve, reject) => {
        this.$http({
          url:'/Interface/MarketAdmin/MarketMemberListApi.ashx?',
          params: {
            action: "GetUserLog",
            UserID: AdminID,
            UserToken,
            TheUserID: this.ID,
            InfoID,
            CurrentPage,
            PageSize
          }
        }).then(res => {
            resolve(res);
        });
      })
    },
    //获取获取提现审核数据 接口调用 函数封装
    GetAgentsWithdrawCash (){
      const {AdminID, UserToken} = util.parseInfo();
      return new Promise((resolve, reject) => {
        this.$http({
          url:'/Interface/MarketAdmin/MarketMoneyApi.ashx?',
          params: {
            action: "GetAgentsWithdrawCash",
            UserID: AdminID,
            UserToken,
            TheUserID: this.ID,
            CurrentPage: '1',
            PageSize: '50'
          }
        }).then(res => {
            resolve(res);
        });
      })
    },
    //获取获取用户财务信息 接口调用 函数封装
    GetUserFinanceInfo() {
      const {AdminID, UserToken, UserName} = util.parseInfo();
      return new Promise((resolve, reject) => {
        this.$http({
          url:'/Interface/MarketAdmin/MarketMemberListApi.ashx?',
          params: {
            action: "GetUserFinanceInfo",
            UserID: AdminID,
            UserToken,
            TheUserID: this.ID,
            UserName
          }
        }).then(res => {
          resolve(res);
        });
      })
    }
  }
};
</script>

<style lang="less">

</style>
