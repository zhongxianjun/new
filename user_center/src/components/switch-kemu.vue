<template>
        <div class="dialogBox" >
        <div class="dialogWrap">
            <div class="closeDialog" @click="closeModal">
                 <Spin v-if="status" size="large" fix ></Spin>
              <svg  class="icon favorite" aria-hidden="true"><use xlink:href="#icon-guanbi1"></use></svg>   
            </div>
            <header>
              <div>
              <span>切换科目</span>
              <a href="javascript:;"  v-if="KemuArr.length>0" @click="back">返回上一级</a>
              </div>
              <Input v-model="value" icon="ios-search" @on-enter="search" @on-click="search" placeholder="搜索科目" style="width: 200px"></Input>
            </header>
            <p class="menu" v-if="KemuArr.length>0">
               
              <span  v-for="(item,index) in KemuArr" :key="item.tid" @click="selectKemu(item.tid,{back:true,index})" >&nbsp;{{item.tname === '全部考试'? '':'&gt;'}}&nbsp;{{item.tname}}</span>
            </p>
           
            <div style="padding: 20px;position:relative;height: 400px;overflow: auto;">
              <nodata v-if="searchResult == 2" />
              <template v-else>
              <Row :gutter="20"  v-if="!KemuList" >
              <Col :span="4"  @click.native="selectKemu(item.tid,{tname:'全部考试',home:true})" v-for="item in types" :key="item.tid" class-name="listItem"> 
                <svg  class="icon" aria-hidden="true">
                  <use :xlink:href="item.id"></use>
                  </svg>   
                <p>{{item.tname}}</p>
              </Col>
              </Row> 
               <div class="textList" v-else>
                  <span v-for="item in KemuList" @click="selectKemu(item.id,{tname:item.tname})"  :key="item.id">{{item.tname}}</span>
               </div>
               </template>
          </div>
        </div>
      </div>
   
</template>
<script>
import Vue from "vue";
import types from "./types.js";
import urlencode from "urlencode";
import nodata from "./NoData/NoData.vue";
var Event = new Vue(); //事件调度器
export default {
  components: {
    nodata
  },
  data() {
    return {
      value: "",
      types,
      KemuList: "",
      searchResult: "",
      KemuArr: [], //科目层次
      status: false //控制load开关
    };
  },
  name: "switch-kemu",
  props: {
    open: Boolean
  },
  computed: {
    openModal() {
      return this.$store.state.app.openModal;
    }
  },

  methods: {
    //选择科目
    async selectKemu(tid, json) {
      console.log(json);
      let { flag, tname, home, back, index } = json;
      this.status = true;
      if (index === 0) {
        this.KemuList = "";
        this.KemuArr = [];
        this.searchResult = "";
      } else {
        const data = await this.$http({
          url: "/Interface/KSTKClassAPI.ashx",
          params: {
            action: "GetKSTKClassByID",
            id: tid,
            isflag: flag ? flag : "1,2"
          },
          openCache: true
        });
        if (data.S === "1") {
          //获取到科目数据

          if (flag == 3) {
            //选择好科目 了
            this.setInfo(tid);
          } else {
            if (tname && !back) {
              this.KemuArr.push({ tname: tname, tid, home });
            } else if (back) {
              if (index != this.KemuArr.length - 1) {
                this.KemuArr.splice(index + 1, this.KemuArr.length - 1);
              }
            }
            this.KemuList = data.KSTKList;
          }
        } else {
          //暂无科目数据  tid  就是选择好的科目信息了

          if (flag) {
            //查询第三个还是没有数据

            this.setInfo(tid);
          } else {
            this.selectKemu(tid, { flag: 3 });
          }
        }
      }
      this.status = false;
    },
    //搜索科目
    async search() {
      this.status = true;
      const data = await this.$http({
        url: "/Interface/KSTKClassAPI.ashx?",
        params: {
          action: "SelectKSTKClass",
          tname: urlencode(this.value, "gbk"),
          isflag: "1,2"
        }
      });
      if (data.S == 1) {
        this.searchResult = 1;
        this.KemuArr = [{ tname: "全部考试", home: true }];
        this.KemuList = data.KSTKList;
      } else {
        this.KemuArr = [{ tname: "全部考试", home: true }];
        //无搜索结果
        this.searchResult = 2;
      }
      this.status = false;
    },
    //返回上一级
    back() {
      if (this.KemuArr.length > 1) {
        this.KemuArr.pop();
        this.selectKemu(this.KemuArr[this.KemuArr.length - 1].tid, {});
        console.log(this.KemuArr);
      } else {
        this.KemuList = "";
        this.KemuArr = [];
        this.searchResult = "";
      }
    },
    //设置科目
    async setInfo(tid) {
      let defaultKemu = this.KemuList.filter(item => item.id === tid);

      localStorage.setItem("ksid", tid); //设置全局科目ID
      localStorage.setItem("ksname", defaultKemu[0].tname); //设置科目名称
      localStorage.setItem("kmsjid", defaultKemu[0].kstid); //是个考试ID
      this.status = true;
      const data = await this.$http({
        url: "/Interface/UserSubjectApi.ashx",
        params: {
          action: "AddUserSubject",
          Tid: tid
        },
        auto: true
      });
      if (data.S === "1") {
        this.status = false;
        console.log("选择默认科目成功");
        window.eventHub.$emit("updateKemu");
        this.$store.commit("setOpenModal");
      } else {
        this.status = false;
      }
    },
    closeModal() {
      this.$store.commit("setOpenModal");
    }
  },

  mounted() {}
};
</script>
<style lang="less" scoped>
.icon {
  width: 3.6em;
  height: 5.3em;
}
.listItem:hover {
  box-shadow: 0 2px 10px #ddd;
}
.listItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin-top: 14px;
  cursor: pointer;
  p {
    line-height: 34px;
  }
}
.menu {
  line-height: 40px;
  font-size: 14px;
  color: #a5a5a5;
  span {
    cursor: pointer;
  }
}
.textList {
  span {
    font-size: 14px;
    color: #333;
    padding: 10px;
    width: 200px;
    display: inline-block;
    cursor: pointer;
  }
}
.dialogBox {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  header {
    border-bottom: 1px solid #f2f2f2;
    height: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 16px;
    }
  }
}

.dialogWrap {
  width: 740px;
  height: 530px;
  padding: 0 30px 30px 30px;
  background: #fff;
  position: relative;
  border-radius: 8px;
}
.closeDialog {
  cursor: pointer;
  svg {
    position: absolute;
    right: -1.5em;
    border-radius: 50%;
    top: -1.5em;
    z-index: 999;
    width: 3em;
    background-color: #fff;
    fill: #b9b9b9;
    height: 3em;
    box-shadow: 0px 1px 14px 0px rgba(0, 0, 0, 0.2);
  }
  svg:hover {
    animation: mymove 1s 1;
  }
}
@keyframes mymove {
  from {
    transform: none;
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
