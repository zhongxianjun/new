<template>
 <div class="buy_box" id="buyBox" v-show="PayStatus">
    <Spin  v-if="!KemuPriceList" fix>
      <img src="@/images/load.gif" style="width:40px;"/>
      <p style="padding-top:20px;">正在为您加载中</p>
    </Spin>
           
            <div class="wrap">
                <span class="close_icon01" @click="closeModal()">X</span>
                <!-- 选择vip体验套餐 -->
                <div class="vip_num">
                    <p>
                      <span>收录</span>
                      <span v-for="(item,index) in TikuNum" :key="index" class="tip">{{item}}</span>
                      <span>道题</span>
                    </p>
                     <p>
                      <span>已有</span>
                      <span v-for="(item,index) in VipNum" :key="index" class="tip">{{item}}</span>
                      <span>名VIP会员</span>
                    </p>
                </div>
                  <img class="titles" src="@/images/buy_text_pic.png">
                <div class="choose-box">
                    <div class="banner_buy">
                      
                    </div>
                    <div class="choose-vip">
                        <ul class="way" chosen="done">
                            <li class="buys" v-for="(item,index) in KemuPriceList" @click="checkPrice(index,item)" :class="priceIndex == index?'check':''" :key="item.ID">
                               {{tname}}
                                <span>{{item.TypeName}}</span>
                                <span>/</span>
                                <span>{{item.CurrentPrice}}</span>元<i>原价{{item.OrigPrice}}元</i><br>
                                {{item.Remark}}
                            </li>
                           
                        </ul>
                    <Select v-if="GroupNum" v-model="CouponNum" @on-change="(e)=>coupNum(e)" style="width:100%; " placeholder="请选择优惠券" not-found-text="暂无优惠券">
                        <Option v-for="item in GroupNum" :value="item.CouponNum" :key="item.ID" style="display:flex;justify-content:space-between">
                            <span>满{{parseInt(item.MinAmount)}}减{{item.Title}}</span>
                            <span>{{item.EndDate}}过期</span>
                        </Option>
                    </Select>
                        <p>选择支付方式：</p>
                        <ul class="pay clearfix" chosen="done">
                            <li  @click="checkPay('wx')" :class="payWay == 'wx'? 'check wechatPay buys':'wechatPay buys' " >
                             <svg class="icon" aria-hidden="true"><use xlink:href="#icon-weixinzhifu1"></use></svg>
                             <span>微信付款</span>
                            </li>
                            <li class="aliPay"  @click="checkPay('zfb')" :class="payWay == 'zfb'? 'check wechatPay buys':'wechatPay buys' " >
                              <svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhifubao1"></use></svg>
                              <span>支付宝付款</span>
                            </li>
                            <li class="aliPay"   v-if=" KemuPriceList && parseFloat(UserInfo.Money) >= parseFloat(KemuPriceList[0].CurrentPrice)" @click="checkPay('ye')" :class="payWay == 'ye'? 'check wechatPay buys':'wechatPay buys' " >
                              <svg class="icon" aria-hidden="true"><use xlink:href="#icon-hnc_Myuezhifu"></use></svg>
                              <span>余额付款</span>
                            </li>
                        </ul>
                    </div>
                    <div class="sure">
                        <input id="goPay" @click="Pay" value="升级VIP会员" type="button">
                    </div>
                    <div class="login" id="login">
                        <p>
                            <a class="sign-up fl" :href="kefuTime" id="customservice" title="遇到问题联系在线客服" target="_blank">遇到问题联系在线客服</a>
                            <span class="sign-up" style="text-decoration: none!important;">郑重提醒：在线充值后，不支持退款</span>
                        </p>
                    </div>
                </div>
            </div>
           <pay 
            ref="pay"
            :modal.sync="modal"
            :payUrl="payUrl"
            :OrderID="OrderID"
            :source="payWay" 
             ></pay>
   
        
    </div>
</template>
<script>
import pay from "../components/pay/pay.vue";
import Vue from "vue";
import types from "./types.js";
import util from "../libs/util.js";
var Event = new Vue(); //事件调度器
export default {
  components: {
    pay
  },
  data() {
    return {
      value: "",
      types,
      PayStatus: true, //控制组件卸载隐藏
      modal: false,
      tname: "",
      OrderID: "",
      KemuList: "",
      GroupNum: "",
      newWindow: null,
      VipNum: [],
      couponCode: "",
      TikuNum: [],
      priceIndex: 0, //选择第一个科目
      status: false, //控制load开关
      KemuPriceList: "",
      payWay: "wx",
      tid: "",
      payUrl: "", //支付链接
      ChaJia: false, //补差价升级资格
      CouponNum: "" //优惠券信息
    };
  },
  name: "buy-kemu",
  props: {
    open: Boolean
  },
  computed: {
    openModal() {
      return this.$store.state.app.openBuyModal;
    },
    UserInfo() {
      return this.$store.state.user.UserInfo;
    },
    kefuTime() {
      return this.$store.state.app.kefuTime;
    }
  },
  async created() {
    let { tid, tname } = this.openModal;
    const isTid = await this.$http({
      url: "/Interface/KSTKClassAPI.ashx?",
      params: {
        action: "GetIsflagClass",
        Tid: tid
      }
    });
    console.log("查看可以购买的科目", isTid);
    if (isTid.S == 1) {
      tid = isTid.KSTKList[0].id; //设置ID
      this.tname = isTid.KSTKList[0].tname;
    } else {
      tid = this.openModal.tid;
    }
    this.tid = tid;

    const [data, Price, GroupNum] = await Promise.all([
      this.$http({
        url: "/Interface/KSTKClassAPI.ashx?",
        params: {
          action: "GetTKClassPrice",
          Id: tid
        }
      }),
      this.$http({
        url: "/Interface/UserApi.ashx",
        params: {
          action: "GetUserIsClosingPrice",
          Tid: tid
        },
        auto: true
      }),
      util.GroupNum()
    ]);
    console.log(data, Price, GroupNum, isTid);

    if (GroupNum) this.GroupNum = GroupNum; //获取优惠券列表
    if (Price.S == 1) {
      console.log(Price, "补差价资格");
      data.PriceList.splice(0, Number(Price.hide) - 1);
      //具有补差价资格
      for (let i = 0; i < data.PriceList.length; i++) {
        if (Price.TypeName == data.PriceList[i].TypeName) {
          data.PriceList[i].TypeName = Price.msg;
          data.PriceList[i].CurrentPrice = Price.PayMoney;
          data.PriceList[i].ChaJia = true;
        } else {
          data.PriceList[i].ChaJia = false;
        }
      }
    }
    if (data.S == 1) {
      this.KemuInfo = data.PriceList[0];
      console.log(data, "科目价格");
      this.KemuPriceList = data.PriceList;

      this.VipNum = data.VIPNum.split("");
      this.TikuNum = data.STNum.split("");
    } else {
      this.closeModal();
      this.$Notice.error({
        title: "温馨提示",
        desc: data.msg
      });
    }
  },
  methods: {
    coupNum(e) {
      this.CouponNum = e;
    },
    BuyWay(data) {
      if (data.S == 1) {
        const { payUrl, OrderID } = data;
        this.payWay === "zfb" ? (this.newWindow.location = payUrl) : "";
        this.payUrl = payUrl;
        this.OrderID = OrderID;
        this.modal = true;
        //关闭当前弹窗
        this.PayStatus = false;
        this.$refs.pay.emmitTime({ OrderID, payUrl });
      } else {
        this.$Notice.error({
          title: "购买提醒",
          desc: data.msg
        });
      }
    },
    //余额购买
    async balancePay() {
      let { ChaJia, GroupID, ID } = this.KemuInfo;
      let Tid = this.openModal.tid;
      let data = {};
      this.closeModal();
      if (ChaJia) {
        data = await this.$http({
          url: "/Interface/OrderApi.ashx?",
          params: {
            action: "UserBalanceClosingPrice",
            tid: Tid,
            CouponNum: this.CouponNum ? this.CouponNum : ""
          },
          auto: true
        });
      } else {
        data = await this.$http({
          url: "/Interface/OrderApi.ashx?",
          params: {
            action: "SubjectBalanceUpgrade",
            ID,
            GroupID,
            tid: Tid,
            CouponNum: this.CouponNum ? this.CouponNum : ""
          },
          auto: true
        });
      }
      console.log("支付结果", data);

      if (data.S == 1) {
        window.eventHub.$emit("updateKemu");
        this.$updateUserInfo(this); //更新用户信息
        this.$Message.success({
          content: "恭喜您,购买科目成功",
          duration: 3
        });
      } else {
        this.$Message.error({
          content: data.msg,
          duration: 3
        });
      }
    },
    //购买科目
    async Pay() {
      let { ChaJia, GroupID, ID } = this.KemuInfo;
      let Tid = this.openModal.tid;
      if (this.payWay === "ye") {
        this.balancePay(); //余额直接购买
      } else {
        if (this.payWay === "zfb") this.newWindow = window.open("about:blank");
        let PaymentID = this.payWay === "wx" ? 17 : 18;
        if (ChaJia) {
          //补差价的接口
          let data = await this.$http({
            url: "/Interface/OrderApi.ashx?",
            params: {
              action: "UserClosingPrice",
              PaymentID,
              tid: Tid,
              CouponNum: this.CouponNum ? this.CouponNum : ""
            },
            auto: true
          });

          this.BuyWay(data);
          console.log(data, "差价购买");
        } else {
          //正常购买接口
          let data = await this.$http({
            url: "/Interface/OrderApi.ashx?",
            params: {
              action: "UserBuySubject",
              PaymentID,
              ID,
              GroupID,
              tid: Tid,
              CouponNum: this.CouponNum ? this.CouponNum : ""
            },
            auto: true
          });
          this.BuyWay(data);
          console.log(data, "正常购买");
        }
      }
    },
    //选择科目
    checkPrice(id, item) {
      this.priceIndex = id;
      this.KemuInfo = item; //保存购买信息
    },
    //设置科目
    checkPay(way) {
      this.payWay = way;
    },
    closeModal() {
      this.$store.commit("setOpenBuyModal", "");
    }
  }
};
</script>
<style lang="less" scoped>
.icon {
  width: 2.5em;
  height: 2em;
}
.buy_box {
  width: 562px;
}
.dialogBox {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vip_num {
  position: absolute;
  right: 0;
  top: 50px;
  span {
    color: white;
    font-size: 16px;
  }
  .tip {
    width: 20px;
    height: 22px;
    margin-right: 4px;
    text-align: center;
    background: url("~@/images/num.png");
    background-size: 100%;
    line-height: 22px;
    color: white;
    font-size: 14px;
  }
}

img {
  border: 0;
}

input {
  outline: none;
}
input,
i,
em,
span,
b,
lable,
button {
  display: inline-block;
  font-style: normal;
  font-family: Arial, "Times New Roman", "Microsoft YaHei", "Open Sans",
    "Helvetica Neue", Helvetica, Arial, sans-serif, "微软雅黑";
}

table {
  border-collapse: collapse;
}

button {
  border-radius: 0;
  -webkit-border-radius: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: normal;
}

a:hover {
  text-decoration: none;
}

.hide {
  display: none;
}

.clearfix:after {
  display: block;
  visibility: hidden;
  clear: both;
  height: 0;
  content: ".";
}

.clearfix {
  zoom: 1;
}

.fr {
  float: right;
}

.fl {
  float: left;
}

.juse {
  color: #ff6e03;
}

.huisebg {
  background: #fafafa;
}

li {
  list-style-type: none;
}

a {
  text-decoration: none;
  color: #3d3d3d;
  cursor: pointer;
}

.buy_box {
  width: 462px;
  position: fixed;
  outline: 0px;
  left: 50%;
  margin-left: -282px;
  top: 50%;
  z-index: 1024;
  margin-top: -322.5px;
}
.buy_box0 {
  width: 462px;
  position: absolute;
  outline: 0px;
  left: 50%;
  margin-left: -282px;
  top: 10%;
  z-index: 1024;
  margin-top: 0;
}
.wrap {
  background: #65b2ed url(../images/buy_pic.png) no-repeat;
  -webkit-background-size: 100%;
  background-size: 100%;
  padding: 0 28px;
  -webkit-border-radius: 8px;
  border-radius: 8px;
  position: relative;
}
.close_icon01 {
  width: 50px;
  height: 50px;
  position: absolute;
  right: -11px;
  top: 0;
  z-index: 9;
  cursor: pointer;
  text-align: center;
  font-size: 19px;

  cursor: pointer;
}
.banner_buy {
  width: 100%;
  padding: 30px 0 135px;
}
.banner_buy img {
  width: 276px;
  display: block;
  margin: 0 auto;
}
.titles {
  width: 310px;
  position: absolute;
  right: 6px;
  top: 108px;
}
.choose-vip ul li.buys {
  margin-bottom: 14px;
  background: #fff;
  border: 3px solid #ebd1b7;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.choose-vip ul li.check {
  border-color: #f60;
}

.choose-vip .way li {
  position: relative;
  overflow: hidden;
  padding: 10px 0;
  line-height: 20px;
  font-size: 18px;
  text-align: center;
  color: #333;
}
/*.choose-vip .way li:first-child:after { position: absolute; left:-20px; font-size:12px; content:"双11"; color:#FFF; background:#F00 none repeat scroll 0% 0%; transform:rotate(-45deg); padding:15px 25px 3px; top:-7px; transform:rotate(-45deg); -ms-transform:rotate(-45deg); -moz-transform:rotate(-45deg); -webkit-transform:rotate(-45deg); -o-transform:rotate(-45deg); }*/
.choose-vip .way li span {
  color: #379be7;
  font-size: 16px;
  font-weight: bold;
  padding: 0px 3px;
}

.choose-vip .way li i {
  font-size: 18px;
  padding: 0 8px;
  color: #999;
  font-style: normal;
  text-decoration: line-through;
}

.choose-vip p {
  color: #333;
  font-size: 14px;
  line-height: 30px;
}

.choose-vip .pay li {
  border-radius: 15px;
  width: 48%;
  float: left;
  text-align: left;
  box-sizing: border-box;
  line-height: 40px;
  font-size: 15px;
  color: #333;
  margin: 0px 4px;
}
.choose-vip .pay li i {
  width: 32px;
  height: 27px;
  display: inline-block;
  vertical-align: middle;
  margin: 0 8px 0 20px;
}
.choose-vip .pay li.wechatPay i {
  background-position: -66px -283px;
}

.wechatPay {
  // width: 33% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pay {
  display: flex;
  justify-content: center;
}
.choose-vip .pay li.aliPay i {
  background-position: -66px -333px;
}

.sure {
  padding-top: 10px;
}

.sure input {
  width: 100%;
  height: 50px;
  line-height: 44px;
  background: #f60;
  border: 0px none;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  border-radius: 30px;
}
.login {
  padding: 23px 0 28px;
}
.login p {
  text-align: right;
  color: #333;
}
.login p a {
  text-decoration: underline !important;
  color: #333;
}

.tips {
  margin-top: 10px;
  padding: 8px 0 15px;
  text-align: center;
  font-size: 12px;
  color: #afd4f0;
  border-top: 1px #96c8ee dashed;
}
/* 付款框 */
.alipay-box,
.wechatpay-box {
  display: none;
  padding: 30px;
}

.pay-btn {
  margin: 0px 10px;
  border-radius: 3px;
  width: 100px;
  height: 36px;
  color: #fff;
  background: #36a306;
  border: 0;
  text-align: center;
  cursor: pointer;
}

.red-bg {
  background: #cf3434;
}
/* 支付结果 */
.success p,
.fail p {
  text-align: center;
  line-height: 14px;
  margin-top: 10px;
}

.finish-btn {
  margin: 0px 10px;
  border-radius: 3px;
  width: 100px;
  height: 36px;
  color: #fff;
  background: #36a306;
  border: 0;
  text-align: center;
  cursor: pointer;
}

.success span,
.fail span {
  display: block;
  width: 70px;
  height: 70px;
  margin: 0px auto;
  background: url("http://static.ppkao.com/user/pc/images/succ_fail.png")
    no-repeat;
}

.success span {
  background-position: 0 0;
}

.fail span {
  background-position: -70px 0;
}

.wxpay-icon {
  position: absolute;
  top: 45%;
  left: 50%;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  margin-left: -15px;
  background: url(http://static.ppkao.com/user/pc/images/wechatpay-icon.png);
}
</style>
