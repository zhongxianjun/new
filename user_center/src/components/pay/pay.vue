 
<template>
     
    
<Modal  :value="modal" width="360"  :mask-closable="false" @on-visible-change="modalChange">
  <p slot="header" style="display:flex;align-items:center;justify-content:center">
      <svg class="icon" aria-hidden="true"><use :xlink:href="source === 'wx'?'#icon-weixinzhifu':'#icon-zhifubaozhifu'"></use></svg>
      <span style="padding-left:10px">{{ source === 'zfb'? '打开手机支付宝扫一扫继续付款':'请使用微信扫码支付'}}</span>
      
  </p>
  <div style="text-align:center">
      <h2 v-if="source === 'zfb'">正在为您查询订单状态,请稍后,如果打不开支付页面请查看页面是否被拦截</h2>
      <div  v-if="source === 'wx'">
        <img v-if="payUrl" :src="payUrl" style="width:117px;height:117px;display:block;margin:0 auto" />
        <div v-else style="width:117px;height:117px;position:relative;margin:0 auto" >
          <Spin size="large" fix ></Spin>
        </div>
      </div>
  </div>
  <div slot="footer">
      <Button @click="GetOrderStatus(true)" type="success" size="large" long >支付成功</Button>
  </div>
</Modal>
   
</template>

<script>
import util from "../../libs/util.js";
export default {
  name: "pay",
  data() {
    return {};
  },
  props: {
    modal: { type: Boolean, default: false },
    payUrl: String,
    OrderID: String,
    vip: { type: Boolean, default: false },
    source: [Number, String] //支付渠道
  },

  methods: {
    //弹出框状态发生了改变
    modalChange(status) {
      console.log(status, "状态");
      if (!status) {
        //关闭了对话框需要清除所有数据
        if (this.OrderID) {
          this.GetOrderStatus(true); //最后在筛选一遍订单确定是否支付成功
        } else {
          if (this.vip) {
            this.$emit("init");
          } else {
            console.log("刷新科目");
            this.$store.commit("setOpenBuyModal", ""); //关闭购买科目弹窗
            if (!off) window.eventHub.$emit("updateKemu"); //刷新科目信息
            this.$store.commit("clearTime"); //关闭全局定时器
          } //更新用户信息
        }
      }
    },
    //获取订单状态
    async GetOrderStatus(again) {
      let status = await this.$http({
        url: "/Interface/OrderApi.ashx",
        params: {
          action: "GetOrderModel",
          OrderID: this.OrderID
        },
        auto: true
      });
      if (
        status.OrderModel[0].Status == 1 &&
        status.OrderModel[0].PayStatus == 1
      ) {
        this.$Message.success({
          content: "恭喜您,充值成功",
          duration: 3
        });
        this.$updateUserInfo(this);
        this.payResult(); //更新用户信息
        //支付成功
      } else {
        if (again) {
          this.$Message.error({
            content: "对不起,支付失败, 有问题联系客服",
            duration: 3
          });
          //此时可以写一个通知消息 让他下次复购
          this.payResult(true); //更新用户信息手动检查支付结果后再进行关闭
          console.log("手动检查支付结果失败");
        } else {
          //轮询结果
          console.log(status.OrderModel[0], "支付失败");
        }
        //支付失败
      }
    },
    //按钮查询支付结果
    payResult(off) {
      if (this.vip) {
        this.$emit("init");
      } else {
        console.log("刷新科目");
        this.$store.commit("setOpenBuyModal", ""); //关闭购买科目弹窗
        if (!off) window.eventHub.$emit("updateKemu"); //刷新科目信息
        this.$store.commit("clearTime"); //关闭全局定时器
      }
    },
    async emmitTime() {
      await util.polling(this, {
        timing: 2,
        allTime: 30,
        fn: this.GetOrderStatus
      });
    }
  }
};
</script>

<style>
.icon {
  width: 20px;
  height: 20px;
}
</style>
