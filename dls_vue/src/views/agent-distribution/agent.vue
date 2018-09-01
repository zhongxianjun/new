<style lang="less" scoped>
@import "./agent.less";
</style>

<template>
  <div class="agent">
    <div class="tablist">
      <div class="all" :class="current == i ? 'current' : ''" v-for="(item,i) in listArr" :key="i" @click="switchClass(item,i)">
        <span>{{item}}</span>
        <Icon type="ios-close" size="18" @click.stop="close(listArr,i)"></Icon>
      </div>
    </div>
    <Card class="card">
        <div class="container" v-if="!status.detailState">
            <div class="title">{{title}}</div>
            <div class="content" v-if="status.contentState">
                <div class="header">
                    <Row :gutter="10" class="btn">
                        <Col><Button @click="tableList">新 增</Button></Col>
                        <Col><Button @click="enable">启 用</Button></Col>
                        <Col><Button @click="disable">停 用</Button></Col>
                    </Row>
                    <Row :gutter="8" class="search">
                        <Input v-model="value" placeholder="根据ID，名称，手机搜索">
                            <span slot="append">
                                <Button type="primary" icon="ios-search" @click="search"></Button>
                            </span>
                        </Input>
                    </Row>
                </div>
                <div class="table">
                    <Table ref="selection" :loading="loading" :columns="columns" :data="TableData" @on-selection-change="handleRowChange"></Table>
                    <Page :total="total" v-if="total >= 11" class-name="page" @on-change="paging"></Page>
                </div>
            </div>

            <add v-if="status.addState==status.editorState? false: true" :disabled="disabled" :account="account" :listArr="listArr" :current="current" @close="close"></add>
        </div>

        <detail v-if="status.detailState"></detail>

    </Card>
    <div class="copyright">
      Copyright © 长沙求知信息技术有限公司
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import util from "../../libs/util.js";
import add from "./components/add/add.vue";
import detail from "./components/detail/detail.vue";
export default {
  components: {
    add,
    detail
  },
  data() {
    return {
      columns: [    
          {
              type: 'selection',
              width: 60,
              align: 'center'
          },
          {
              title: 'ID',
              key: 'ID',
              align: 'center'
          },
          {
              title: '名称',
              key: 'name',
              align: 'center'
          },
          {
              title: '类别',
              key: 'class',
              align: 'center',
              filters: [
                  {
                      label: '代理商',
                      value: '代理商'
                  },
                  {
                      label: '数据分析员',
                      value: '数据分析员'
                  },
                  {
                      label: '管理员',
                      value: '管理员'
                  }
              ],
              filterMethod (value, row) {
                return row.class.indexOf(value) > -1;
              },
              render: (h, params) => {
                return h('Select', {
                    props: {
                        value: params.row.class,
                        placeholder: params.row.class
                    },
                    on: {
                        'on-change': async (e) => {
                            let data = await this.EditMember(params.row.ID);
                            console.log(data);
                            if(data.S == 1){
                                this.$Message.success('修改成功');
                                params.row.class = e;
                            }else{
                                this.$Message.error(data.msg);
                            }
                        }
                    }
                },[
                    h('Option',{
                        props: {
                            value: '代理商'
                        }
                    }),
                    h('Option',{
                        props: {
                            value: '数据分析员'
                        }
                    }),
                    h('Option',{
                        props: {
                            value: '管理员'
                        }
                    })
                ]);
              }
          },
          {
              title: '手机号码',
              key: 'phone',
              align: 'center'
          },
          {
              title: '加入时间',
              key: 'time',
              align: 'center'
          },
          {
              title: '总收入',
              key: 'income',
              align: 'center'
          },
          {
              title: '账户状态',
              key: 'state',
              align: 'center',
              filters: [
                  {
                      label: '正常',
                      value: '正常'
                  },
                  {
                      label: '停用',
                      value: '停用'
                  }
              ],
              filterMultiple: false,
              filterMethod (value, row) {
                if (value === '正常') {
                    return row.state == '正常';
                } else if (value === '停用') {
                    return row.state == '停用';
                }
              }
          },
          {
              title: '操作',
              key: 'screen',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                    h('a', {
                        style: {
                            padding: '0 8px',
                            borderRight: '1px solid rgb(198, 211, 222)'
                        },
                        on: {
                            click: () => {
                                this.current = this.listArr.length;
                                this.listArr.push('编辑:'+params.row.ID);
                                this.status = {
                                    contentState: false,
                                    addState: false,
                                    editorState: true,
                                    detailState: false
                                };
                                this.title = '修改角色';
                                this.account = params.row.ID;
                                this.disabled = true;
                            }
                        }
                    }, '编辑'),
                    h('a', {
                        style: {
                            padding: '0 8px',
                            borderRight: '1px solid rgb(198, 211, 222)'
                        },
                        on: {
                            click: () => {
                                if(params.row.state == '正常'){
                                    this.SettingMemberSta(2, params.row.ID);
                                    params.row.screen = '启用';
                                    params.row.state = '停用';
                                } else {
                                    this.SettingMemberSta(0, params.row.ID);
                                    params.row.screen = '停用';
                                    params.row.state = '正常';
                                }
                            }
                        }
                    }, params.row.screen),
                    h('a', {
                        style: {
                            padding: '0 8px'
                        },
                        on: {
                            click: async () => {
                                this.status = {
                                    contentState: false,
                                    addState: false,
                                    editorState: false,
                                    detailState: true
                                };
                                this.current = this.listArr.length;
                                this.listArr.push(params.row.ID);
                                this.id = params.row.ID;

                                this.detailInfo = params.row;
                                this.$store.commit('setDetailInfo',this.detailInfo);
                            }
                        }
                    }, '查看详情')
                ]);
            }
          }
      ],
      TableData: [
          
      ],
      status: {     //子组件页面的显示隐藏
        contentState: true,
        addState: false,
        editorState: false,
        detailState: false,
      },
      //input框数据绑定
      value: '',
      //页面渲染的变量
      title: '代理商管理',
      current: 0,
      total: 0,
      loading: false,
      listArr: ['全部成员'],
      CurrentPage: 1,
      //多选时使用的变量
      currentRow: '',
      //传给子元素的变量
        //新增、编辑 组件
      disabled: false,
      account: '',
      id: '',
        //详情 组件
      detailInfo: {}
    };
  },
  async created() {

  },
  mounted(){
    this.Table(2, 1, 10);
  },
  computed: {
    
  },
  methods: {
    // 分页点击事件
    paging(value){
      this.Table(2, value, 10);
    },
    //控制页面显示隐藏 函数封装
    async changePage(item){
        this.TableData.map((elem,index)=>{
            if(item == elem.ID || item.substring(3) == elem.ID){
                this.id = elem.ID;
                this.detailInfo = elem;
                this.$store.commit('setDetailInfo',this.detailInfo);
            }
        });

        switch (item) {
            case '全部成员':    //全部成员
                this.status = {
                    contentState: true,
                    addState: false,
                    editorState: false,
                    detailState: false
                };
                this.title = '代理商管理';
                this.Table(2, 1, 10);
                break;
            case '新增角色':    //新增角色
                this.status = {
                    contentState: false,
                    addState: true,
                    editorState: false,
                    detailState: false
                };
                this.title = '添加角色';
                this.disabled = false;
                this.account = '';
                break;
            case this.id:    //查看详情
                this.status = {
                    contentState: false,
                    addState: false,
                    editorState: false,
                    detailState: true
                };

                break;
            default:    //编辑
                this.status = {
                    contentState: false,
                    addState: false,
                    editorState: true,
                    detailState: false
                };
                this.title = '修改角色';
                this.disabled = true;
                this.account = this.id;
                break;
        }
    },
    // 动态添加class
    switchClass(item,i){
        this.current = i;
        this.changePage(item);
    },
    // 动态更改 listArr 新增角色
    tableList(){
        this.current = this.listArr.length;
        this.listArr.push('新增角色');
        this.status = {
            contentState: false,
            addState: true,
            editorState: false,
            detailState: false
        };
        this.title = '添加角色';
        this.disabled = false;
        this.account = '';
    },
    //关闭页面
    close(listArr,i){
        console.log(listArr,i);
        listArr = this.listArr;
        let len = this.listArr.length;
        if(i !== 0){
            this.listArr.splice(i,1);
            if(i < this.current){
                this.current--;
            } else {
                if(i == (len-1)){
                    this.current = 0;
                }
            }
        }
        this.changePage(listArr[this.current]);
    },
    //启用 停用 功能
    //接口调用函数封装
    async SettingMemberSta(Status, UserIDs){
        const {AdminID, UserToken} = util.parseInfo();
        let data = await this.$http({
            url: '/Interface/MarketAdmin/MarketMemberListApi.ashx?',
            params: {
                action: 'SettingMemberSta',
                UserID: AdminID,
                UserToken,
                Status,
                UserIDs
            }
        });
        if(data.S == 1){
            this.$Message.success('修改成功');
        } else {
            this.$Message.error(data.msg);
        }
    },
    async enable(){     //启用
        await this.SettingMemberSta(0, this.currentRow);
        this.Table(2, this.CurrentPage, 10);
    },
    async disable(){   //停用
        await this.SettingMemberSta(2, this.currentRow);
        this.Table(2, this.CurrentPage, 10);
    },
    handleRowChange(currentRow){    //多选事件
        currentRow.map((item,k)=>{
            this.currentRow += item.ID+',';
        });
        let len = this.currentRow.length - 1;
        this.currentRow = this.currentRow.substring(1,len);
    },
    // 获取代理商成员/详情 接口
    GetMeberAgentsList(type, CurrentPage, PageSize){
        const {AdminID, UserToken} = util.parseInfo();
        return new Promise((resolve, reject) => {
            this.$http({
                url:'/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: "GetMeberAgentsList",
                    UserID: AdminID,
                    UserToken,
                    Term: this.value,
                    type,
                    CurrentPage,
                    PageSize
                }
            }).then(res => {
                resolve(res);
            });
        });
    },
    //表格数据渲染函数
    async Table(type, CurrentPage, PageSize){
        this.loading = true;
        this.TableData = [];
        this.CurrentPage = CurrentPage
        let data = await this.GetMeberAgentsList(type, CurrentPage, PageSize);
        this.loading = false;
        console.log(data);
        if(data.S == 1){
            this.total = parseInt(data.CountNum);
            data.UserList.map((elem,i)=>{
                var status = '';
                var text = '';
                let Locked = elem.Locked;
                if(elem.Locked == 0){
                    status = '正常';
                    text = '停用';
                } else {
                    status = '停用';
                    text = '启用';
                }

                this.TableData.push({
                    ID: elem.UserID,
                    name: elem.UserName,
                    class: elem.GroupName,
                    phone: elem.Mobile,
                    time: elem.RegDate,
                    income: elem.RewardMoney,
                    state: status,
                    screen: text
                });
            }); 
        }
    },
    //搜索功能 函数
    async search(){
        if(this.value.trim() !== ''){
            this.total = 1;
            this.loading = true;
            this.TableData = [];

            let data = await this.GetMeberAgentsList(2, 1, 10);
            this.loading = false;

            if(data.S == 1){
                var status = '';
                var text = '';
                let elem = data.UserList[0];
                let Locked = elem.Locked;
                if(elem.Locked == 0){
                    status = '正常';
                    text = '停用';
                } else {
                    status = '停用';
                    text = '启用';
                }
                this.TableData.push({
                    ID: elem.UserID,
                    name: elem.UserName,
                    class: elem.GroupName,
                    phone: elem.Mobile,
                    time: elem.RegDate,
                    income: elem.RewardMoney,
                    state: status,
                    screen: text
                });
            }
        } else {
            this.Table(2, 1, 10);
        }

    },
    //获取用户财务信息 接口调用 函数封装
    GetUserFinanceInfo(){
        const {AdminID, UserToken, UserName} = util.parseInfo();
        return new Promise((resolve, reject) => {
            this.$http({
                url:'/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: "GetUserFinanceInfo",
                    UserID: AdminID,
                    UserToken,
                    UserName 
                }
            }).then(res => {
                resolve(res);
            });
        });
    },
    //修改用户 接口调用 函数封装
    EditMember(TheUserID){
        const {AdminID, UserToken, GroupID} = util.parseInfo();
        return new Promise((resolve, reject) => {
            this.$http({
                url:'/Interface/MarketAdmin/MarketMemberListApi.ashx?',
                params: {
                    action: "EditMember",
                    UserID: AdminID,
                    UserToken: UserToken,
                    GroupID,
                    TheUserID: TheUserID
                }
            }).then(res => {
                resolve(res);
            });
        });
    }
  }
};
</script>

<style>
.ivu-table-wrapper{
    border: 0;
}
.ivu-input{
    height: 40px;
}
.ivu-btn{
    height: 39px;
}
</style>
