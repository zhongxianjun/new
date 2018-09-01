<style lang="less">
    @import '../../styles/common.less';
    @import './marketing-settings.less';
</style>

<template>
<div>
    <Card>
        <div class="advertisement-container">
            <Tabs type="card" closable v-model="tabValue" @on-tab-remove="handleTabRemove" :animated="false">
                <TabPane label="主页" name="home" :closable="false">
                    <div class="container-box">
                        <div class="main-box">
                            <div class="add-search">
                                <div class="add" @click="addAd"> 新增 </div>
                            </div>
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>活动标题</th>
                                    <th>活动描述</th>
                                    <th>广告预览</th>
                                    <th>有效期</th>
                                    <th>操作</th>
                                </tr>
                                <template v-for="(item, index) in adList">
                                    <tr :key="index">
                                        <td>{{item.ID}}</td>
                                        <td>{{item.ADName}}</td>
                                        <td>{{item.ADInfo}}</td>
                                        <td>
                                            <img class="ad-img" :src="item.Img_Url" />
                                        </td>
                                        <td>{{item.EndDate}}</td>
                                        <td class="editor-delete-box">
                                            <div class="editor-delete-b">
                                                <div class="editor-delete">
                                                    <div class="editor" @click="editorAd(item)">编辑</div>
                                                    <div class="delete" @click="deleteAd(item.ID)">删除</div>
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
                            <AtEditor @close-ad="closeAd" :extra="item"></AtEditor>
                        </div>
                    </TabPane>
                </template>
            </Tabs>
        </div>
    </Card>
    <Spin fix v-show="spinShow">
        <img src="@/images/load.gif" style="width:40px;"/>
        <p style="padding-top:20px;">正在为您加载中</p>
    </Spin>
</div>
</template>

<script>
import util from '@/libs/util.js';
import AtEditor from './components/AtEditor.vue';
export default {
    components: {
        AtEditor
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
        loadAdList() {
            this.spinShow = true;
            const UserInfo = util.parseInfo();
            util.http({
                url: '/Interface/MarketApi.ashx',
                params: {
                    action: 'GetMarketAdvertList',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.adList = values.AdvertList;
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
                    this.loadAdList();
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
                if (item.name === data.ADName) {
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
                        label: data.ADName,
                        name: data.ADName,
                        data: data
                    }
                );
                console.log(data.ADName);
                this.$nextTick(() => {
                    this.tabValue = data.ADName;
                });  
            }
        },
        deleteAd(id) {
            console.log(id);
            const UserInfo = util.parseInfo();
            util.http({
                url: '/Interface/MarketAdmin/MarketAdvertApi.ashx',
                params: {
                    action: 'DeleteMarketAdvert',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    ID: id
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.loadAdList();
                }
            });
        }
    },
    mounted () {
        this.loadAdList();
    }
};
</script>
