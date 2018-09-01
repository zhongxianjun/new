<style lang="less" scoped>
@import "./popUp.less";
</style>

<template>
    <div class="popUp" @click="close" @keydown.enter="handleSubmit">
        <transition name="zoomOutRight" tag="div" enter-active-class="animated zoomInRight" leave-active-class="animated zoomOutRight">
            <div class="container" @click.stop>
                <div class="changePwd" v-if="status.pwdState">
                    <div class="content">
                        <div class="header">
                            <span class="title">修改密码</span>
                        </div>
                        <div class="form-con">
                            <Form ref="changeForm" label-position="right" :label-width="90" :model="form" :rules="rules">
                                <FormItem prop="oldPwd" label="旧密码：">
                                    <Input v-model="form.oldPwd"></Input>
                                </FormItem>
                                <FormItem prop="password" label="新密码：">
                                    <Input type="password" v-model="form.password"></Input>
                                </FormItem>
                                <FormItem prop="oldPwd" label="确认密码：">
                                    <Input type="password" v-model="form.confirmPwd"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>

                <div class="changeAddress" v-if="status.addressState">
                    <div class="content">
                        <div class="header">
                            <span class="title">修改联系方式</span>
                        </div>
                        <div class="form-con">
                            <Form ref="changeForm" label-position="right" :model="form" :rules="rules">
                                <FormItem class="mobile" prop="mobile" label="电话：">
                                    <Input v-model="form.mobile"></Input>
                                </FormItem>
                                <FormItem prop="province" label="地址：" class="province">
                                    <Input v-model="form.province"></Input>
                                    <span>省　</span>
                                </FormItem>
                                <FormItem prop="city" class="city">
                                    <Input v-model="form.city"></Input>
                                    <span>市　</span>
                                </FormItem>
                                <FormItem prop="street" class="street">
                                    <Input v-model="form.street" placeholder="填写具体区域-街道地址"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>

                <div class="financialInfo" v-if="status.financialState">
                    <div class="content">
                        <div class="header">
                            <span class="title">财务信息</span>
                        </div>
                        <div class="form-con">
                            <Form ref="changeForm" label-position="right" :label-width="160" :model="form" :rules="rules">
                                <FormItem class="object" prop="object" label="财务对象：">
                                    <RadioGroup v-model="form.object">
                                        <Radio label="firm">
                                            <span>企业</span>
                                        </Radio>
                                        <Radio label="person">
                                            <span>个人</span>
                                        </Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem class="username" prop="username" label="企业名称/开户人姓名：">
                                    <Input v-model="form.username"></Input>
                                </FormItem>
                                <FormItem prop="cardID" label="卡号：" class="cardID">
                                    <Input v-model="form.cardID"></Input>
                                </FormItem>
                                <FormItem prop="bank" label="开户行：" class="bank">
                                    <Input v-model="form.bank" placeholder="如：xx省xx市xx银行xx支行"></Input>
                                </FormItem>
                                <FormItem prop="type" label="发票类型：" class="type" v-if="form.object === 'firm'">
                                    <RadioGroup v-model="form.type">
                                        <Radio label="common">
                                            <span>普通增值税发票</span>
                                        </Radio>
                                        <Radio label="special">
                                            <span>增值税专用发票</span>
                                        </Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem prop="ein" label="税号：" class="ein" v-if="form.object === 'firm'">
                                    <Input v-model="form.ein"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <div class="btn">
                        <Button @click="close">取 消</Button>
                        <Button type="primary" @click="handleSubmit">确 认</Button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import util from "@/libs/util.js";
import urlencode from 'urlencode';
export default {
  data() {
    const oldPwdCheck = (rule, value, callback) => {
        if (value == "") {
            callback(new Error("密码不能为空"));
        } else {
            callback();
        }
    };
    const pwdCheck = (rule, value, callback) => {
        if (value == "") {
            callback(new Error("密码不能为空"));
        } else if (value.trim().length < 6) {
            callback(new Error("账号长度不能少于6"));
        } else {
            callback();
        }
    };
    const confirmPwd = (rule, value, callback) => {
        if (value == "") {
            callback(new Error("请再次输入密码"));
        } else if (value !== this.form.password) {
            callback(new Error("两次密码不一致，请重新输入"));
        } else {
            callback();
        }
    };
    const mobileCheck = (rule, value, callback) => {
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
    return {
      form: {
        //修改密码
        oldPwd: "",
        password: "",
        confirmPwd: "",
        //修改地址
        mobile: "",
        province: "",
        city: "",
        street: "",
        //获取财务信息
        object: "firm",
        username: "",
        cardID: "",
        bank: "",
        type: "common",
        ein: ""
      },
      rules: {
        //修改密码
        oldPwd: [
          { required: true, validator: oldPwdCheck, trigger: "blur" }
        ],
        password: [
          { required: true, validator: pwdCheck, trigger: "blur" }
        ],
        confirmPwd: [
          { required: true, validator: confirmPwd, trigger: "blur" }
        ],
        //修改地址
        mobile: [
          { required: true, validator: mobileCheck, trigger: "blur" }
        ],
        province: [
          { required: true, message: "省份不能为空　", trigger: "blur" }
        ],
        city: [
          { required: true, message: "城市不能为空　", trigger: "blur" }
        ],
        street: [
          { required: true, message: "请填写具体区域-街道地址", trigger: "blur" }
        ],
        //获取财务信息
        object: [
          { required: true, message: "请选择财务对象", trigger: "blur" }
        ],
        username: [
          { required: true, message: "企业名称/开户人姓名 不能为空", trigger: "blur" }
        ],
        cardID: [
          { required: true, message: "卡号不能为空", trigger: "blur" }
        ],
        bank: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择发票类型", trigger: "blur" }
        ],
        ein: [
          { required: false }
        ],
      }
    };
  },
  components: {

  },
  props: {
    ID: {
        type: String
    },
    status: {
        type: Object
    },
    financInfo: {
        type: Object,
        value: null
    }
  },
  beforeCreate: function() {
    
  },
  mounted() {
    console.log('弹出层', this.ID);
    const financInfo = this.financInfo;
    if (financInfo && (JSON.stringify(financInfo) !== '{}')) {
        console.log('编辑财务信息', financInfo);
        financInfo.AccountType === '1' && (this.form.object = 'person');
        financInfo.AccountType === '2' && (this.form.object = 'firm');
        this.form.username = financInfo.Cardholder;
        this.form.cardID = financInfo.CardNumber;
        this.form.bank = financInfo.AccountBank;
        financInfo.InvoiceType === '1' && (this.form.type = 'common');
        financInfo.InvoiceType === '2' && (this.form.type = 'special');
        this.form.ein = financInfo.TaxID !== '0' ? financInfo.TaxID : '';
    }
  },
  methods: {
    handleSubmit() {
        this.$refs.changeForm.validate(async (valid) => {
            if(valid){
                const { addressState, financialState, pwdState } = this.status;
                if(addressState){
                    let data = await this.EditMember();
                    console.log(data);
                    if (data.S == 1) {
                        this.close();
                        this.$Message.success(data.msg);
                        this.$emit('refresh');
                    } else {
                        this.$Message.error(data.msg);
                    }

                } else if(financialState) {
                    let data = await this.AddUserFinanceInfo();
                    if(data.S == 1){
                        this.close();
                        this.$Message.success(data.msg);
                        this.$emit('refresh');
                    } else {
                        this.$Message.error(data.msg);
                    }
                } else if(pwdState) {
                    let data = await this.EditAgentsMember();
                    console.log(data);
                    if(data.S == 1){
                        this.close();
                        this.$Message.success('修改成功');
                    } else {
                        this.$Message.error(data.msg);
                    }
                }
            }
        });
    },
    //修改用户联系方式接口调用 函数封装
    EditMember() {
        const {AdminID, UserToken, GroupID} = util.parseInfo();
        
        const {mobile, province, city, street} = this.form;
        const address = province + '省' + city + '市' + street;
        return new Promise ((resolve, reject) => {
            this.$http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: 'EditMembeContact',
                    UserID: AdminID,
                    UserToken,
                    Mobile: mobile,
                    TheUserID: this.ID,
                    Address: urlencode(address, 'gbk')
                }
            }).then((res)=>{
                resolve(res);
            })
        })
    },
    // 新增用户财务信息接口调用 函数封装
    AddUserFinanceInfo(){
        const {AdminID, UserToken, UserName} = util.parseInfo();
        const {object, username, cardID, bank, type, ein} = this.form;

        let url = '/Interface/MarketAdmin/MarketMemberListApi.ashx';
        let params = {};

        const financInfo = this.financInfo;
        if (financInfo && (JSON.stringify(financInfo) !== '{}')) {
            // 编辑
            params = Object.assign(params, {
                action: 'EditUserFinanceInfo',
                Code: financInfo.Code
            });
        } else {
            // 新增
            params = Object.assign(params, {
                action: 'AddUserFinanceInfo'
            });
        }

        if (object === 'firm') {
            console.log('企业');
            params = Object.assign(params, {
                UserID: AdminID,
                UserToken,
                TheUserID: this.ID,
                UserName: urlencode(UserName, 'gbk'),
                CardNumber: urlencode(cardID, 'gbk'),
                Cardholder: urlencode(username, 'gbk'),
                AccountBank: urlencode(bank, 'gbk'),
                AccountType: '2',
                Status: '0',
                InvoiceType: `${type === 'common' ? '1' : ''}${type === 'special' ? '2' : ''}`,
                TaxID: urlencode(ein, 'gbk')
            });
        } else if (object === 'person') {
            console.log('个人');
            params = Object.assign(params, {
                UserID: AdminID,
                UserToken,
                TheUserID: this.ID,
                UserName: urlencode(UserName, 'gbk'),
                CardNumber: urlencode(cardID, 'gbk'),
                Cardholder: urlencode(username, 'gbk'),
                AccountBank: urlencode(bank, 'gbk'),
                AccountType: '1',
                Status: '0',
                InvoiceType: '0'
            });
        }

        return new Promise ((resolve, reject)=>{
            this.$http({
                url: url,
                params: params
            }).then((res)=>{
                resolve(res);
            })
        })
    },
    //修改密码接口调用 函数封装
    EditAgentsMember(){
        const {AdminID, UserToken} = util.parseInfo();
        const {oldPwd, password} = this.form;
        return new Promise ((resolve, reject)=>{
            this.$http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: 'EditAgentsMember',
                    UserID: AdminID,
                    UserToken,
                    TheUserID: this.ID,
                    PassWord: password,
                    tavPassWord: oldPwd,
                }
            }).then((res)=>{
                resolve(res);
            })
        })
    },
    close() {
        let showState = false;
        this.$emit('showPopUp', showState);
    },
    //清除rules 错误提示
    reset() {
      this.$refs.changeForm.resetFields();
    }
  }
};
</script>

<style>
.ivu-form-item-content{
    display: flex;
    align-items: center;
}
.ivu-form-item{
    margin-bottom: 20px;
}
.ivu-input {
  height: 40px;
  font-size: 16px;
}
</style>
