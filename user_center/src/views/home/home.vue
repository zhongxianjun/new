<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '20px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" :src="avatorPath" />
                                    </Row>
                                </Col>
                                <Col span="16" style="padding-left:6px;">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <div>
                                            <b class="card-user-infor-name">{{UserInfo.RealName}}</b>
                                            <p class="group" :style="{color:  UserInfo.GroupID == '17'? '#f0703d': UserInfo.GroupID == '24'? '#f0b33d':''}">{{ UserInfo.GroupID == '17'? '超级会员': UserInfo.GroupID == '24'? 'VIP会员':'普通会员' }}</p>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <div class="line-gray"></div>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                                <Col span="16" class="padding-left-8">{{UserInfo.LastLoginTime}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">上次登录地址:</p></Col>
                                <Col span="16" class="padding-left-8">{{add}}</Col>
                            </Row>
                            <Row class="margin-top-8"  wx:if=" UserInfo.EDays > 0 ">
                                <Col span="8"><p class="notwrap">会员有效期:</p></Col>
                                <Col span="16" class="padding-left-8 "><span class="days">{{ UserInfo.EDays }}</span> 天</Col>
                            </Row>
                        </Card>
                    </Col>
                  
                </Row>
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '20px'}">
                       <Carousel autoplay v-model="value"  dots="outside" :autoplay-speed = 3500 >
                        <CarouselItem loop  v-for="(item, index) in picList" :key="index">
                            <div class="demo-carousel"  >
                                <img :src="item.zhutu" v-on:click="viewPicUrl(item.futu)" ></img>
                            </div>
                        </CarouselItem>
                             
                        </Carousel>
                    </Col>
                  
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="Number(UserInfo.Money?UserInfo.Money:0)"
                            iconType="social-yen"
                            color="#2d8cf0"
                            intro-text="可用资金"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="Number(recordNum.favoriteNum)"
                            iconType="android-favorite"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="收藏数量"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="Number(recordNum.CountNum)"
                            iconType="edit"
                            color="#ffd572"
                            intro-text="做题数量"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="Number(recordNum.ErrorsNum)"
                            iconType="close"
                            color="#f25e43"
                            intro-text="错题数量"
                        ></infor-card>
                    </Col>
                </Row>
                <Row>
                    <Card :padding="10">
                        <p slot="title" class="card-title">
                            <Icon type="android-exit"></Icon>
                           快捷通道
                        </p>
                        <Row >
                            <Col span="8">
                                <Row type="flex" justify="center" class-name="card-info">
                                    <div class="kj-info zjlx"></div>
                                    <p class="title">章节练习</p>
                                    <p class="tips">以考点分类，针对性练习，系统性练习不遗漏</p>
                                    <Button type="primary"  @click="zjlx" :style="{marginBottom: '20px'}" >进入练习</Button>
                                </Row>
                            </Col>
                            <Col span="8" >
                                <Row type="flex" justify="center" class-name="card-info" >
                                    <h2 class="search">试题搜索</h2>
                                     <AutoComplete :style="{margin:'6px 0 99px 0'}" @keydown.enter.native="handleSubmit" placement="bottom" size="large" icon="ios-search" v-model="search" placeholder="请输入您想要查找的试题" style="width:200px"  >
                                         <div class="demo-auto-complete-item" >
                                            <div class="demo-auto-complete-group">
                                                <span>历史记录</span>
                                                
                                            </div>
                                            <Option v-for="(item,index) in data4":value="item" :key="index">
                                                <span class="demo-auto-complete-title">{{ item }}</span>
                                               
                                            </Option>
                                        </div>
                                     </AutoComplete>
                                    <Button type="primary"  :style="{marginBottom: '20px'}"  @click="handleSubmit">开始搜索</Button>
                                </Row>
                            </Col>
                            <Col span="8" class="map-incon">
                                 <Row type="flex" justify="center" class-name="card-info">
                                    <div class="kj-info day"></div>
                                    <p class="title">每日一练</p>
                                    <p class="tips">坚持每日一练查看自己对知识点的掌握程度，每天进步多一点。</p>
                                    <Button type="primary"   @click="days"  :style="{marginBottom: '20px'}" >进入练习</Button>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Col>
        </Row>
       
        
    </div>
</template>

<script>
import countUp from "./components/countUp.vue";
import inforCard from "./components/inforCard.vue";
import util from "@/libs/util.js";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";
export default {
  name: "home",
  components: {
    countUp,
    inforCard
  },
  data() {
    return {
      recordNum: {
        CountNum: 0,
        ErrorsNum: 0,
        favoriteNum: 0
      },
      value: 0,
      search: "",
      picList: [
        {
          zhutu: "https://market.ppkao.com/img/tuan.png",
          futu: "https://market.ppkao.com/img/pptuan.jpg"
        },
        {
          zhutu: "https://market.ppkao.com/img/invite.png",
          futu:
            "https://upimg.ppkao.com/Uploads/XCX/Images/24bbb99c062d496a8d13e3ab502ef05f.jpg"
        },
        {
          zhutu: "https://market.ppkao.com/img/cutprice.png",
          futu:
            "https://upimg.ppkao.com/Uploads/XCX/Images/08aee035b7484b9393381831978b5bb2.jpg"
        },
        {
          zhutu: "https://market.ppkao.com/img/hd3.png",
          futu: "https://market.ppkao.com/img/juhua.jpg"
        }
      ],
      defaultKemu: [],
      data4: localStorage.getItem("searchReacord")
        ? JSON.parse(localStorage.getItem("searchReacord"))
        : []
    };
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath;
    },
    UserInfo() {
      return this.$store.state.user.UserInfo;
    },
    add() {
      return Cookies.get("add") ? util.decode(Cookies.get("add")) : "";
    }
  },
  mounted() {
    this.$nextTick(async () => {
      const [data, subject] = await Promise.all([
        this.$http({
          url: "/Interface/KSSTRecord.ashx?",
          params: {
            action: "GetUserRecordNum"
          },
          auto: true,
          openCache: true
        }),
        this.$http({
          url: "/Interface/UserSubjectApi.ashx?",
          params: {
            action: "GetUserSubject"
          },
          auto: true
        })
      ]);

      if (data.S == 1) {
        this.recordNum = data;
      }
      if (subject.S == 1) {
        let defaultKemu = subject.UserSubjectList.filter(
          item => item.IsDefault === "True"
        );
        if (defaultKemu.length === 0) {
          this.defaultKemu = subject.UserSubjectList[0];
        } else {
          this.defaultKemu = defaultKemu[0];
        }
        console.log(defaultKemu, "获取默认科目");
      }
    });
  },
  methods: {
    zjlx() {
      console.log(this.defaultKemu);
      this.$openPage(
        `https://u.ppkao.com/pc/#/tiku/${this.defaultKemu.Tid}/chapter`
      );
    },
    days() {
      const date = new Date();
      this.$openPage(
        `https://u.ppkao.com/pc/#/tiku/${
          this.defaultKemu.Tid
        }/day/${moment().format("YYYY-MM-DD")}`
      );
    },
    handleSubmit() {
      if (!this.search) {
        this.$Message.error({
          content: "输入不能为空",
          duration: 2
        });
        return false;
      }
      let result = this.data4;
      result.unshift(this.search);
      result = Array.from(new Set(result)); //数组去重
      if (result.length > 6) {
        result.pop();
      }

      localStorage.setItem("searchReacord", JSON.stringify(result)); //保存搜索记录
      this.$openPage(`https://u.ppkao.com/pc/#/other/${this.search}/`);
    },
    viewPicUrl(pic) {
      this.$Modal.info({
        title: "打开微信扫一扫",
        render: function(createElement) {
          return createElement("img", {
            attrs: {
              src: pic
            },
            style: {
              display: "block",
              margin: "32px auto 0 auto",
              width: "190px"
            }
          });
        },
        okText: "关闭"
      });
      console.log("预览图片路径", pic);
    }
  }
};
</script>
