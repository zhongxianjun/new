<style lang="less">
    @import '../../../styles/common.less';
    @import '../learning-record.less';
</style>


<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="social-buffer"></Icon>
                章节练习记录
            </p>
            <div class="record-list-container-box">
                <div id="record-list-box">
                    <template v-for="(item, index) in recordList">
                        <RecordItem :key="index" :data="item" type="chapter"></RecordItem>
                    </template>
                </div>
                <NoData v-if="noData"></NoData>
                <div class="page-box" v-show="!spinShow && !noData">
                    <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="changePage" show-elevator></Page>
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
import util from '@/libs/util.js';
import Cookies from 'js-cookie';
import RecordItem from '../RecordItem';
import NoData from '@/components/NoData/NoData.vue';
export default {
    name: 'chapter-practice',
    components: {
        RecordItem, NoData
    },
    data () {
        return {
            spinShow: true,
            currentPage: 1,
            pageSize: null,
            total: null,
            recordList: [],
            noData: false
        };
    },
    methods: {
        changePage (e) {
            console.log(e);
            this.currentPage = e;
            this.recordList = [];
            this.loadRecord();
        },
        loadRecord () {
            this.spinShow = true;

            const { UserID, UserToken } = util.parseInfo();

            util.http({
                url: '/Interface/KstkZJApi.ashx',
                params: {
                    action: 'GetUserKstkZJRecord',
                    UserID: UserID,
                    UserToken: UserToken,
                    page: this.currentPage
                }
            })
                .then((values) => {
                    console.log(values);
                    if (values.S === '1') {
                        this.noData = false;
                        this.pageSize = parseInt(values.PageSize);
                        this.total = parseInt(values.CountNum);
                        this.recordList = values.RecordList;
                    } else {
                        this.noData = true;
                    }
                    this.spinShow = false;
                });
        }
    },
    mounted () {
        this.loadRecord();
    },
    destroyed () {

    },
    activated () {

    },
    deactivated () {

    }
};
</script>
