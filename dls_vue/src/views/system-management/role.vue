<style lang="less">
    @import '../../styles/common.less';
    @import './system-management.less';
</style>

<template>
<div>
    <Card>
        <div class="advertisement-container">
            <Tabs type="card" closable v-model="tabValue" @on-tab-remove="handleTabRemove" :animated="false">
                <TabPane label="全部成员" name="home" :closable="false">
                    <div class="container-box">
                        <div class="main-box">
                            <div class="add-search">
                                <div class="add" @click="addAd"> 新增 </div>
                            </div>
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>角色名</th>
                                    <th>说明</th>
                                    <th>用户组类型</th>
                                    <th>分成比率</th>
                                    <th>操作</th>
                                </tr>
                                <template v-for="(item, index) in adList">
                                    <tr :key="index">
                                        <td>{{item.ID}}</td>
                                        <td>{{item.GroupName}}</td>
                                        <td>{{item.Descript}}</td>
                                        <td>
                                            {{item.Type === '0' ? '超级管理员' : ''}}
                                            {{item.Type === '1' ? '管理类' : ''}}
                                            {{item.Type === '2' ? '代理商类' : ''}}
                                            {{item.Type === '3' ? '会员类' : ''}}
                                        </td>
                                        <td>{{String(item.Ratio * 100) + '%'}}</td>
                                        <td class="editor-delete-box">
                                            <div class="editor-delete-b">
                                                <div class="editor-delete">
                                                    <div class="editor" @click="editorAd(item)">编辑</div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </table>
                        </div>
                    </div>
                </TabPane>

                <template v-for="(item, index) in tabList">
                    <TabPane :label="item.label" :name="item.name" :key="item.name">
                        <div class="container-box">
                            <Role @close-ad="closeAd" :extra="item"></Role>
                        </div>
                    </TabPane>
                </template>
            </Tabs>
        </div>
    </Card>
    <Spin fix v-if="spinShow">
        <img src="@/images/load.gif" style="width:40px;"/>
        <p style="padding-top:20px;">正在为您加载中</p>
    </Spin>
</div>
</template>

<script>
import util from '@/libs/util.js';
import urlencode from 'urlencode';
import Role from './components/Role.vue';
export default {
    components: {
       Role 
    },
    data () {
        return {
            spinShow: false,
            tabValue: '',
            adList: [],
            tabList: []
        }
    },
    computed: {

    },
    methods: {
        loadRoleList() {
            this.spinShow = true;
            const UserInfo = util.parseInfo();
            util.http({
                url: '/Interface/MarketAdmin/MarketGroupApi.ashx',
                params: {
                    action: 'GetUserGroupList',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    types: '1,2,3'
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    let adList = [];
                    values.UserGroupList.forEach((item, index, arr) => {
                        let ID = item.ID;
                        if (
                            (ID === '2')    // 个人会员
                            || (ID === '17')    // VIP用户组
                            || (ID === '24')    // VIP用户组
                            || (ID === '3')    // 企业会员
                        ) {
                            return;
                        } else {
                            adList.push(item);
                        }
                    });
                    this.adList = adList;
                }
                this.spinShow = false;
            });
        },
        handleTabRemove (name) {
            this.closeAd(name, true);
        },
        closeAd(name, current) {
            console.log(name);
            const tabList = this.tabList;
            this.tabList.find((item, index) => {
                if (item.name === name) {
                    console.log(true);
                    tabList.splice(index, 1);
                    this.tabList = tabList;
                    return true;
                }
            });
            if (!current) {
                this.$nextTick(() => {
                    this.tabValue = 'home';
                    this.loadRoleList();
                });
            }    
        },
        addAd() {
            let name = String((this.tabList.length + 2) + 'newaddad');
            this.tabList.push(
                {
                    label: '新增',
                    name: name,
                    data: null
                }
            );
            console.log(name)
            this.$nextTick(() => {
                this.tabValue = name;
            });
            console.log(this.tabList);
        },
        editorAd(data) {
            console.log(data);
            const already = this.tabList.find((item, index) => {
                if (item.name === data.ID) {
                    console.log(true);
                    this.tabValue = item.name;
                    return true;
                } else {
                    return false;
                }
            });
            if (!already) {
                this.tabList.push(
                    {
                        label: data.GroupName,
                        name: data.ID,
                        data: data
                    }
                );
                console.log(data.ID);
                this.$nextTick(() => {
                    this.tabValue = data.ID;
                });  
            }
        }
    },
    mounted () {
        this.loadRoleList();
    }
};
</script>
