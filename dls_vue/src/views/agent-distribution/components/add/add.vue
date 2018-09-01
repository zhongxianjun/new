<style lang="less" scoped>
@import "./add.less";
</style>

<template>
    <div class="add">
        <div class="form" v-if="!successState">
            <Form :model="form" :rules="rules" ref="Form" label-position="right" :label-width="100">
                <FormItem label="账号:" prop="username">
                    <Input v-model="form.username" placeholder="请输入账号" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="密码:" prop="password">
                    <Input :type="pwd" v-model="form.password" placeholder="请输入密码"></Input>
                    <Icon size="16" type="ios-eye-outline" v-if="pwdIconState" @click="changePwdType"></Icon>
                    <Icon size="16" type="ios-eye" v-if="!pwdIconState" @click="changePwdType"></Icon>
                </FormItem>
                <FormItem label="确认密码:" prop="surePwd">
                    <Input :type="surePwd" v-model="form.surePwd" placeholder="请确认密码"></Input>
                    <Icon size="16" type="ios-eye-outline" v-if="surePwdIconState"  @click="changeSurePwdType"></Icon>
                    <Icon size="16" type="ios-eye" v-if="!surePwdIconState"  @click="changeSurePwdType"></Icon>
                </FormItem>
                <FormItem label="角色:" prop="role">
                    <Select v-model="form.role">
                        <Option value="代理商">代理商</Option>
                        <Option value="网络分析员"></Option>
                        <Option value="管理员"></Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit">确认</Button>
                </FormItem>
            </Form>
        </div>

        <div class="success" v-if="successState">
            <Icon type="ios-checkmark" size="72" color="#52c41a"></Icon>
            <div class="title">提交成功</div>
            <p>点击关闭页面。</p>
            <div class="btn">
                <Button type="primary" @click="closePage">关闭</Button>
            </div>
        </div>
    </div>
</template>

<script>
import util from "../../../../libs/util.js";
export default {
  components: {
    
  },
  data() {
    const usernameCheck = (rule, value, callback) => {
        if (value == "") {
            callback(new Error("账号不能为空"));
        } else if (value.trim().length < 6) {
            callback(new Error("账号长度不能少于6"));
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
    const surePwdCheck = (rule, value, callback) => {
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
        username: '',
        password: '',
        surePwd: '',
        role: '代理商'
      },
      rules: {
        username: [
            { required: true, validator: usernameCheck, trigger: 'blur' }
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        surePwd: [
            { required: true, validator: surePwdCheck, trigger: "blur" }
        ],
        role: [
            { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
      },
      //密码框 type
      pwd: 'password',
      surePwd: 'password',
      //密码框Icon的 显示隐藏状态
      pwdIconState: true,
      surePwdIconState: true,
      //提交成功 状态值
      successState: false
    };
  },
  props: {
    disabled: {
        type: Boolean
    },
    account: {
        type: String,
        default: ''
    },
    listArr: {
        type: Array
    },
    current: {
        type: Number
    }
  },
  watch: {
    account(){
        this.form.username = this.account;
    }
  },
  async created() {
   
  },
  mounted() {
    this.form.username = this.account;
  },
  methods: {
    //处理提交
    submit(){
        this.$refs.Form.validate(async (valid) => {
            if(valid){
                var data;
                if(this.disabled){
                    data = await this.EditMember();
                } else {
                    data = await this.AddMember();
                }
                if(data.S == 1){
                    this.successState = true;
                } else {
                    this.$Message.error(data.msg);
                }
            }
        });
    },
    //增加用户接口函数封装
    AddMember(){
        const {AdminID, UserToken, GroupID} = util.parseInfo();
        const {username, password} = this.form;
        return new Promise ((resolve, reject)=>{
            this.$http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: 'AddMember',
                    UserID: AdminID,
                    UserToken,
                    GroupID,
                    UserName: username,
                    PassWord: password
                }
            }).then((res)=>{
                resolve(res);
            })
        })
    },
    //编辑用户接口函数封装
    EditMember(){
        const {AdminID, UserToken, GroupID} = util.parseInfo();
        const {username, password} = this.form;
        return new Promise ((resolve, reject)=>{
            this.$http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: 'EditMember',
                    UserID: AdminID,
                    UserToken,
                    GroupID,
                    TheUserID: username,
                    PassWord: password
                }
            }).then((res)=>{
                resolve(res);
            })
        })
    },
    //关闭页面
    closePage(){
        let listArr = this.listArr;
        let i = this.current;
        this.successState = false;
        this.$emit('close',listArr,i);
    },
    //点击eyes，控制密码框是否加密
    changePwdType(){
        this.pwdIconState = !this.pwdIconState;
        if(this.pwdIconState == true){
             this.pwd = 'password';
        } else {
            this.pwd = 'text';
        }
    },
    changeSurePwdType(){
        this.surePwdIconState = !this.surePwdIconState;
        if(this.surePwdIconState == true){
             this.surePwd = 'password';
        } else {
            this.surePwd = 'text';
        }
    }
  }
};
</script>

<style lang="less">
.add{
    .ivu-form .ivu-form-item-label{
        font-size: 14px;
        color: rgba(0,0,0,.85);
    }
    .ivu-form-item-content{
        display:flex;
        i{
            position: absolute;
            right: 20px;
            top: 50%;
            margin-top: -8px;
        }
    }
    .ivu-input{
        height: 32px;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(0,0,0,.65);
    }
    .ivu-btn{
        margin-left: 455px;
    }
}
</style>
