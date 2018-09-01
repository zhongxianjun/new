<style lang="less" scoped>
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con" :style="'min-height: '+ h +'px; transition: all .25s; transform: translate( 0%, -50%)'">
            <Card :bordered="false">
                <p slot="title" style="text-align:center">
                    <Icon type="log-in"></Icon>
                    欢迎{{login.loginInfo}}
                </p>
                <p class="safeTips" v-if="safeState">检测到账号登陆异常,为确保账号安全<span @click="forgotPwd"  @loginStateFn="loginStateFn">请点这里解除异常</span></p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" :placeholder="placeholder" >
                                <span slot="prepend">
                                    <Icon :size="16" :type="type"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="verificationCode" class="verificationCode" v-if="showState" :style="'transform:translateY('+ inputTransY +'px);'">
                            <Input v-model="form.verificationCode" placeholder="请输入验证码" class="verification">
                                <span slot="prepend">
                                    <Icon :size="16" type="code"></Icon>
                                </span>
                            </Input>
                            <Button class="btn" type="primary" :style="'background: #'+btn.color" :loading="btn.info =='正在发送'" @click="recCode">{{btn.info}}</Button>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="confirmPassword" v-if="showState" :style="'transition:all .35s; transform:translateY(-'+ inputTransY +'px)'">
                            <Input type="password" v-model="form.confirmPassword" placeholder="请再次输入密码确认">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem> 
                            <Button @click="handleSubmit" type="primary" long :loading="form.loginInfo =='正在登录中'">{{form.loginInfo}}</Button>
                        </FormItem>
                            
                        
                    </Form>
                    <div class="weixin" :style="'transform:translateX('+ transX +'%)'">
                        <div class="close" @click="close"><Icon type="arrow-right-b" size="16"></Icon></div>
                        <img :src="src">
                        <p>{{weixin.loginInfo}}</p>
                        <div class="loading" v-if="loadingState">
                            <Spin size="large"></Spin>
                        </div>
                        <div class="refresh" @click="refreshClick" v-if="state">
                            <Icon type="refresh" size="40"></Icon>
                        </div>
                    </div>
                    <p class="login-tip">
                      
                      <a href="javascript:;" v-if="IconState"><span @click="forgotPwd">忘记密码?</span></a>
                      <a class="right"  v-if="IconState" href="javascript:;"><span @click="intoRegister">{{loginTips.loginInfo}}</span></a>
                     
                    </p>
                    <p  v-if="!IconState" style="text-align:center"><a href="https://market.ppkao.com/service/" target="_blank" >注册代表您已经阅读并同意《考试资料网服务条款》</a> </p>
                      
                    <Row  type="flex" align="middle" class-name="three">
                        <Col span="6" class-name="title" >第三方账号{{login.loginInfo}}</Col>
                        <Col span="3"><a  @click="wechatLogin"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-weixin"></use></svg></a></Col>
                        <a class="right" style="padding-left:94px"  v-if="!IconState" href="javascript:;"><span @click="intoRegister">{{loginTips.loginInfo}}</span></a>
                        <Col span="3" v-if="IconState"><a href="https://user.ppkao.com/loginAPI/qq/redirect_to_login.aspx"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-QQ"></use></svg></a></Col>
                        <Col span="3" v-if="IconState"><a href="https://user.ppkao.com/loginAPI/alipay/alipay_auth_authorize.aspx"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhifubao"></use></svg></a></Col>
                        <Col span="3" v-if="IconState"><a href="https://user.ppkao.com/loginAPI/sina/redirect_to_login.aspx"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-weibo"></use></svg></a></Col>
                        <Col span="3" v-if="IconState"><a href="https://user.ppkao.com/loginAPI/baidu/redirect_to_login.aspx"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-baidu"></use></svg></a></Col>
                    </Row>
                        
                </div>
            </Card>

            <retrievePwd v-if="comState" @loginStateFn="loginStateFn" @ShowData="show" @show="Show" :pwdState="pwdState" :h="h" :Mobile="Mobile" :UserID="UserID" :UserToken="UserToken" :readonly="readonly" :style="'transition:all .25s; transform:translate('+ translateX +'%,-50%)'">

            </retrievePwd>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";
import md5 from "js-md5";
import retrievePwd from "../components/retrievePwd/retrievePwd.vue";
export default {
  data() {
    const validateUser = (rule, value, callback) => {
      if (this.login.loginInfo == "登录") {
        if (value === "") {
          callback(new Error("账号不能为空"));
        } else {
          callback();
        }
      } else if (this.login.loginInfo == "注册") {
        if (value === "") {
          callback(new Error("手机号码不能为空"));
        } else {
          if (/^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的手机号码"));
          }
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.form.confirmPassword !== "") {
          // 对第二个密码框单独验证
          this.$refs.loginForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      form: {
        userName: "",
        password: "",
        confirmPassword: "",
        verificationCode: "",
        loginInfo: "立即登录"
      },
      rules: {
        userName: [
          { required: true, validator: validateUser, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, validator: validatePassCheck, trigger: "blur" }
        ],
        verificationCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      },
      weixin: {
        loginInfo: "'微信扫描二维码，马上登录"
      },
      login: {
        loginInfo: "登录"
      },
      loginTips: {
        loginInfo: "立即注册?"
      },
      btn: {
        color: "",
        info: "获取验证码"
      },
      placeholder: "请输入用户名",
      type: "person",
      validateIphone: "",
      IconState: true,
      showState: false,
      state: false,
      loadingState: false,
      transX: 100,
      src: "",
      code: 0,
      timmer: null,
      inputTransY: 65,
      h: 368,
      MD5: "",
      translateX: -100,
      safeState: false,
      pwdState: true,
      Mobile: "",
      UserID: "",
      UserToken: "",
      readonly: false,
      comState: false
    };
  },
  components: {
    retrievePwd
  },
  beforeCreate: function() {
    const QZ_KSUser = Cookies.get("QZ_KSUser");
  },
  mounted() {},
  methods: {
    handleSubmit() {
      // this.$router.push({
      //             name: 'errorpage_index'
      //         });
      if (this.login.loginInfo == "登录") {
        this.loginSubmit();
      } else if (this.login.loginInfo == "注册") {
        this.$refs.loginForm.validate(async valid => {
          if (valid) {
            const {
              userName,
              password,
              confirmPassword,
              verificationCode
            } = this.form;
            let verifyData = await this.$http({
              url: "/Interface/SendSmsApi.ashx?",
              params: {
                action: "VerifySMS",
                Mobile: userName,
                Code: verificationCode,
                MD5: this.MD5
              },
              auto: true
            });

            if (verifyData.S == 1) {
              //检验 验证码
              let data = await this.$http({
                url: "/Interface/UserApi.ashx?",
                params: {
                  action: "UserReg",
                  pwd: password,
                  mobile: userName,
                  code: verificationCode,
                  userfrom: 9,
                  MD5: this.MD5
                },
                auto: true
              });
              if (data.S == 1) {
                this.$Message.success("注册成功!");
                //注册成功，自动登录
                if (data.UserList) {
                  this.loginStateFn(data);
                }
              } else {
                this.$Message.error("注册异常了请重试");
              }
            } else {
              this.$Message.error("无效的验证码");
            }
          }
        });
      }
    },

    //登录提交
    loginSubmit() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const { userName, password } = this.form;
          this.form.loginInfo = "正在登录中";
          // this.$Message.loading('正在登录中')
          let data = await this.$http({
            url: "/Interface/UserApi.ashx?",
            params: {
              action: "UserLogin",
              username: userName,
              pwd: password
            },
            auto: true
          });
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
          console.log("开始登录", Cookies.get("QZ_KSUser"));
          const _this = this;

          this.$store.commit("login", {
            data: data.UserList[0],
            fn: function() {
              _this.$router.push("/home");
            }
          });
          Cookies.set("password", md5(this.form.password), { expires: 7 });

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
    //生成二维码 函数
    async generateQrCode() {
      this.loadingState = true;
      this.state = false;
      if (this.login.loginInfo == "登录") {
        this.weixin.loginInfo = "微信扫描二维码，马上登录";
      } else {
        this.weixin.loginInfo = "微信扫描二维码，马上注册";
      }
      let data = await this.$http({
        url: "/Interface/UserApi.ashx?",
        params: {
          action: "WXQRCodeLogin"
        },
        auto: true
      });
      this.src = data.QRCode;
      this.code = data.Code;
      this.loadingState = false;
    },
    //微信登录状态
    async wechatLoginState() {
      let num = 1;

      this.timmer = setInterval(async () => {
        let data = await this.$http({
          url: "/Interface/UserApi.ashx?",
          params: {
            action: "GetWXSceneID",
            code: this.code
          },
          auto: true
        });

        num++;
        if (num <= 15) {
          if (data.S == 1 && data.UserList) {
            num = 1;
            this.state = true;
            clearInterval(this.timmer);
            this.loginStateFn(data);
          }
        } else {
          num = 0;
          this.state = true;
          this.weixin.loginInfo = "二维码已过期";
          clearInterval(this.timmer);
        }
      }, 2000);
    },
    //刷新按钮 点击事件
    refreshClick() {
      this.state = false;
      if (this.login.loginInfo == "登录") {
        this.weixin.loginInfo = "微信扫描二维码，马上登录";
      } else {
        this.weixin.loginInfo = "微信扫描二维码，马上注册";
      }
      this.wechatLogin();
    },
    //微信登录图标 点击事件
    async wechatLogin() {
      this.transX = 0;
      this.showState = false;
      this.h = 368;
      this.inputTransY = 68;
      clearInterval(this.timmer);

      //生成二维码
      await this.generateQrCode();

      this.wechatLoginState();
    },
    // 收起微信二维码
    close() {
      this.transX = 100;
      clearInterval(this.timmer);

      if (this.login.loginInfo == "注册") {
        this.h = 500;
        this.showState = true;
        let inputTimmer = setTimeout(() => {
          this.inputTransY = 0;
          clearTimeout(inputTimmer);
        }, 250);
      }
    },

    // 点击 '立即注册?'
    async intoRegister() {
      this.transX = 100;
      this.reset();
      clearInterval(this.timmer);
      if (this.login.loginInfo == "登录") {
        this.form = {
          userName: "",
          password: "",
          confirmPassword: "",
          verificationCode: "",
          loginInfo: "立即注册"
        };
        this.placeholder = "请输入手机号码";
        this.login.loginInfo = "注册";
        this.type = "android-phone-portrait";
        this.loginTips.loginInfo = "已有账号点击登录";
        this.h = 500;
        this.showState = true;
        this.IconState = false;
        let inputTimmer = setTimeout(() => {
          this.inputTransY = 0;
          clearTimeout(inputTimmer);
        }, 50);
      } else if (this.login.loginInfo == "注册") {
        this.form = {
          userName: "",
          password: "",
          confirmPassword: "",
          verificationCode: "",
          loginInfo: "立即登录"
        };
        this.placeholder = "请输入用户名";
        this.login.loginInfo = "登录";
        this.type = "person";
        this.loginTips.loginInfo = "立即注册?";
        this.IconState = true;
        this.inputTransY = await 68;
        let inputTimmer = setTimeout(() => {
          this.showState = false;
          this.h = 368;
          clearTimeout(inputTimmer);
        }, 250);
      }
    },

    //发送验证码
    recCode() {
      if (this.btn.color !== "ccc") {
        this.$refs.loginForm.validateField("userName", async valid => {
          if (!valid) {
            this.btn.info = "正在发送";
            const { userName } = this.form;
            let miyao = md5(userName + "ppkao.com");
            let flag = 6;
            this.receiveCode(flag, userName, miyao);
          }
        });
      }
    },

    //发送验证码接口 函数封装
    async receiveCode(flag, phoneNum, miyao) {
      let data = await this.$http({
        url: "/Interface/SendSmsApi.ashx?",
        params: {
          action: "SendSmsCode",
          Mobile: phoneNum,
          flag: flag,
          MD5: miyao
        },
        auto: true
      });
      this.MD5 = data.MD5Code;
      if (data.S == 1) {
        let time = 90;
        this.btn.color = "ccc";
        let timmer = setInterval(() => {
          if (time > 0) {
            this.btn.info = time + "s";
            time--;
          } else {
            this.btn.color = "2d8cf0";
            this.btn.info = "获取验证码";
            clearInterval(timmer);
          }
        }, 1000);
      } else {
        this.btn.info = "获取验证码";
        this.$Message.error(data.msg);
      }
    },

    //点击 '忘记密码?'
    async forgotPwd(e) {
      this.reset();
      this.close();
      this.comState = true;
      let timmer = setTimeout(() => {
        this.translateX = 0;
        clearTimeout(timmer);
      }, 50);
      if (e.target.innerText == "请点这里解除异常") {
        this.h = 361;
        this.pwdState = false;
        this.readonly = true;
      } else if (e.target.innerText == "忘记密码?") {
        this.h = 425;
        this.pwdState = true;
        this.readonly = false;
      }
    },

    //接收子组件传过来的值
    show(showData) {
      this.translateX = showData.translateX;
      this.h = showData.h;
    },
    Show(comState) {
      this.comState = comState;
    },

    //清除rules 错误提示
    reset() {
      this.$refs.loginForm.resetFields();
      this.safeState = false;
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
  height: 42px;
}
.ivu-form-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
