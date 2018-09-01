<style lang="less" scoped>
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
      <div class="container">
        <div class="login-con">
            <Card :bordered="false">
                <div class="header">
                  <img alt="logo" class="logo" src="@/images/pp.png">
                  <span class="title">考试资料网</span>
                </div>
                <div class="desc">PP题库分销系统</div>
                <div class="form-con">
                    <div class="titleTip">
                      账户密码登录
                    </div>
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名" >
                                <span slot="prepend">
                                    <Icon :size="16" type="md-person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="md-lock"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem> 
                            <Button @click="handleSubmit" type="primary" long :loading="form.loginInfo =='正在登录中'">{{form.loginInfo}}</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
      </div>
            
      <div class="globalFooter">
        <div class="link">
          <a target="_self" href="javascript:;">帮助</a>
          <a target="_self" href="javascript:;">隐私</a>
          <a target="_self" href="javascript:;">条款</a>
        </div>
        <div class="copyright">
          Copyright © 长沙求知信息技术有限公司
        </div>
      </div>
    </div>
</template>

<script>
import env from "../../../config/env";
import Cookies from "js-cookie";
import axios from "axios";
import md5 from "js-md5";
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        userName: "",
        password: "",
        loginInfo: "登录"
      },
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {

  },
  beforeCreate: function() {
    
  },
  mounted() {
    
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit() {
      this.loginSubmit();
    },

    //登录提交
    loginSubmit() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const { userName, password } = this.form;
          this.form.loginInfo = "正在登录中";
          let data = await this.$http({
            url: "/Interface/MarketAdmin/MarketUserApi.ashx?",
            params: {
              action: "AdminLongin",
              UserName: userName,
              PassWord: password
            }
          });
          console.log(data);
          if (data.S) {
            this.loginStateFn(data);
          } else {
            this.$Message.error("登录异常了请重试");
            this.form.loginInfo = "立即登录";
          }
        }
      });
    },
    //登录状态监测 函数封装
    async loginStateFn(data) {
      switch (Number(data.S)) {
        case 0:
          this.form.loginInfo = "立即登录";
          this.$Message.error(data.msg) /*密码错误*/;
          break;
        case 1:
          this.handleLogin(data)
          .then(() => {
              this.$router.push({ name: 'home' })
          });
          //保存用户新到vuex
          /*登录成功*/
          break;
        case -1:
          this.form.loginInfo = "立即登录";
          this.$Message.error("登录失败,设备异常") /*设备异常*/;
          break;
        case -2:
          this.form.loginInfo = "立即登录";
          // this.$Message.error(data.msg) /*登录异常需要解锁*/;
          this.safeState = true;
          this.Mobile = data.Mobile;
          this.UserID = data.UserID;
          this.UserToken = data.UserToken;
          break;
        default:
          this.form.loginInfo = "立即登录";
          this.$Message.warning(data.msg);
      }
    },

    //清除rules 错误提示
    reset() {
      this.$refs.loginForm.resetFields();
    }
  }
};
</script>

<style>
.icon {
  width: 3em;
  height: 3em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.ivu-input {
  height: 40px;
  font-size: 16px;
}
.ivu-card{
  background: 0;
}
</style>
