<style lang="less" scoped>
  .ad-editor {
    .item-box {
      display: flex; align-items: flex-start; 
      margin-bottom: 18px; 
      h2 {
        font-size: 16px; font-weight: normal;
        line-height: 32px;
        min-width: 100px;
      }
      h3 {
        line-height: 32px; font-weight: normal;
        color: #999;
        font-size: 12px;
      }
      .xianshi {
        line-height: 32px;

        .show-pages {
          
        }
      }
    }

    .confirm {
      margin-top: 16px;
      width: 64px; line-height: 32px;
      background-color: #1890ff;
      border-radius: 4px;
      text-align: center; color: #fff;
      letter-spacing: 2px;
      cursor: pointer;
    }
  }
</style>

<template>
    <div class="ad-editor">

        <div class="item-box">
            <h2>角色名：</h2>
            <Input v-model="GroupName" placeholder="" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>备注：</h2>
            <Input v-model="Descript" placeholder="" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>比率：</h2>
            <Input v-model="Ratio" placeholder="0 ~ 1" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>类别：</h2>
            <Select v-model="Type" style="width:200px" @on-change="changeGroup">
                <Option v-for="item in TypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </div>
        <div class="item-box">
            <h2>权限分配：</h2>
            <div class="xianshi">
              <template v-for="(item, key) in allMenuList">
                <RolePowerpage :extra="item" :key="key"></RolePowerpage>
              </template>
            </div>
        </div>

        <div class="confirm" @click="confirm">确定</div>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import urlencode from 'urlencode';
import RolePowerpage from './RolePowerpage.vue';
export default {
    props: {
      extra: {
        type: Object,
        default: null
      }
    },
    components: {
       RolePowerpage 
    },
    data () {
        return {
            ID: '',
            GroupName: '',
            Descript: '',
            Ratio: '',
            Type: '1',
            TypeList: [
              {
                  value: '1',
                  label: '管理类'
              },
              {
                  value: '2',
                  label: '代理商类'
              },
              {
                  value: '3',
                  label: '会员类'
              }
            ],

            MenuIDs: '',

            allMenuList: []
        }
    },
    computed: {
      
    },
    watch: {
        '$store.state.app.rolePowerExtra': {
            handler(newVal, oldVal) {
                console.log('newVal:', newVal, 'oldVal:', oldVal);
                this.addProp(newVal);
            },
            deep: true
        }
    },
    methods: {
        getMenuId(menuList) { 
            Object.keys(menuList).forEach((item, index) => {
                const value = menuList[item];
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        this.getMenuId(item);
                    });
                } else if (value instanceof Object) {
                    if (value['checked']) {
                        this.MenuIDs += `${value.ID},`;
                    }
                    this.getMenuId(value['children']);
                }
            });
        },
        initPage() {
            const UserInfo = util.parseInfo();
            const extra = this.extra;
            const data = this.extra.data;
            console.log(extra);
            if (extra && data) {
                this.ID = data.ID;
                this.GroupName = data.GroupName;
                this.Descript = data.Descript;
                this.Ratio = data.Ratio;
                this.Type = data.Type;
            }

            this.changeGroup(this.ID);
        },
        async changeGroup(data) {
            console.log(data);
            const UserInfo = util.parseInfo();
            
            let groupMenuList = await util.http({
                url: '/Interface/MarketAdmin/MarketMuneApi.ashx',
                params: {
                    action: 'GetAdminMenuByGroupID',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    GroupID: data
                }
            })
            .then((values) => {
                return values;
            });
            console.log(groupMenuList);

            let allMenuList = await util.http({
                url: '/Interface/MarketAdmin/MarketMuneApi.ashx',
                params: {
                    action: 'GetAllMenu',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken
                }
            })
            .then((values) => {
                let allMenuList = Object.keys(values).map((item, index) => {
                    return values[item];
                });
                return allMenuList;
            });
            
            this.allMenuList = util.initRoleMenu(groupMenuList, allMenuList);
            console.log(this.allMenuList);
            this.MenuIDs = '';
            this.getMenuId(this.allMenuList);
            console.log('MenuIDs:', this.MenuIDs);
        },
        async addProp(newVal) {
            let allMenuList = await util.roleMenuSelect(this.allMenuList, newVal);
            console.log(allMenuList);
            
            this.allMenuList = allMenuList;
            
            this.MenuIDs = '';
            this.getMenuId(allMenuList);
            console.log('MenuIDs:', this.MenuIDs);
        },
        confirm() {
          const UserInfo = util.parseInfo();
          const extra = this.extra;
          const data = this.extra.data;

          let MenuIDs = this.MenuIDs;
          MenuIDs = MenuIDs.substr(0, MenuIDs.length - 1);

          let url;
          let params = {
              UserID: UserInfo.AdminID,
              UserToken: UserInfo.UserToken,

              Type: urlencode(this.Type, 'gbk'),
              GroupName: urlencode(this.GroupName, 'gbk'),
              Descript: urlencode(this.Descript, 'gbk'),
              Ratio: urlencode(this.Ratio, 'gbk'),

              MenuIDs: urlencode(MenuIDs, 'gbk')
          };
          if (extra && data && data.ID) {
            // 修改
            url = '/Interface/MarketAdmin/MarketGroupApi.ashx';
            params = Object.assign(params, {
              action: 'EditUserGroup',
              ID: data.ID
            });
          } else {
            url = '/Interface/MarketAdmin/MarketGroupApi.ashx';
            params = Object.assign(params, {
              action: 'AddUserGroup'
            });
          }
          
          console.log(url, params);

          util.http({
              url: url,
              params: params
          })
          .then((values) => {
              console.log(values);
              if (values.S === '1') {
                this.$Message.info({
                    content: '提交成功',
                    duration: 5,
                    closable: true
                });
                this.$emit('close-ad', extra.name);
              } else {
                  this.$Message.info({
                    content: values.msg,
                    duration: 5,
                    closable: true
                });
              }
          });

        }
    },
    mounted () {
        this.initPage();
    },
    destroyed() {
      
    }
};
</script>
