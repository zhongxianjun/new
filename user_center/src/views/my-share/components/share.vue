<style lang="less" scoped>
@import "./share.less";
</style>

<template>
  <div class="share">
    <div class="title">
        <Input v-model="value.title" placeholder="在此输入标题..."></Input>
    </div>
    <div class="content">
        <Input type="textarea" v-model="value.content" placeholder="请在此输入试题内容..."></Input>
    </div>
    <div class="choose">
        <div class="options" v-for="(item, i) in options">
            <div class="left">
                {{item.English}}
            </div>
            <div class="right">
                <Input v-model="value.list[i].val" :placeholder="'在此输入'+ item.English +'选项答案...'"></Input>
                <span>选择{{item.English}}选项对或错</span>
                <div class="reallyMiss" @click="choose(i)">
                    <Icon type="checkmark-round" size="36" :color="i == cur?'#419aff':'#cacaca'"></Icon>
                    <Icon type="close-round" size="36" :color="i == cur?'#cacaca':'#ff5e5e'"></Icon>
                </div>
            </div>
        </div>
    </div>
    <div class="tips">
        <div class="title">
            温馨提示
        </div>
        <div class="text">
            <p>1.上传涉及侵权内容的文档将会被移除。如何判断文档是否侵权？查看<a href="javascript: void(0);">上传试题规则</a></p>
            <p>2.上传有问题需要帮助？<a href="javascript: void(0);">查看帮助</a>和<a href="javascript: void(0);">意见反馈</a></p>
            <p>3.为营造绿色网络环境，严禁上传含有淫秽色情及低俗信息等文档，让我们一起携手共同打造健康题库</p>
        </div>
    </div>
    <div class="btn">
        <Button type="primary" @click="submit">确认提交</Button>
        <Button @click="back">不了，点错了</Button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: {
        title: "",
        content: "",
        list: [{ val: "" }, { val: "" }, { val: "" }, { val: "" }]
      },
      options: [
        { English: "A" },
        { English: "B" },
        { English: "C" },
        { English: "D" }
      ],
      cur: 0
    };
  },

  components: {},

  conputed: {},

  mounted() {},

  methods: {
    submit() {
      console.log("提交");
    },
    back() {
      this.$emit("shareTest", false);
    },

    choose(i) {
      this.cur = i;
    }
  }
};
</script>

<style lang="less">
.share {
  .ivu-input {
    border: 0;
  }
  textarea {
    &.ivu-input {
      background: #f3f3f3;
      height: 166px;
      resize: none;
      padding: 15px 30px;
    }
  }
  .ivu-input:focus,
  .ivu-input:hover {
    box-shadow: none;
  }
}
</style>
