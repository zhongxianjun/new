<style lang="less">
    @import '../../styles/common.less';
    @import './system-management.less';
    .options {
        padding: 10px 0 10px 0;

        button {
            margin-right: 5px;
        }
    }
    .page-box {
        padding: 24px 0;
        text-align: center;
    }
</style>

<template>
    <div>
        <Card>
            <div class="options">
                <Button type="primary" icon="md-add" @click="operation({type: 'add'})">新增</Button>
                <Button @click="inUse()">启用</Button>
                <Button @click="outUse()">停用</Button>
            </div>
            <Table border ref="selection" :columns="tabColumns" :data="tabData" @on-selection-change="selectionChange"></Table>
            
            <div class="page-box">
                <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="changePage" show-elevator></Page>
            </div>

            <Modal
                v-model="addMenuShow"
                :title="addMenuTitle"
                @on-ok="addMenuOk"
                @on-cancel="addMenuCancel"
            >

                <div class="add-menu-option">
                    <p>帐号</p>
                    <Input v-model="account" placeholder="" :disabled="operate === 'editor'" :clearable="operate === 'add'" style="width: 300px"></Input>
                </div>
                
                <div class="add-menu-option" v-if="operate === 'add'">
                    <p>密码</p>
                    <Input type="password" v-model="password1" placeholder="" clearable style="width: 300px"></Input>
                </div>
                <div class="add-menu-option" v-if="operate === 'add'">
                    <p>确认密码</p>
                    <Input type="password" v-model="password2" placeholder="" clearable style="width: 300px"></Input>
                </div>

                <div class="add-menu-option" v-if="operate === 'editor'">
                    <p>密码</p>
                    <Input type="password" v-model="password1" placeholder="如不修改密码，则不填此项" clearable style="width: 300px"></Input>
                </div>
                <div class="add-menu-option" v-if="operate === 'editor'">
                    <p>确认密码</p>
                    <Input type="password" v-model="password2" placeholder="如不修改密码，则不填此项" clearable style="width: 300px"></Input>
                </div>
                
                <div class="add-menu-option">
                    <p>角色</p>
                    <Select v-model="Type" style="width:300px" @on-change="changeGroup">
                        <Option v-for="item in TypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                
            </Modal>

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
export default {
    components: {
        
    },
    data () {
        return {
            spinShow: false,
            currentPage: 1,
            pageSize: null,
            total: null,
            
            tabColumns: [],
            tabData: [],

            addMenuShow: false,
            addMenuTitle: '',

            account: '',
            password1: '',
            password2: '',
            Type: '',
            TypeList: [],

            operate: '',

            rowData: {}

        }
    },
    computed: {

    },
    methods: {
        selectionChange(selection) {
            console.log(selection);
            this.selectionGroup = selection;
        },
        loadRoleList() {
            const UserInfo = util.parseInfo();
            return util.http({
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
                return values;
            });
        },
        changePage (e) {
            console.log(e);
            this.currentPage = e;
            this.memberList = [];
            this.getMemberList();
        },
        async getMemberList() {
            this.spinShow = true;
            const UserInfo = util.parseInfo();

            let roleList = await this.loadRoleList();

            let GroupIDs = '';

            let roleGroup = [];
            let TypeList = [];

            if (roleList.S === '1') {
                roleList = roleList.UserGroupList;
                console.log(roleList);
                roleList.forEach((item, index) => {
                    let ID = item.ID;
                    if (
                        (ID === '2')    // 个人会员
                        || (ID === '17')    // VIP用户组
                        || (ID === '24')    // VIP用户组
                        || (ID === '3')    // 企业会员
                    ) {
                        return;
                    } else {
                        GroupIDs = `${GroupIDs},${ID}`;
                        roleGroup.push({
                            value: ID,
                            label: item.GroupName
                        });
                        TypeList.push({
                            value: ID,
                            label: item.GroupName
                        });
                    }
                });
                GroupIDs = GroupIDs.substring(1);
                console.log(GroupIDs);
                console.log(roleGroup);
                this.TypeList = TypeList;
            }

            this.tabColumns = [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '角色',
                    key: 'role',
                    align: 'center',
                    filters: roleGroup,
                    filterMultiple: false,
                    filterMethod (value, row) {
                        console.log(value);
                        return row.GroupID === value;
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    filters: [
                        {
                            label: '正常',
                            value: '0'
                        },
                        {
                            label: '锁定',
                            value: '1'
                        },
                        {
                            label: '待审核',
                            value: '2'
                        },
                        {
                            label: '待激活',
                            value: '3'
                        }
                    ],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        return row.Locked === value;
                    }
                },
                {
                    title: '操作',
                    key: 'operate',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#419aff'
                                },
                                on: {
                                    click: () => {
                                        console.log(params);
                                        this.operation({type: 'editor', data: params});
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#419aff'
                                },
                                on: {
                                    click: () => {
                                        console.log(params);
                                        if (params.row.Locked === '0') {
                                            this.outUse(params);
                                        } else if (params.row.Locked === '2') {
                                            this.inUse(params);
                                        }
                                    }
                                }
                            }, `${params.row.Locked === '0' ? '停用' : ''}${params.row.Locked === '2' ? '启用' : ''}`)
                        ]);
                    }
                }
            ];

            util.http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx',
                params: {
                    action: 'GetMemberList',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    GroupIDs: GroupIDs,
                    CurrentPage: this.currentPage,
                    PageSize: 20
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.pageSize = parseInt(values.PageSize);
                    this.total = parseInt(values.CountNum);

                    this.tabData = values.UserList.map((item, index) => {
                        return Object.assign(item, {
                            id: item.UserID,
                            name: item.UserName,
                            role: item.GroupName,
                            status: `${item.Locked === '0' ? '正常' : ''}${item.Locked === '1' ? '锁定' : ''}${item.Locked === '2' ? '待审核' : ''}${item.Locked === '3' ? '待激活' : ''}`,
                            operate: ''
                        });
                    });
                } else {
                    this.$Message.error(values.msg);
                }
                this.spinShow = false;
            });
        },
        operation({
            type = null,
            data = null
        } = {}) {
            console.log(type, data);
            this.account = '';
            this.password1 = '';
            this.password2 = '';
            this.rowData = '';

            if (type === 'add') {
                this.operate = 'add';
                this.addMenuTitle = '新增';
                this.Type = this.TypeList[0].value;
            } else if (type === 'editor') {
                this.operate = 'editor';
                this.addMenuTitle = '编辑';
                this.Type = data.row.GroupID;
                this.account = data.row.UserName;
                this.rowData = data.row;
            }
            this.addMenuShow = true;
        },
        changeGroup(data) {
            console.log(data);
        },
        addMenuOk() {
            console.log('点击确定');
            
            let account = this.account;
            let password1 = this.password1;
            let password2 = this.password2;
            let Type = this.Type;
            console.log(account, password1, password2, Type);

            let password = '';

            if (password1 === password2) {
                password = password1;
            } else {
                this.$Message.error('两次密码不一致！');
                setTimeout(() => {
                    this.addMenuShow = true;
                }, 100);
                return;
            }

            const UserInfo = util.parseInfo();
            let url = '';
            let params = {
                UserID: UserInfo.AdminID,
                UserToken: UserInfo.UserToken
            };

            let operate = this.operate;
            if (operate === 'add') {
                url = '/Interface/MarketAdmin/MarketMemberListApi.ashx';
                params = Object.assign(params, {
                    action: 'AddMember',
                    GroupID: Type,
                    UserName: account,
                    PassWord: password
                });
            } else if (operate === 'editor') {
                url = '/Interface/MarketAdmin/MarketMemberListApi.ashx';
                params = Object.assign(params, {
                    action: 'EditMember',
                    GroupID: Type,
                    TheUserID: this.rowData.UserID
                });
                if (password) {
                    params = Object.assign(params, {
                        PassWord: password
                    });
                }
            }

            util.http({
                url: url,
                params: params
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.getMemberList();
                    this.$Message.success(values.msg);
                } else {
                    setTimeout(() => {
                        this.addMenuShow = true;
                    }, 100);
                    this.$Message.error(values.msg);
                }
            });
        },
        addMenuCancel() {
            console.log('取消');
        },
        inUse(data) {
            console.log('启用', data);
            if (data) {
                this.changeSataus({Status: 0, UserIDs: data.row.UserID});
            } else {
                let selectionGroup = this.selectionGroup ? this.selectionGroup : [];
                console.log(selectionGroup);
                let UserIDs = '';

                if (!selectionGroup.length) {
                    this.$Message.error('请选择');
                    return;
                } else {
                    selectionGroup.forEach((item, index) => {
                        UserIDs += `,${item.UserID}`
                    });
                    this.changeSataus({Status: 0, UserIDs: UserIDs.substring(1)});
                }
            }
        },
        outUse(data) {
            console.log('停用', data);
            if (data) {
                this.changeSataus({Status: 2, UserIDs: data.row.UserID});
            } else {
                let selectionGroup = this.selectionGroup ? this.selectionGroup : [];
                console.log(selectionGroup);
                let UserIDs = '';

                if (!selectionGroup.length) {
                    this.$Message.error('请选择');
                    return;
                } else {
                    selectionGroup.forEach((item, index) => {
                        UserIDs += `,${item.UserID}`
                    });
                    this.changeSataus({Status: 2, UserIDs: UserIDs.substring(1)});
                }
            }
        },
        changeSataus({
            Status = null,
            UserIDs = null
        } = {}) {
            const UserInfo = util.parseInfo();

            util.http({
                url: '/Interface/MarketAdmin/MarketMemberListApi.ashx',
                params: {
                    action: 'SettingMemberSta',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    Status: Status,
                    UserIDs: UserIDs
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.getMemberList();
                    this.$Message.success(values.msg);
                } else {
                    this.$Message.error(values.msg);
                }
            });

        }
    },
    mounted () {
        this.getMemberList();
    }
};
</script>
