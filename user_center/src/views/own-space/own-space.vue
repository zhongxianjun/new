<style lang="less" scoped>
@import "./own-space.less";
</style>

<template>
    <div>
        <Card>
        <Spin fix v-if="!UserInfo.UserID">
            <img src="@/images/load.gif" style="width:40px;"/>
            <p style="padding-top:20px;">正在为您加载中</p>
        </Spin>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息  
            </p>
            <div>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="100" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="用户头像：" class="ava" prop="name">
                      <input ref="file" type="file" style="display:none" name="file" v-if="showFile" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                        <span   @mouseenter="enter">
                          <img :src="UserFace?UserFace:UserInfo.UserFace"/>
                        </span>
                        <transition  enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :duration="600"  >
                       <label for="fileinput1"  v-if="mask"  class="mask" @click="changAva"  @mouseleave="leave">更改头像</label>
                        </transition>
                    </FormItem>
                    <FormItem label="用户姓名：" prop="name">
                        <div style="display:inline-block;width:300px;">
                           
                            <Input  v-model="RealName" ></Input>
                        </div>
                    </FormItem>
                    <FormItem :label="UserInfo.Mobile? '用户手机：':'绑定手机：'" prop="cellphone" >
                        <div style="display:inline-block;width:204px;">
                            <Input v-if="UserInfo.Mobile" :maxlength="11" disabled  :value="UserInfo.Mobile?UserInfo.Mobile.replace(/^(\d{3})\d*(\d{4})$/,'$1****$2'):'' "   ></Input>
                            <Input v-else :autofocus="!always" v-model="userForm.cellphone" :maxlength="11"   ></Input>
                        </div>
                        <div style="display:inline-block;position:relative;">
                            <Button v-if="!UserInfo.Mobile" @click="getIdentifyCode" :disabled="canGetIdentifyCode">{{ gettingIdentifyCodeBtnContent }}</Button>
                            <div class="own-space-input-identifycode-con" v-if="inputCodeVisible">
                                <div style="background-color:white;z-index:110;margin:10px;">
                                    <Input v-model="securityCode" placeholder="请填写短信验证码" ></Input>
                                    <div style="margin-top:10px;text-align:right">
                                        <Button type="ghost" @click="cancelInputCodeBox">取消</Button>
                                        <Button type="primary" @click="submitCode" :loading="checkIdentifyCodeLoading">绑定手机</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="性别：">
                         <RadioGroup v-model="Sex">
                            <Radio label="男">
                                <Icon type="man"></Icon>
                                <span>帅哥</span>
                            </Radio>
                            <Radio  label="女">
                                <Icon type="woman"></Icon>
                                <span>美女</span>
                            </Radio>
                            
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="生日：">
                          <DatePicker @on-change="dateChange" type="date" :placeholder="UserInfo.Birthday && UserInfo.Birthday.replace(/\//g,'-').replace(/\s[\x00-\xff]*/g,'')" style="width: 204px"></DatePicker>
                    </FormItem>
                    <FormItem label="地区：">
                        <al-cascader
                            v-model="res1" 
                            style="width:204px"
                            level="1"
                          
                            placeholder="请选择地区"
                            :render-format="label => label.join(' > ')"
                        />
                    </FormItem>
                    <FormItem label="登录密码：">
                       <Tooltip :disabled="always" content="请先验证手机号在进行修改密码" placement="right">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                        </Tooltip>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
        
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
         
         
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">修改密码</Button>
            </div>
        </Modal>

         <Modal v-model="showCropedImage" @on-visible-change="ModalChange" ok-text="确定上传" :mask-closable="false" @on-ok="cropImage">
              <p slot="header">预览裁剪的图片</p>
                <vue-cropper
                  ref='cropper'
                  :guides="true"
                  :view-mode="2"
                  drag-mode="crop"
                  :auto-crop-area="0.5"
                  :min-container-width="250"
                  :min-container-height="180"
                  :background="true"
                  :rotatable="true"
                  :src="imgSrc"
                  alt="Source Image"
                  :img-style="{ 'width': '400px', 'height': '300px' }">
                  </vue-cropper>
              <!-- <img :src="option1.cropedImg" alt="" v-if="option1.showCropedImage" style="width: 100%;"> -->
          </Modal>
    </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import Cookies from "js-cookie";
import iviewArea from "iview-area";
import alSelector from "./components/al-selector.vue";
import alCascader from "./components/al-cascader.vue";
import md5 from "js-md5";
import axios from "axios";
import util from "@/libs/util.js";
import urlencode from "urlencode";
export default {
  name: "ownspace_index",
  components: {
    alSelector,
    alCascader
  },
  data() {
    const validePhone = (rule, value, callback) => {
      console.log(value, "接受手机号");
      var re = /^1[0-9]{10}$/;
      if (!re.test(value) && !this.UserInfo.Mobile) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      showRes: [],
      imgSrc: "",
      UserFace: "",
      showFile: true,
      showCropedImage: false,
      option1: {
        cropedImg: ""
      },
      res1: [],
      mask: false,
      userForm: {
        name: "",
        cellphone: "",
        sex: ""
      },
      MD5: "",
      securityCode: "", // 验证码
      phoneHasChanged: false, // 是否编辑了手机
      save_loading: false,
      identifyError: "", // 验证码错误
      editPasswordModal: false, // 修改密码模态框显示
      savePassLoading: false,
      oldPassError: "",
      identifyCodeRight: false, // 验证码是否正确
      hasGetIdentifyCode: false, // 是否点了获取验证码
      canGetIdentifyCode: false, // 是否可点获取验证码
      checkIdentifyCodeLoading: false,
      always: true, //控制修改密码提示显示
      inforValidate: {
        name: [{ required: false, message: "请输入姓名", trigger: "blur" }],
        cellphone: [{ validator: validePhone, trigger: "blur" }]
      },
      editPasswordForm: {
        oldPass: "",
        newPass: "",
        rePass: ""
      },
      passwordValidate: {
        oldPass: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        rePass: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: valideRePassword, trigger: "blur" }
        ]
      },
      inputCodeVisible: false, // 显示填写验证码box
      initPhone: "",
      gettingIdentifyCodeBtnContent: "获取验证码" // “获取验证码”按钮的文字
    };
  },
  watch: {
    res1(val) {
      this.showRes = val;
    },
    resDefault(val) {
      this.showRes = val;
    }
  },
  computed: {
    UserInfo() {
      return this.$store.state.user.UserInfo;
    },
    RealName: {
      get() {
        //接收
        return this.$store.state.user.UserInfo.RealName;
      },
      set(val) {
        //赋值
        this.userForm.name = val;

        // this.$store.commit('setTest', val)
      }
    },
    Sex: {
      get() {
        //接收
        return this.$store.state.user.UserInfo.Sex;
      },
      set(val) {
        //赋值

        this.userForm.Sex = val;

        // this.$store.commit('setTest', val)
      }
    }
  },

  methods: {
    ModalChange() {
      this.showFile = true;
    },

    //选择生日
    dateChange(e) {
      this.date = e;
      console.log(e, "获取到日期");
    },
    dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    async cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$store.commit("updateUserFace", this.cropImg);
      this.$store.state.user.UserInfo.UserFace = this.cropImg;
      this.UserFace = this.cropImg;
      let submitPath = await this.$http({
        url: "/Interface/UserApi.ashx?",
        params: {
          action: "AvatarSettings"
        },
        auto: true
      });
      if (submitPath.S == 1) {
        let param = new FormData();
        let blob = this.dataURItoBlob(this.cropImg);
        param.append("file", blob);
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };

        console.log(submitPath, "提交路径");
        axios.post(submitPath.SubmitPath, param, config).then(async res => {
          const data = util._decode(res.data);
          if (data.S == 1) {
            const result = await this.$http({
              url: "/Interface/UserApi.ashx?",
              params: {
                action: "UpdateAvatar",
                UserFace: submitPath.AccessPath + data.FileUrl
              },
              auto: true
            });
            console.log(result, "头像上传结果");
            if (result.S == 1) {
              this.$Message.success("头像修改成功");
              this.$updateUserInfo(this); //更新头像信息
              //头像上传成功
            }
          } else {
            this.$Message.error(data.msg);
          }
        });
      }
    },
    handleChange1(e) {
      console.log(e.target.files, "开始上传头像");
      let file = e.target.files[0];
      if (
        file.type != "image/jpeg" &&
        file.type != "image/png" &&
        file.type != "image/jpg"
      ) {
        this.$Message.error("请选择正确图片格式");
      } else if (file.size > 1048576) {
        //大于1M
        this.$Message.error("请选择小于1M的图片");
      } else {
        this.showCropedImage = true; //裁剪图片显示
        const reader = new FileReader();
        reader.onload = event => {
          this.imgSrc = event.target.result;
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
        this.showFile = false;
      }
    },
    changeMobile(e) {
      console.log(this.$refs.userForm, "页面在输入");
    },
    enter() {
      this.mask = true;
    },
    leave() {
      this.mask = false;
    },
    changAva() {
      console.log(this.$refs.cropper, "开始清空数据");
      this.$refs.cropper.value = null;
    },
    //获取验证码
    getIdentifyCode() {
      this.hasGetIdentifyCode = true;
      this.$refs.userForm.validateField("cellphone", async valid => {
        console.log(this.userForm.cellphone, "手机验证问题");
        if (!valid) {
          let data = await this.$http({
            url: "/Interface/SendSmsApi.ashx?",
            params: {
              action: "SendSmsCode",
              Mobile: this.userForm.cellphone,
              flag: 9,
              MD5: md5(`${this.userForm.cellphone}ppkao.com`)
            },
            auto: true
          });
          this.canGetIdentifyCode = true;
          if (data.S == 1) {
            this.MD5 = data.MD5Code;
            let timeLast = 90;
            let timer = setInterval(() => {
              if (timeLast >= 0) {
                this.gettingIdentifyCodeBtnContent = timeLast + "秒后重试";
                timeLast -= 1;
              } else {
                clearInterval(timer);
                this.gettingIdentifyCodeBtnContent = "获取验证码";
                this.canGetIdentifyCode = false;
              }
            }, 1000);
            this.inputCodeVisible = true;
            //短信发送成功
          } else {
            this.$Message.error(data.msg);
            this.canGetIdentifyCode = false;
          }
        }
      });
    },
    showEditPassword() {
      console.log(this.UserInfo.Mobile);
      if (this.UserInfo.Mobile) {
        this.always = true; //直接可以修改密码
        this.editPasswordModal = true;
      } else {
        this.always = false;
      }
      //
    },
    cancelEditUserInfor() {
      this.$store.commit("removeTag", "ownspace_index");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      let lastPageName = "";
      if (this.$store.state.app.pageOpenedList.length > 1) {
        lastPageName = this.$store.state.app.pageOpenedList[1].name;
      } else {
        lastPageName = this.$store.state.app.pageOpenedList[0].name;
      }
      this.$router.push({
        name: lastPageName
      });
    },
    async saveEdit() {
      this.save_loading = true;
      let Province = "北京",
        City = "北京",
        sex = 1,
        RealName = this.RealName ? this.RealName : "佚名",
        Birthday = this.getNowFormatDate();
      if (this.showRes.length > 1) {
        Province = this.showRes[0].name;
        City = this.showRes[1].name;
      }
      if (this.date) {
        Birthday = this.date;
      }
      if (this.userForm.Sex) {
        sex = this.userForm.Sex == "男" ? 1 : 0;
      }

      const data = await this.$http({
        url: "/Interface/UserApi.ashx?",
        params: {
          action: "UpdateUserInfo",
          RealName: urlencode(RealName, "gbk"),
          sex,
          Birthday: urlencode(Birthday, "gbk"),
          Province: urlencode(Province, "gbk"),
          City: urlencode(City, "gbk")
        },
        auto: true
      });
      console.log(data, "修改信息结果");
      if (data.S == 1) {
        this.$Message.success("恭喜您,修改信息成功");
      } else {
        this.$Message.error(data.msg);
      }
      this.save_loading = false;
    },
    cancelEditPass() {
      this.editPasswordModal = false;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    saveEditPass() {
      //保存信息
      const { newPass, oldPass, rePass } = this.editPasswordForm;
      this.$refs["editPasswordForm"].validate(async valid => {
        if (valid) {
          this.savePassLoading = true;
          const data = await this.$http({
            url: "/Interface/UserApi.ashx?",
            params: {
              action: "UpdatePwd",
              mobile: this.UserInfo.Mobile,
              pwd: oldPass,
              newpwd: rePass,
              MD5: md5(`${this.UserInfo.Mobile}${oldPass}${rePass}ppkao.com`)
            }
          });
          if (data.S == 1) {
            this.editPasswordModal = false;
            this.$Message.success("恭喜您,密码更改成功");
            this.$store.commit("login", { data: data.UserList[0] });
            Cookies.set("password", md5(rePass), { expires: 7 });
            //修改密码成功
          } else {
            this.$Message.error(data.msg);
          }
          this.savePassLoading = false;
          // you can write ajax request here
        }
      });
    },

    cancelInputCodeBox() {
      this.inputCodeVisible = false;
    },
    //验证手机号
    async submitCode() {
      let vm = this;
      vm.checkIdentifyCodeLoading = true;
      if (this.securityCode.length === 0) {
        this.$Message.error("请填写短信验证码");
      } else {
        const data = await this.$http({
          url: "/Interface/SendSmsApi.ashx?",
          params: {
            action: "VerifySMS",
            Mobile: this.userForm.cellphone,
            Code: this.securityCode,
            MD5: this.MD5
          }
        });
        console.log(data, "短信验证结果1");
        if (data.S == 1) {
          //短信验证成功
          let data = await this.$http({
            url: "/Interface/UserApi.ashx?",
            params: {
              action: "BindPhone",
              phone: this.userForm.cellphone,
              code: this.securityCode,
              MD5: this.MD5
            },
            auto: true
          });
          console.log(data, "短信验证结果2");
          if (data.S == 1) {
            this.$Message.success("恭喜您,绑定成功");
            this.$updateUserInfo(this); //更新用户信息
          } else {
            this.$Message.error(data.msg);
          }
          this.inputCodeVisible = false;
          this.checkIdentifyCodeLoading = false;
        } else {
          this.checkIdentifyCodeLoading = false;
          this.$Message.error(data.msg);
        }
      }
    }
  },
  mounted() {
    // this.init();
  }
};
</script>
