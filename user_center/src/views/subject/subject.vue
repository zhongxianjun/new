<style lang="less" scoped>
@import "./subject.less";
</style>

<template>
    
    <div style="padding:30px">
    
    <Spin  v-if="!SubjectList" fix>
            <img src="@/images/load.gif" style="width:40px;"/>
            <p style="padding-top:20px;">正在为您加载中</p>
    </Spin>
        <Row :gutter="40"  >
            <Col :span="4" class-name="listItem add"> 
            <div class="box"  @click="addKemu">
                <svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianjialeimu"></use></svg>   
                <p>添加科目</p> 
            </div>
            </Col>
            <Col :span="4" v-if="SubjectList.length>0" class-name="listItem" v-for="(item,index) in SubjectList" :key="item.ID"> 
                <div class="item moren">
                    <div class="head">
                        <h6>{{item.TName}}</h6>
                    </div>
                    <svg v-if="item.IsDefault === 'True' " class="icon favorite" aria-hidden="true"><use xlink:href="#icon-moren1"></use></svg>   
                    <svg v-if="item.IsDefault === 'True' && item.IsPayment === 'True'? false: item.IsPayment === 'True'? true:false " class="icon favorite" aria-hidden="true"><use xlink:href="#icon-yigoumai"></use></svg>   
                  <div class="body">
                    <a :href="'https://u.ppkao.com/pc/#/tiku/'+item.Tid +'/chapter'">
                      <div class="practice btns">
                          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-kaoshi"></use></svg>   
                          <p>进入练习</p>
                      </div>
                    </a>
                       <div  @click="setDefault(item.ID)" class="default btns" v-if="item.IsPayment === 'True' &&  item.IsDefault === 'False'">
                          <svg  class="icon icon2" aria-hidden="true"><use xlink:href="#icon-morenxuanzhong"></use></svg>   
                          <p>设置默认</p>
                       </div>
                       <div class="buy btns" @click="BuyKemu({tid:item.Tid,tname:item.TName})" v-if="item.IsPayment === 'False' ">
                          <svg  class="icon icon3" aria-hidden="true"><use xlink:href="#icon-gouwuche2"></use></svg>   
                          <p>购买科目</p>
                      </div>
                  </div>
                   <ButtonGroup v-if="item.IsPayment === 'False' && item.IsDefault !== 'True' "   class="btnGroup">
                        <Button type="primary"   @click="setDefault(item.ID)">设为默认</Button>
                        <Button type="info"  @click="delKemu(item.ID)" >删除科目</Button>
                    </ButtonGroup>
                    <div v-else-if="item.IsDefault !== 'True' || item.IsPayment === 'True'" class="tip">{{item.EndDate}} 到期</div>
                </div>
                
            </Col>
            
        </Row> 
    </div>
</template>

<script>
import gotop from "../../components/backtop/backtop.vue";
import Vue from "vue";
var Event = new Vue(); //事件调度器
export default {
  name: "subject_index",
  data() {
    return {
      SubjectList: false,
      KemuModal: false
    };
  },
  methods: {
    //购买科目
    BuyKemu(data) {
      this.$store.commit("setOpenBuyModal", { ...data });
    },
    addKemu() {
      this.$store.commit("setOpenModal");
      console.log("添加科目");
    },
    async updateKemu(init) {
      this.SubjectList = false;
      let data = await this.$http({
        url: "/Interface/UserSubjectApi.ashx",
        params: {
          action: "GetUserSubject"
        },
        auto: true
      }); //请求用户的科目
      if (data.S == "1") {
        this.SubjectList = data.UserSubjectList;
        console.log(data, "获取用户科目成功");
      } else {
        this.SubjectList = true; //关闭加载层
        console.error("获取用户科目失败", data);
      }
    },
    async setDefault(id) {
      const data = await this.$http({
        url: "/Interface/UserSubjectApi.ashx?",
        params: {
          action: "DefaultSubject",
          id
        },
        auto: true
      });
      if (data.S === "1") {
        this.$Message.success({
          content: "设置默认科目成功,正在为您刷新数据",
          duration: 3
        });
        this.updateKemu();
      } else {
        this.$Message.error({
          content: data.msg,
          duration: 3
        });
      }
    },
    async delKemu(id) {
      const data = await this.$http({
        url: "/Interface/UserSubjectApi.ashx?",
        params: {
          action: "DeleteSubject",
          id
        },
        auto: true
      });
      if (data.S === "1") {
        this.$Message.success({
          content: "删除科目成功,正在为您刷新数据",
          duration: 3
        });
        this.updateKemu();
      } else {
        this.$Message.error({
          content: data.msg,
          duration: 3
        });
      }
    }
  },
  created() {
    const _this = this;
    const { kmid } = this.$route.query;
    if (kmid) {
      this.$Modal.confirm({
        title: "温馨提示",
        content: "抱歉你没有购买该科目,不能练习!如果您已经购买,请重新登录",
        okText: "立即购买",
        cancelText: "重新登录",
        closable: true,
        onOk() {
          _this.BuyKemu({ tid: kmid });
        },
        onCancel() {
          _this.$store.commit("logout", this);
          _this.$store.commit("clearOpenedSubmenu");
          _this.$router.push({ name: "login" });
        }
      });
    }
    console.log("查看路由参数", kmid);
    window.eventHub.$on("updateKemu", () => {
      _this.updateKemu();
    });
  },
  async mounted() {
    this.updateKemu(true);
  }
};
</script>
