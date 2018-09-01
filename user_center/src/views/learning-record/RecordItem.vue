<style lang="less">
</style>

<template>
    <div class="online-exam" id="record-list">
        <Row v-if="(type === 'online') && !isDelete" type="flex" justify="space-between">
            <Col span="6">  
                <div class="left-box">
                    {{data.AddDate}}
                </div>
            </Col>
            <Col span="12">
                <div class="middle-box">
                    <h2 v-html="data.title"></h2>
                    <h3>类型：{{data.typeName}}</h3>
                </div>
            </Col>
            <Col span="5">
                <div class="right-box">
                    <div class="left">
                        <h2>得分：<span>{{(data.score && (data.score !== '0')) ? data.score : '--'}}</span></h2>
                        <h2>做错：<span>{{data.errorNum}}</span></h2>
                    </div>
                    <div class="middle">
                        <!-- <h2 @click.stop="openUrl('look')">查看答案</h2> -->
                        <h3 @click.stop="openUrl('test')">进入模考</h3>
                    </div>
                    <div class="right">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord()"></Icon>
                    </div>
                </div>
            </Col>
        </Row>

        <Row v-if="(type === 'chapter') && !isDelete" type="flex" justify="space-between">
            <Col span="6">  
                <div class="left-box">
                    {{data.ztdate}}
                </div>
            </Col>
            <Col span="12">
                <div class="middle-box">
                    <h2 v-html="data.zjname"></h2>
                    <h3>类型：{{data.typeName}}</h3>
                </div>
            </Col>
            <Col span="5">
                <div class="right-box">
                    <div class="left">
                        <h2>考试次数：<span>{{data.times}}</span></h2>
                    </div>
                    <div class="middle">
                        <h3 @click.stop="openUrl('test')">进入模考</h3>
                    </div>
                    <div class="right">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord()"></Icon>
                    </div>
                </div>
            </Col>
        </Row>

        <Row v-if="(type === 'daily') && !isDelete" type="flex" justify="space-between">
            <Col span="6">  
                <div class="left-box">
                    {{data.AddDate}}
                </div>
            </Col>
            <Col span="14">
                <div class="middle-box">
                    <h2 v-html="data.tname"></h2>
                    <h3>类型：{{data.typeName}}</h3>
                </div>
            </Col>
            <Col span="4">
                <div class="right-box">
                    <div class="left">
                        
                    </div>
                    <div class="middle">
                        <h3 @click.stop="openUrl('test')">进入模考</h3>
                    </div>
                    <div class="right">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord()"></Icon>
                    </div>
                </div>
            </Col>
        </Row>

        <Row v-if="(type === 'look') && !isDelete" type="flex" justify="space-between">
            <Col span="3">  
                <div class="left-box">
                    {{data.AddDate}}
                </div>
            </Col>
            <Col span="11">
                <div class="middle-box">
                    <h2 v-html="data.title"></h2>
                    <h3>类型：{{data.tname}}</h3>
                </div>
            </Col>
            <Col span="5">
                <div class="right-box">
                    <div class="left">
                        <h2>做题次数：<span>{{data.Times}}</span></h2>
                    </div>
                    <div class="middle">
                        <!-- <h2 @click.stop="openUrl('look')">查看答案</h2> -->
                        <h3 @click.stop="openUrl('test')">查看答案</h3>
                    </div>
                    <div class="right" @click="deleteRecord">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord()"></Icon>
                    </div>
                </div>
            </Col>
        </Row>

        <Row v-if="(type === 'question') && !isDelete" type="flex" align="middle" justify="space-between">
            <Col span="16">
                <div class="left-box" v-html="data.title">
                </div>
            </Col>
            <Col span="4">
                <div class="right-box">
                    <div class="left">
                        
                    </div>
                    <div class="middle">
                        <!-- <h2 @click.stop="openUrl('look')">查看答案</h2> -->
                        <h3 @click.stop="openUrl('test')">查看答案</h3>
                    </div>
                    <div class="right">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord()"></Icon>
                    </div>
                </div>
            </Col>
        </Row>

        <Row v-if="(type === 'paper') && !isDelete" type="flex" align="middle" justify="space-between">
            <Col span="8">  
                <div class="left-box" v-html="data.title">
                </div>
            </Col>
            <Col span="9">
                <div class="middle-box">
                    <div class="progress">
                        <span :style="{width: Number(data.ztnum) / Number(data.examNum) * 100 + '%', 'max-width': '100%'}"></span>
                    </div>
                    <div class="count">
                        {{data.ztnum}}题/{{data.examNum}}题
                    </div>
                </div>
            </Col>
            <Col span="5">
                <div class="right-box">
                    <div class="left">
                       
                    </div>
                    <div class="middle">
                        <!-- <h2 @click.stop="openUrl('look')">查看答案</h2> -->
                        <h3 @click.stop="openUrl('test')">进入模考</h3>
                    </div>
                    <div class="right" @click="deleteRecord">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord()"></Icon>
                    </div>
                </div>
            </Col>
        </Row>

        <Row v-if="(type === 'online-errors') && !isDelete" type="flex" align="middle" justify="space-between">
            <Col span="16">
                <div class="left-box" v-html="data.title">
                </div>
            </Col>
            <Col span="4">
                <div class="right-box">
                    <div class="left">
                        
                    </div>
                    <div class="middle">
                        <!-- <h2 @click.stop="openUrl('look')">查看答案</h2> -->
                        <h3 @click.stop="openUrl('test')">查看答案</h3>
                    </div>
                    <div class="right">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord()"></Icon>
                    </div>
                </div>
            </Col>
        </Row>
        
        <Row v-if="(type === 'chapter-errors') && !isDelete" type="flex" justify="space-between">
            <Col span="3">  
                <div class="left-box">
                    {{data.adddate}}
                </div>
            </Col>
            <Col span="11">
                <div class="middle-box">
                    <h2 v-html="data.title"></h2>
                    <!-- <h3>类型：{{data.tname}}</h3> -->
                </div>
            </Col>
            <Col span="5">
                <div class="right-box">
                    <div class="left">
                        <h2>做题次数：<span>{{data.times}}</span></h2>
                    </div>
                    <div class="middle">
                        <!-- <h2 @click.stop="openUrl('look')">查看答案</h2> -->
                        <h3 @click.stop="openUrl('test')">查看答案</h3>
                    </div>
                    <!-- <div class="right" @click="deleteRecord">
                        <Icon type="ios-trash-outline" @click.stop="deleteRecord"></Icon>
                    </div> -->
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import util from "@/libs/util.js";
import store from "@/store";
export default {
  props: {
    type: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: []
    }
  },
  data() {
    return {
      isDelete: false
    };
  },
  computed: {
    kemuId() {
      return 10884;
    }
  },
  methods: {
    openUrl(mode) {
      const { UserID, UserToken } = util.parseInfo();

      let url;
      switch (this.type) {
        case "online":
          url = `https://u.ppkao.com/pc/#/tiku/${this.kemuId}/paper/${
            this.data.id
          }`;
          break;
        case "chapter":
          url = `https://u.ppkao.com/pc/#/tiku/${this.data.tid}/exam/${
            this.data.tid
          }`;
          break;
        case "daily":
          url = this.data.daurl;
          break;
        case "look":
          // url = `https://u.ppkao.com/pc/#/tiku/6098/answers`;
          url = `${this.data.daurl}`;
          break;
        case "question":
          // url = `https://u.ppkao.com/pc/#/tiku/1077/answers`;
          url = this.data.pcurl;
          // return;
          break;
        case "paper":
          url = `https://u.ppkao.com/pc/#/tiku/${this.data.tid}/paper/${
            this.data.sjid
          }`;
          break;
        case "online-errors":
          // url = `https://u.ppkao.com/pc/#/tiku/890/answers`;
          url = this.data.urlPC;
          // return;
          break;
        case "chapter-errors":
          // url = `https://u.ppkao.com/pc/#/tiku/890/answers`;
          url = this.data.urlPC;
          // return;
          break;
      }

      if (mode === "look") {
        console.log("查看答案");
      } else if (mode === "test") {
        console.log("进入模考");
      }

      console.log(url);
      util.openPage(url);
    },
    deleteRecord() {
      let url;
      const { UserID, UserToken } = util.parseInfo();
      let params = {
        UserID,
        UserToken
      };
      switch (this.type) {
        case "online":
          url = "/Interface/doapi_sj.ashx";
          params = Object.assign(params, {
            action: "DeleteUserSJRecord",
            ID: this.data.id
          });
          // https://data.api.ppkao.com/Interface/doapi_sj.ashx?action=DeleteUserSJRecord&ID=133580&UserID=10669220&UserToken=BY6fPkNMrjvu6fAZkrKcV3btXuL4uoIIBFwHuT%2fuN22kI8To88u0SA%3d%3d
          break;
        case "chapter":
          url = "/Interface/KstkDayApi.ashx";
          params = Object.assign(params, {
            action: "DelUserDayRecord",
            ID: this.data.ID
          });
          // https://data.api.ppkao.com/Interface/KstkDayApi.ashx?action=DelUserDayRecord&ID=916633&UserID=10669220&UserToken=BY6fPkNMrjvu6fAZkrKcV3btXuL4uoIIBFwHuT%2fuN22kI8To88u0SA%3d%3d
          break;
        case "daily":
          url = "/Interface/KstkDayApi.ashx";
          params = Object.assign(params, {
            action: "DelUserDayRecord",
            ID: this.data.ID
          });
          // https://data.api.ppkao.com/Interface/KstkDayApi.ashx?action=DelUserDayRecord&ID=925479&UserID=10669220&UserToken=BY6fPkNMrjvu6fAZkrKcV3btXuL4uoIIBFwHuT%2fuN22kI8To88u0SA%3d%3d
          break;
        case "look":
          url = "/Interface/KSSTRecord.ashx";
          params = Object.assign(params, {
            action: "DelUserAnswerRecord",
            ID: this.data.ID
          });
          // https://data.api.ppkao.com/Interface/KSSTRecord.ashx?action=DelUserAnswerRecord&ID=86452419&UserID=10669220&UserToken=BY6fPkNMrjvu6fAZkrKcV3btXuL4uoIIBFwHuT%2fuN22kI8To88u0SA%3d%3d
          break;
        case "question":
          url = "/Interface/FavoriteApi.ashx";
          params = Object.assign(params, {
            action: "DeleteUserSTFavorite",
            ID: this.data.id
          });
          // https://data.api.ppkao.com/Interface/FavoriteApi.ashx?action=DeleteUserSTFavorite&UserID=10669220&UserToken=BY6fPkNMrjvu6fAZkrKcV3btXuL4uoIIBFwHuT%2fuN22kI8To88u0SA%3d%3d&ID=3411447
          break;
        case "paper":
          url = "/Interface/FavoriteApi.ashx";
          params = Object.assign(params, {
            action: "DeleteUserSJFavorite",
            ID: this.data.id
          });
          // https://data.api.ppkao.com/Interface/doapi_sj.ashx?action=DeleteUserSJRecord&ID=77376&UserID=10669220&UserToken=BY6fPkNMrjvu6fAZkrKcV3btXuL4uoIIBFwHuT%2fuN22kI8To88u0SA%3d%3d
          break;
        case "online-errors":
          url = "/Interface/UserSTRecordApi.ashx";
          params = Object.assign(params, {
            action: "DeleteSJRecord",
            sjid: this.data.sjid
          });
        case "chapter-errors":
          url = "/Interface/UserSTRecordApi.ashx";
          params = Object.assign(params, {
            action: "DeleteUserErrorST",
            Id: this.data.id
          });
          break;
      }
      console.log(this.data, "参数");
      const _this = this;
      this.$Modal.confirm({
        title: "温馨提示,您即将删除这条记录",
        content: "确定删除吗?删除后不可恢复",
        okText: "确定删除",
        cancelText: "算了",
        onOk() {
          util
            .http({
              url,
              params,
              auto: true
            })
            .then(values => {
              console.log(values);

              if (values.S === "1") {
                _this.isDelete = true;
                console.log(this, "-----------");
                this.$Message.success(values.msg);
              } else {
                this.$Message.error(values.msg);
              }
            });
        }
      });
    }
  },
  mounted() {},
  destroyed() {},
  activated() {},
  deactivated() {}
};
</script>

<style lang="less" scoped>
</style>
