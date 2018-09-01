<style lang="less">
    @import '../../../styles/common.less';
    @import '../collect.less';
    @import '../../learning-record/learning-record.less';
</style>

<template>
   <div>
        <Card>
            <p slot="title">
                <Icon type="compose"></Icon>
                试题收藏
            </p>
            <div id="collect-conatiner-box">
                <div id="questions-box">
                    <template v-for="(item, index) in collectList">
                        <QuestionItem :key="index" :data="item"  type="question"></QuestionItem>
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
import QuestionItem from '../../learning-record/RecordItem.vue';
import NoData from '@/components/NoData/NoData.vue';
export default {
    name: 'questions',
    components: {
        QuestionItem, NoData
    },
    data () {
        return {
            spinShow: true,
            currentPage: 1,
            pageSize: null,
            total: null,
            collectList: [],
            noData: false
        };
    },
    methods: {
        changePage (e) {
            console.log(e);
            this.currentPage = e;
            this.collectList = [];
            this.loadCollect();
        },
        loadCollect () {
            this.spinShow = true;

            const { UserID, UserToken } = util.parseInfo();
            util.http({
                url: '/Interface/FavoriteApi.ashx',
                params: {
                    action: 'GetUserSTFavorite',
                    UserID: UserID,
                    UserToken: UserToken,
                    Page: this.currentPage
                }
            })
                .then((values) => {
                    console.log(values);
                    if (values.S === '1') {
                        this.noData = false;
                        this.pageSize = parseInt(values.PageSize);
                        this.total = parseInt(values.CountNum);
                        this.collectList = values.FavoriteList;
                    } else {
                        this.noData = true;
                    }

                    this.spinShow = false;
                });
        }
    },
    computed: {

    },
    mounted () {
        this.loadCollect();
    },
    destroyed () {

    }
};
</script>
