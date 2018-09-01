<style lang="less">
   @import '../my-service.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-help-outline"></Icon>
                常见问题
            </p>
            <div class="common-problems">
                <Tabs v-model="tabIndex" type="line" :animated="false">
                    <template v-for="(item, index) in helpList">
                        <TabPane :label="item.Name" :name="item.ID">
                            <template v-for="(item, index) in details[tabIndex]">
                                <div class="problems-list">
                                    <h2>{{item.Title}}</h2>
                                    <div v-html="item.Analysis" class="content"></div>
                                </div>
                            </template>
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
export default {
    name: 'common-problems',
    data () {
        return {
            spinShow: false,
            helpList: [],
            details: {},
            tabIndex: null
        };
    },
    watch: {
        tabIndex: {
            handler (val, oldVal) {
                console.log(val, oldVal);
                this.checkDetails(val);
            }
        }
    },
    methods: {
        checkDetails (e) {
            console.log(e);
            if (this.details[e]) {
                return;
            }
            util.http({
                url: '/Interface/HelpApi.ashx',
                params: {
                    action: 'GetNewHelp',
                    TypeID: e
                }
            })
                .then((values) => {
                    console.log(values);
                    this.$set(this.details, e, values.HelpList);
                    this.spinShow = false;
                });
        }
    },
    mounted () {
        this.spinShow = true;

        util.http({
            url: '/Interface/HelpApi.ashx',
            params: {
                action: 'GetHelpType'
            }
        })
            .then((values) => {
                console.log(values);
                this.helpList = values.HelpTypeList;
                this.tabIndex = values.HelpTypeList[0].ID;
                this.spinShow = false;
            });
    }
};
</script>
