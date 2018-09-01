<style lang="less" scoped>
@import "./retrievePwd.less";
</style>

<template>
    <div class="retrievePwd" @keydown.enter="submit" :style="'min-height:'+ h +'px'">
        <div class="title">
            <Icon type="chevron-left" @click="returnLogin"></Icon>
            <span>{{info}}</span>
        </div>
        <div class="main">
            <div class="container">
                <div class="content">
                    <p>为了保证您的账号安全，请进行{{info}}</p>
                    <h3>{{bind}}方式</h3>
                    <div class="form-con">
                        <Form ref="retrieveForm" :model="form" :rules="rules">
                            <FormItem prop="phoneNum">
                                <Input v-model="form.phoneNum" placeholder="请输入手机号码" :disabled="disabled">
                                    <span slot="prepend">
                                        <Icon :size="16" type="android-phone-portrait"></Icon>
                                    </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="verificationCode" class="verificationCode">
                                <Input v-model="form.verificationCode" placeholder="请输入验证码" class="verification">
                                    <span slot="prepend">
                                        <Icon :size="16" type="code"></Icon>
                                    </span>
                                </Input>
                                <Button class="btn" type="primary" :style="'background: #'+btn.color" :loading="btn.info =='正在发送'" @click="recCode">{{btn.info}}</Button>
                            </FormItem>
                            <FormItem prop="password" v-if="pwdState">
                                <Input type="password" v-model="form.password" placeholder="请输入新密码">
                                    <span slot="prepend">
                                        <Icon :size="14" type="locked"></Icon>
                                    </span>
                                </Input>
                            </FormItem>
                            <FormItem> 
                                <Button @click="Submit" type="primary" long>确定</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <div class="tips">
                        <p>若无法使用以上验证方式，请</p>
                        <a :href="kefuTime" target="_blank" @click="kefuTime">联系在线客服</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import env from "../../../build/env";
import Cookies from "js-cookie";
import axios from "axios";
import md5 from "js-md5";
export default {
  name: "retrievePwd",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号码不能为空"));
      } else {
        if (/^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号码"));
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("新密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      form: {
        phoneNum: "",
        password: "",
        verificationCode: "",
        loginInfo: "确定"
      },
      rules: {
        phoneNum: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        verificationCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      },
      btn: {
        color: "",
        info: "获取验证码"
      },
      MD5: "",
      flag: 4,
      disabled: false,
      bind: "验证",
      info: "安全验证"
    };
  },
  props: {
    h: {
      type: Number,
      default: 425
    },
    pwdState: {
      type: Boolean,
      default: true
    },
    Mobile: {
      type: String,
      default: ""
    },
    UserID: {
      type: String
    },
    UserToken: {
      type: String
    },
    readonly: {
      type: Boolean
    }
  },
  computed: {
    kefuTime() {
      return this.$store.state.app.kefuTime;
    }
  },

  mounted() {
    if (!this.pwdState) {
      if (this.Mobile !== "") {
        this.disabled = this.readonly;
        this.info = "安全验证";
        this.bind = "验证";
        //电话号码加密
        this.mobileEncryption(this.Mobile);
      } else {
        this.disabled = !this.readonly;
        this.info = "手机绑定";
        this.bind = "绑定";
      }
    } else {
      this.disabled = this.readonly;
      this.info = "安全验证";
      this.bind = "验证";
    }
  },
  methods: {
    //手机加密
    mobileEncryption(phone) {
      let tel = String(phone);
      let dh = tel.substr(0, 3) + "******" + tel.substr(7);
      this.form.phoneNum = dh;
    },
    //验证验证码 函数封装
    varifyCode(Mobile, verificationCode) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: "/Interface/SendSmsApi.ashx?",
          params: {
            action: "VerifySMS",
            Mobile: Mobile,
            Code: verificationCode,
            MD5: this.MD5
          },
          auto: true
        }).then(res => {
          resolve(res);
        });
      });
    },
    //绑定手机号 函数封装
    bindPhone(UserID, UserToken, phone, verificationCode, MD5) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: "/Interface/UserApi.ashx?",
          params: {
            action: "BindPhone",
            UserID: UserID,
            UserToken: UserToken,
            phone: phone,
            code: verificationCode,
            MD5: MD5
          }
        }).then(res => {
          resolve(res);
        });
      });
    },
    //处理提交
    Submit() {
      if (this.pwdState) {
        //忘记密码
        this.$refs.retrieveForm.validate(async valid => {
          if (valid) {
            const { phoneNum, password, verificationCode } = this.form;
            //验证验证码
            let result = await this.varifyCode(phoneNum, verificationCode);

            if (result.S == 1) {
              //检验 验证码是否正确
              //修改密码
              this.changePwd(phoneNum, password, verificationCode);
            } else {
              this.$Message.error("无效的验证码");
            }
          }
        });
      } else {
        //异地登录
        if (this.Mobile !== "") {
          //有绑定的手机号码
          this.$refs.retrieveForm.validateField(
            "verificationCode",
            async valid => {
              if (!valid) {
                const { verificationCode } = this.form;
                //验证验证码
                let result = await this.varifyCode(
                  this.Mobile,
                  verificationCode
                );

                console.log(result, "打印结果");
                if (result.S == 1) {
                  //检验 验证码
                  let UserID = this.UserID;
                  let UserToken = this.UserToken;
                  let phone = this.Mobile;

                  this.removeAbnormal(
                    UserID,
                    UserToken,
                    phone,
                    verificationCode
                  );
                } else {
                  this.$Message.error("无效的验证码");
                }
              }
            }
          );
        } else {
          //异地登录
          if (this.Mobile !== "") {
            //有绑定的手机号码
            this.$refs.retrieveForm.validateField(
              "verificationCode",
              async valid => {
                if (!valid) {
                  const { verificationCode } = this.form;
                  //验证验证码
                  let result = await this.varifyCode(
                    this.Mobile,
                    verificationCode
                  );
                  if (result.S == 1) {
                    //检验 验证码
                    let UserID = this.UserID;
                    let UserToken = this.UserToken;
                    let phone = this.Mobile;

                    this.removeAbnormal(
                      UserID,
                      UserToken,
                      phone,
                      verificationCode
                    );
                  } else {
                    this.$Message.error("无效的验证码");
                  }
                }
              }
            );
          } else {
            //没有绑定的手机号码
            this.$refs.retrieveForm.validate(async valid => {
              if (valid) {
                const { phoneNum, verificationCode } = this.form;
                let UserID = this.UserID;
                let UserToken = this.UserToken;
                let phone = phoneNum;
                let MD5 = this.MD5;
                //绑定手机号码
                let result = await this.bindPhone(
                  UserID,
                  UserToken,
                  phone,
                  verificationCode,
                  MD5
                );
                if (result.S == 1) {
              
                  this.$emit("loginStateFn", result);
                } else {
                  this.$Message.error(result.msg);
                }
              }
            });
          }
        }
      }
    },
    //发送验证码
    recCode() {
      if (this.btn.color !== "ccc") {
        if (this.pwdState) {
          //修改密码
          this.$refs.retrieveForm.validateField("phoneNum", async valid => {
            if (!valid) {
              this.btn.info = "正在发送";
              const { phoneNum } = this.form;
              let miyao = md5(phoneNum + "ppkao.com");
              this.flag = 5;
              this.receiveCode(this.flag, phoneNum, miyao);
            }
          });
        } else {
          //解除异地登录
          if (this.Mobile !== "") {
            //绑定了号码
            this.btn.info = "正在发送";
            // var temp = this.Mobile;
            var temp = this.Mobile;
            var miyao = md5(temp + "ppkao.com");
            this.flag = 4;

            this.receiveCode(this.flag, temp, miyao);
          } else {
            //未绑定号码
            this.$refs.retrieveForm.validateField("phoneNum", async valid => {
              if (!valid) {
                this.btn.info = "正在发送";
                const { phoneNum } = this.form;
                var temp = phoneNum;
                var miyao = md5(temp + "ppkao.com");
                this.flag = 8;

                this.receiveCode(this.flag, temp, miyao);
              }
            });
          }
        }
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

    //修改密码接口调用  函数封装
    async changePwd(phoneNum, password, verificationCode) {
      let data = await this.$http({
        url: "/Interface/UserApi.ashx?",
        params: {
          action: "GetBackPassword",
          mobile: phoneNum,
          newpwd: password,
          code: verificationCode,
          MD5: this.MD5
        },
        auto: true
      });

      if (data.S == 1) {
        if (data.UserList) {
          this.$emit("loginStateFn", data);
        }
      } else {
        this.$Message.error(data.msg);
      }
    },
    // 解除异地登录
    async removeAbnormal(UserID, UserToken, phone, verificationCode) {
      let data = await this.$http({
        url: "/Interface/UserApi.ashx?",
        params: {
          action: "UserUnlocked",
          UserID: UserID,
          UserToken: UserToken,
          phone: phone,
          code: verificationCode,
          MD5: this.MD5
        }
      });
      if (data.S == 1) {
        let tempData = await this.$http({
          url: "/Interface/UserApi.ashx?",
          params: {
            action: "GetUserModel",
            UserID: this.UserID,
            UserToken: this.UserToken
          }
        });
        if (tempData.S == 1) {
          this.$emit("loginStateFn", tempData);
        }
      } else {
        this.$Message.error(data.msg);
      }
    },

    //返回到登录
    returnLogin() {
      let showData = {
        translateX: -100,
        h: 368
      };
      this.$emit("ShowData", showData);

      let comState = false;
      let timmer = setTimeout(() => {
        this.$emit("show", comState);
        clearTimeout(timmer);
      }, 250);

      this.form = {
        phoneNum: "",
        password: "",
        verificationCode: "",
        loginInfo: "确定"
      };

      this.reset();
    },

    //清除rules 错误提示
    reset() {
      this.$refs.retrieveForm.resetFields();
    }
  }
};
</script>

