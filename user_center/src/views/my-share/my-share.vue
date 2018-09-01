<style lang="less" scoped>
@import "./my-share.less";
</style>

<template>
  <div class="myShare">
    <Card class="container">
      <p slot="title" class="title"><Icon type="android-share"></Icon>{{title}}</p>

      <div class="main"  v-if="!show">
        <Row class="content">
          <Col span="12" class="course" v-for="(item, i) in textList" :key="i">
            <Icon type="ios-paper-outline" size="48" color="#ccc"></Icon>
            <p>{{item.title}}</p>
          </Col>
        </Row>
        <Row class="noData" v-if="textList.length == 0">
          <p>暂时没有分享过试题</p>
        </Row>
        
        <Row class="btn">
          <Button type="primary" @click="shareTest()">立即分享试题</Button>
        </Row>
      </div>

      <share v-if="show" @shareTest="shareTest"></share>
    </Card>
  </div>
</template>

<script>
import axios from "axios";

import share from "./components/share.vue";
export default {
  data() {
    return {
      title: "分享试题",
      textList: [],
      show: false
    };
  },

  components: {
    share
  },

  conputed: {},

  mounted() {},

  methods: {
    //分享试题
    shareTest(show) {
      if (typeof show == "boolean") {
        this.show = show;
      } else {
        this.show = true;
      }
    }
  }
};
</script>

<style lang="less">
</style>
