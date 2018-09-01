<style lang="less" scoped>
@import "../../styles/common.less";
@import "./vip.less";
</style>

<template>
    <div class="access">
    <Spin v-if="!showLoad" fix>
            <img src="@/images/load.gif" style="width:40px;"/>
            <p style="padding-top:20px;">正在为您加载中</p>
    </Spin>
        
         <Card>
          <p slot="title">
                        <Icon type="android-contact"></Icon>
                        用户充值
            </p>
           
        <Row   :style="{background:'#fff'}">
          
            <Col span="6" v-for="(item ,index) in ad" :key="index">
                <div class="access-user-con access-current-user-con">   
                    <img :src="item.url"/>
                    <p>{{item.title}}</p>
                    <span>{{item.tip}}</span>
                </div>
            </Col>
        </Row>
        <Row>
        <Col span="24"  >
        <Tabs value="name1">
            <TabPane label="VIP会员"  icon="wand" name="name1" :style="{padding:'20px'}">
                <Col span="24" :style="{marginBottom:'40px'}">
                <span>开通时长</span> 
                    <RadioGroup  type="button" @on-change="(e)=>radio(e)" v-model="radio1">
                        <Radio v-for="item in VipPrice" :key="item.OrderID" :label="item.Descript" :on-change="radio" :style="{marginLeft:'20px'}" size="large" class="radio"></Radio>
                    </RadioGroup>
                </Col>
                 <Col span="24" :style="{marginBottom:'40px'}" v-if="groupList.length>0">
                    <span>优惠券</span> 
                    <Select v-model="couponCode" @on-change="(e)=>coupNum(e)" :style="{width:'272px',marginLeft:'34px'}" placeholder="请选择优惠券" not-found-text="暂无优惠券">
                        <Option v-for="item in groupList" :value="item.CouponNum" :key="item.ID">
                            满{{parseInt(item.MinAmount)}}减{{item.Title}}&nbsp;&nbsp;
                            <span>{{item.EndDate}}过期</span>
                        </Option>
                    </Select>
                    
                </Col>
                <Col span="24" :style="{marginBottom:'40px'}">
                    <span>应付金额</span> 
                    <Button type="ghost" :style="{marginLeft:'20px'}" size="large" class="radios">{{payMoney}}元</Button>
                </Col>
               
                 <Col span="24" :style="{marginBottom:'40px'}" class="way">
                    <span >支付方式</span> 
                    <div class="btnGroup">
                        <button class="payBtn" @click="Pay(1)"  >
                            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-weixinzhifu"></use></svg>
                            <span>微信扫码支付</span>
                        </button>
                        <button  class="payBtn"  @click="Pay(3)">
                            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhifubaozhifu"></use></svg>
                            <span>支付宝支付</span>
                        </button>
                        <button  class="payBtn" v-if="parseFloat(UserInfo.Money) >= payMoney "  @click="balancePay">
                            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-yue"></use></svg>
                            <span>账户余额支付</span>
                        </button>
                    </div>
                </Col>
                 <Col span="24" :style="{color:'red'}" class="way">
                    <span >温馨提示*：虚拟支付不支持退款</span> 
                </Col>
            </TabPane>
            <TabPane label="余额充值" icon="cash"  name="name2" :style="{padding:'20px'}">
                 <Col span="24" :style="{marginBottom:'40px'}">
                <span>充值金额</span>  
                    <RadioGroup v-model="moneyNum" type="button" >
                        <Radio v-for="(item, index) in moneyNumList" :key="index" :label="item + '元'" :style="{marginLeft:'20px'}" size="large" class="radioYe"></Radio>
                         <InputNumber
                            @on-change="customNumEvent"
                            :max="10000"
                            :min="10"
                            v-model="customNum"
                            size="large"
                            :style="{marginLeft:'20px'}"
                             placeholder="自定义"
                            :formatter="value => `${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                            :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                    </RadioGroup>
                </Col>
                <Col span="24" :style="{marginBottom:'40px'}">
                    <span>账户余额</span> 
                    <Button type="ghost" :style="{marginLeft:'20px'}" size="large" class="radios">{{parseFloat(UserInfo.Money)}}.00</Button>
                </Col>
                 <Col span="24" :style="{marginBottom:'40px'}" class="way">
                    <span >支付方式</span> 
                    <div class="btnGroup">
                        <button class="payBtn" @click="Pay(2)">
                            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-weixinzhifu"></use></svg>
                            <span>微信扫码支付</span>
                        </button>
                        <button  class="payBtn"  @click="Pay(4)">
                            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhifubaozhifu"></use></svg>
                            <span>支付宝支付</span>
                        </button>
                    </div>
                </Col>
                <Col span="24" :style="{color:'red'}" class="way">
                    <span >温馨提示*：虚拟支付不支持退款</span> 
                </Col>
            </TabPane>
        
         </Tabs>
        </Col>
        </Row>
         </Card>
          <pay  
            @init="init"
            ref="pay" 
            :modal.sync="modal"
            :payUrl="payUrl"
            :OrderID="OrderID"
            :source="source" 
            :vip="true"
             ></pay>
    </div>
</template>

<script>
import pay from "../../components/pay/pay.vue";
import util from "../../libs/util.js";
export default {
  name: "vip_index",
  components: {
    pay
  },
  data() {
    return {
      ad: [
        {
          url: require("@/images/vip1.png"),
          title: "查看答案",
          tip: "解析更直观"
        },
        {
          url: require("@/images/vip2.png"),
          title: "收藏试题",
          tip: "收藏试题无上限"
        },
        {
          url: require("@/images/vip3.png"),
          title: "清除广告",
          tip: "清爽界面无广告"
        },
        {
          url: require("@/images/vip4.png"),
          title: "会员身份",
          tip: "尊贵会员标识图标"
        }
      ],
      VipPrice: [],
      groupList: [],
      customNum: 10,
      model1: "",
      radio1: "",
      payMoney: 0, //应付金额
      couponCode: "", //优惠券兑换码
      modal: false,
      payUrl: "",
      showLoad: false, //控制Loading显示隐藏
      moneyNumList: [10, 20, 30, 50, 100],
      moneyNum: "10元",
      OrderID: "",
      coupNums: "",
      source: "" //支付渠道
    };
  },
  async created() {
    //获取VIP价格表以及获取补差价资格 还有获取优惠券 只有科目才能补差价资格
    const [VipPrice, groupList] = await Promise.all([
      this.$http({
        url: "/Interface/VIPPriceApi.ashx",
        params: { action: "GetVIPPrice" },
        openCache: true
      }),
      this.updateCoupNum()
    ]);
    this.VipPrice = VipPrice.VIPPriceList; //会员价格列表

    this.radio1 = VipPrice.VIPPriceList[0].Descript; //自动返回第一条价格

    this.payMoney = VipPrice.VIPPriceList[0].Money; //设置初始化价格

    this.showLoad = true;

    console.log(VipPrice, groupList);
  },
  computed: {
    UserInfo() {
      return this.$store.state.user.UserInfo;
    }
  },
  methods: {
    async updateCoupNum() {
      let ShopCouponUserList = await util.GroupNum();
      console.log("优惠券列表", ShopCouponUserList);
      if (ShopCouponUserList) this.groupList = ShopCouponUserList;
    },
    coupNum(e) {
      this.couponCode = e;
      if (this.couponCode) {
        const [{ Title }] = this.groupList.filter(
          item => item.CouponNum === this.couponCode
        );
        console.log(Title, "总价格");
        if (Title) {
          this.coupNums = parseInt(Title);
          this.payMoney = this.VipPrice[0].Money - parseInt(Title) + ".00";
        }
      }
    },
    //余额支付
    async balancePay() {
      const [{ ID }] = this.VipPrice.filter(
        item => item.Descript === this.radio1
      );
      const data = await this.$http({
        url: "/Interface/OrderApi.ashx",
        params: {
          action: "UserBalanceUpgrade",
          VIPID: ID,
          CouponNum: this.couponCode ? this.couponCode : ""
        },
        auto: true
      });
      if (data.S == 1) {
        this.$Message.success({
          content: "恭喜您,充值成功",
          duration: 3
        });
        this.init();
        //更新用户信息
        //支付成功
      } else {
        this.$Modal.error({
          title: "购买失败",
          content: data.msg,
          duration: 3
        });
      }
    },

    //初始化支付结果
    init() {
      console.log("初始化数据");
      this.modal = false;
      this.$updateUserInfo(this); //更新用户信息
      this.OrderID = ""; //清除支付订单号
      this.payUrl = ""; //清空支付链接
      if (this.$store.state.user.time) {
        this.$store.commit("clearTime"); //清空全局定时器
      }
      if (this.couponCode) {
        this.couponCode = ""; //清空已选的优惠券信息
        this.updateCoupNum(); //更新优惠券列表
      }
    },
    //自定义当前的数值金额
    customNumEvent(e) {
      this.moneyNum = e;
    },
    radio(e) {
      const [{ Money }] = this.VipPrice.filter(
        item => item.Descript === this.radio1
      );

      this.payMoney = this.coupNums ? `${Money - this.coupNums}.00` : Money;
    },
    async Pay(source) {
      /*
    * source 代表支付渠道
    * 1 代表微信VIP充值渠道
    * 2 代表微信余额充值渠道
    * 3 代表支付宝VIP充值渠道
    * 4 代表支付宝余额充值渠道
    */
      this.modal = true;
      source == 1 || source == 2 ? (this.source = "wx") : (this.source = "zfb");

      const { UserID, UserToken } = this.$parseInfo();
      let VIPID = 0;
      let newWindow = null;
      let params = {};
      if (source == 1 || source == 3) {
        //VIP充值

        const [{ ID }] = this.VipPrice.filter(
          item => item.Descript === this.radio1
        ); //获取VIPID
        params = {
          action: "UserUpgrade",
          PaymentID: source == 1 ? 17 : 18,
          VIPID: ID,
          CouponNum: this.couponCode ? this.couponCode : ""
        };
      } else if (source == 2 || source == 4) {
        //余额充值
        params = {
          action: "UserPayonline",
          Money: parseInt(this.moneyNum),
          PaymentID: source == 2 ? 17 : 18
        };
      }
      if (this.source === "zfb") {
        newWindow = window.open("about:blank");
      }
      const { payUrl, OrderID, S, msg, Money } = await this.$http({
        url: "/Interface/OrderApi.ashx",
        params,
        auto: true
      });
      source == 1 || source == 3 ? (this.payMoney = Money) : "";
      this.OrderID = OrderID; //支付订单号

      if (source == 1 || source == 2) {
        this.payUrl = payUrl; //微信扫码支付
      } else {
        // newWindow = window.open("about:blank");
        newWindow.location = payUrl;
        //一定要有延迟
        // this.$openPage(payUrl); //打开支付宝跳转网页支付
      }
      this.$refs.pay.emmitTime();

      // if (task === 1) {
      //   //未支付成功
      //   //定时器返回结果是否支付成功
      //   console.log("未支付成功是否需要手动支付");
      // }
    },
    //获取订单状态

    //按钮查询支付结果
    payResult() {
      this.modal = false;
    }
  }
};
</script>

<style>
</style>
