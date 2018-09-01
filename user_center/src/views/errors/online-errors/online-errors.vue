<style lang="less">
    @import '../../../styles/common.less';
    @import '../errors.less';
    @import '../../learning-record/learning-record.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-world-outline"></Icon>
                在线考试错题
            </p>
            <div id="errors-conatiner-box">
                <div id="online-errors">
                    <template v-for="(item, index) in errorsList">
                        <RecordItem :key="index" :data="item"  type="online-errors"></RecordItem>
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
import RecordItem from '../../learning-record/RecordItem.vue';
import NoData from '@/components/NoData/NoData.vue';
export default {
    name: 'online-errors',
    components: {
        RecordItem, NoData
    },
    data () {
        return {
            spinShow: true,
            currentPage: 1,
            pageSize: null,
            total: null,
            errorsList: [],
            noData: false
        };
    },
    methods: {
        changePage (e) {
            console.log(e);
            this.currentPage = e;
            this.errorsList = [];
            this.loadErrors();
        },
        loadErrors () {
            this.spinShow = true;

            const { UserID, UserToken } = util.parseInfo();

            util.http({
                url: '/Interface/UserSTRecordApi.ashx',
                params: {
                    action: 'GetUserErrorSJ',
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
                        this.errorsList = values.UserSTRecordList;
                    } else {
                        this.noData = true;
                    }

                    this.spinShow = false;
                });
        }
    },
    created () {

    },
    mounted () {
        this.loadErrors();
    }
};
</script>
