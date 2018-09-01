<style lang="less">
@import "./403.less";
</style>

<template>
    <div class="error403">
        <vue-canvas-nest  ></vue-canvas-nest>
        <div class="error403-body-con">
            <Card>
                <div class="error403-body-con-title">4<span class="error403-0-span"><Icon type="android-lock"></Icon></span><span class="error403-key-span"><Icon size="220" type="ios-bolt"></Icon></span></div>
                <p class="error403-body-con-message">{{tips}}</p>
                <div class="error403-btn-con">
                 <template v-if="tips ">
                    <Button @click="againLogin" size="large" style="width: 200px;margin-left: 40px;" type="primary">重新登录</Button>
                 </template>
                 <template v-else>
                    <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
                    <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
                 </template>   
                   
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import vueCanvasNest from "./canvas-nest.vue";
export default {
  components: { vueCanvasNest },
  name: "Error403",
  data() {
    return {
      tips: ""
    };
  },
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push({
        name: "home_index"
      });
    },
    againLogin() {
      // 重新登录

      this.$router.push("/login");
      this.$store.commit("logout", this);
      this.$store.commit("clearOpenedSubmenu");
    }
  },
  mounted() {
    const { permissions, loginfail } = this.$route.query;
    Cookies.remove("user");
    Cookies.remove("password");
    Cookies.remove("access");
    Cookies.remove("QZ_KSUser");
    Cookies.remove("Rnd");
    if (permissions === "none") {
      // 异地登录
      this.tips = "系统检测到您的账号在别处登录,请重新输入用户名密码进行登录";
    } else if (loginfail) {
      this.tips = loginfail;
    }
  }
};
</script>
