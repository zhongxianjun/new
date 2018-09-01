<style lang="less">
    @import '../../styles/common.less';
    @import './system-management.less';
</style>

<template>
<div>
    <Card>
        <div class="menu-container">
            <div class="top">
                <div class="">菜单管理</div> <div class="update" @click="upDateMenu">更新菜单</div>
            </div>

            <div class="table">
                <Row type="flex" align="middle" justify="space-between" class-name="tr thead">
                    <Col span="6" class-name="th">栏目名称</Col>
                    <Col span="4" class-name="th">排序ID</Col>
                    <Col span="4" class-name="th">路由地址</Col>
                    <Col span="4" class-name="th">菜单图标</Col>
                    <Col span="4" class-name="th">操作</Col>
                </Row>
                <template v-for="(item, index) in allMenuList">
                    <MenuPowerpage :extra="item" :padding="0"></MenuPowerpage>
                </template>
            </div>

            <div class="add-main-menu" @click="addMenu({main: true})">
                <span>+</span>增加主菜单
            </div>


            <Modal
                v-model="addMenuShow"
                :title="addMenuTitle"
                @on-ok="addMenuOk"
                @on-cancel="addMenuCancel">

                <div class="parent-option" v-if="parentName">
                    父栏目：{{parentName}}
                </div>

                <div class="add-menu-option">
                    <p>栏目名称</p>
                    <Input v-model="addMenuName" placeholder="" clearable style="width: 300px"></Input>
                </div>
                
                <div class="add-menu-option">
                    <p>排序ID</p>
                    <Input v-model="addMenuOrder" placeholder="" clearable style="width: 300px"></Input>
                </div>
                
                <div class="add-menu-option">
                    <p>路由地址</p>
                    <Input v-model="addMenuPath" placeholder="" clearable style="width: 300px"></Input>
                </div>
                
                <div class="add-menu-option">
                    <p>菜单图标</p>
                    <Input v-model="addMenuIcon" placeholder="" clearable style="width: 300px"></Input>
                </div>
                
            </Modal>
                
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
import MenuPowerpage from './components/MenuPowerpage.vue';
export default {
    components: {
        MenuPowerpage
    },
    data () {
        return {
            spinShow: false,

            allMenuList: {},

            addMenuShow: false,
            addMenuTitle: '',

            parentName: '',
            addMenuName: '',
            addMenuOrder: '',
            addMenuPath: '',
            addMenuIcon: '',

            addMenuUrl: '',
            addMenuParams: {}
        }
    },
    computed: {
        
    },
    watch: {
        '$store.state.app.addMenuExtra': {
            handler(newVal, oldVal) {
                console.log('newVal:', newVal, 'oldVal:', oldVal);
                if (newVal) {
                    this.addMenu(newVal);
                }
            },
            deep: true
        },
        '$store.state.app.deleteMenuExtra': {
            handler(newVal, oldVal) {
                console.log('newVal:', newVal, 'oldVal:', oldVal);
                this.deleteMenu(newVal);
            },
            deep: true
        }
    },
    methods: {
        upDateMenu() {
            this.spinShow = true;

            const UserInfo = util.parseInfo();
            
            util.http({
                url: '/Interface/MarketAdmin/MarketMuneApi.ashx',
                params: {
                    action: 'GetAllMenu',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken
                }
            })
            .then((values) => {
                console.info('所有菜单', values);
                if (values.S === '0') {
                    this.$Message.warning(values.msg);
                } else {
                    this.allMenuList = values;
                }
                this.spinShow = false;
            }); 
        },
        addMenu({
            main = false,
            type = null,
            extra = null
        } = {}) {
            console.log('main:', main, 'type:', type, 'extra', extra )
            const UserInfo = util.parseInfo();
            let addMenuUrl = '';
            let addMenuParams = {};

            if (main) {
                this.addMenuTitle = '新增顶级菜单';
                this.parentName = '';
                addMenuUrl = '/Interface/MarketAdmin/MarketMuneApi.ashx';
                addMenuParams = {
                    action: 'AddMenu',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    ParentID: 0,
                    IsHide: 1,
                    Status: 1
                };
            } else {
                if (type === 'add') {
                    this.addMenuTitle = `新增子菜单`;
                    this.parentName = extra.MenuName;

                    addMenuUrl = '/Interface/MarketAdmin/MarketMuneApi.ashx';
                    addMenuParams = {
                        action: 'AddMenu',
                        UserID: UserInfo.AdminID,
                        UserToken: UserInfo.UserToken,
                        ParentID: extra.ID,
                        IsHide: 1,
                        Status: 1
                    };
                } else if (type === 'editor') {
                    this.addMenuTitle = '编辑菜单';
                    this.parentName = extra.parentName;

                    this.addMenuName = extra.MenuName;
                    this.addMenuPath = extra.PageURL;
                    this.addMenuOrder = extra.OrderID;
                    this.addMenuIcon = extra.Ioc;

                    addMenuUrl = '/Interface/MarketAdmin/MarketMuneApi.ashx';
                    addMenuParams = {
                        action: 'UpdateMenu',
                        UserID: UserInfo.AdminID,
                        UserToken: UserInfo.UserToken,
                        ParentID: extra.ParentID,
                        IsHide: 1,
                        Status: 1,
                        MenuID: extra.ID,
                    };
                }
            }

            this.addMenuUrl = addMenuUrl;
            this.addMenuParams = addMenuParams;
            this.addMenuShow = true;
        },
        addMenuOk() {
            console.log('点击确定');
            let addMenuUrl = this.addMenuUrl;
            let addMenuParams = this.addMenuParams;

            this.addMenuParams = Object.assign(addMenuParams, {
                MenuName: urlencode(this.addMenuName, 'gbk'),
                PageURL: urlencode(this.addMenuPath, 'gbk'),
                OrderID: urlencode(this.addMenuOrder, 'gbk'),
                Ioc: urlencode(this.addMenuIcon, 'gbk')
            });

            console.log(this.addMenuUrl, this.addMenuParams);
            util.http({
                url: this.addMenuUrl,
                params: this.addMenuParams
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.$Message.success(values.msg);
                    this.upDateMenu();
                    this.addMenuCancel();
                } else {
                    this.$Message.error(values.msg);
                }
            }); 
        },
        addMenuCancel() {
            this.addMenuName = '';
            this.addMenuPath = '';
            this.addMenuOrder = '';
            this.addMenuIcon = '';
        },
        deleteMenu(extra) {
            console.log(extra);
            const UserInfo = util.parseInfo();
            util.http({
                url: '/Interface/MarketAdmin/MarketMuneApi.ashx',
                params: {
                    action: 'DeleteMenu',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    MenuID: extra.id
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.$Message.success(values.msg);
                    this.upDateMenu();
                } else {
                    this.$Message.error(values.msg);
                }
            }); 
        }
    },
    mounted () {
        this.upDateMenu();
    }
};
</script>
