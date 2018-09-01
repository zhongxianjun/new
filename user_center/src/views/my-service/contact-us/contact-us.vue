<style lang="less">
@import "../my-service.less";
</style>

<template>
    <div>
       <Card>
            <p slot="title">
                <Icon type="ios-telephone-outline"></Icon>
                联系我们
            </p>
            <div class="contact-us">
                <div class="jieshao">
                    <h1>长沙求知信息技术有限公司</h1>
                    <i></i>
                    <p>长沙求知信息技术有限公司正式成立于2014年，创业于2008年，是国内专业从事互联网教育的综合型网络科技公司。公司集网站内容建设、网站运营、互联网技术支持与服务于一体，经过多年不懈努力与发展，旗下主打产品PPkao考试资料网已打造成为综合型教育门户网站，PP题库产品已汇聚了众多职场职称学习者，致力打造专业的互联网学习平台，为用户提供便捷、优质、全方位的网络学习产品和服务。</p>
                    <ul>
                        <li>
                            <div class="icon">
                                <Icon type="navigate"></Icon>
                            </div>
                            <div class="info">
                                <h2>公司名称</h2>
                                <p>长沙求知信息技术有限公司</p>
                            </div> 
                        </li>
                        <li>
                            <div class="icon">
                                <Icon type="ios-telephone"></Icon>
                            </div>
                            <div class="info">
                                <h2>客服电话</h2>
                                <p>400-000-9581 (9:00--18:00)</p>
                            </div> 
                        </li>
                        <li>
                            <div class="icon">
                                <Icon type="chatbox-working"></Icon>
                            </div>
                            <div class="info">
                                <h2>客服QQ</h2>
                                <a :href="kefuTime" target="_blank">800100119</a>
                            </div> 
                        </li>
                    </ul>
                </div>
            </div>
        </Card>
        <Spin fix v-if="spinShow">
            <img src="@/images/load.gif" style="width:40px;"/>
            <p style="padding-top:20px;">正在为您加载中</p>
        </Spin>
    </div>
</template>

<script>
export default {
  name: "contact-us",
  data() {
    return {
      spinShow: false
    };
  },
  computed: {
    kefuTime() {
      return this.$store.state.app.kefuTime;
    }
  },
  methods: {},
  mounted() {}
};
</script>
