<style lang="less">
@import "../../../styles/common.less";
@import "../money.less";
</style>

<template>
    <div>
        <div class="record-box">
            <div class="record">
                <template v-for="(item, index) in consumeList">
                  <div class="item" :key="index">
                    <Row type="flex" align="middle" justify="space-between">
                      <Col span="3">
                        <div class="time">{{item.PayTime}}</div>
                      </Col>
                      <Col span="3">
                        <div>
                          {{ `${item.IncomeOrPayOut === '1' ? '收入' : ''}${item.IncomeOrPayOut === '2' ? '支出' : ''}` }}
                        </div>
                      </Col>
                      <Col span="3">
                        <div :style="{color: `${item.IncomeOrPayOut === '1' ? 'rgb(51, 204, 0)' : ''}${item.IncomeOrPayOut === '2' ? 'rgb(255, 51, 0)' : ''}`}">
                          {{ `${item.IncomeOrPayOut === '1' ? '+' + parseFloat(item.Money).toFixed(2) : ''}${item.IncomeOrPayOut === '2' ? '-' + parseFloat(item.Money).toFixed(2) : ''}` }}
                        </div>
                      </Col>
                      <Col span="8">
                        <div>{{item.Remark}}</div>
                      </Col>
                      <Col span="4">
                        <div>可用余额：{{parseFloat(item.CurrMoney).toFixed(2)}}</div>
                      </Col>
                    </Row>
                  </div>
                </template>
            </div>
            <NoData v-if="noData"></NoData>
            <div class="page-box" v-show="!spinShow && !noData">
                <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="changePage" show-elevator></Page>
            </div>
        </div>
        <Spin fix v-if="spinShow">
            <img src="@/images/load.gif" style="width:40px;"/>
            <p style="padding-top:20px;">正在为您加载中</p>
        </Spin>
    </div>
</template>

<script>
import util from "@/libs/util.js";
import NoData from "@/components/NoData/NoData.vue";
export default {
  components: {
    NoData
  },
  data() {
    return {
      spinShow: false,
      currentPage: 1,
      pageSize: null,
      total: null,
      consumeList: "",
      noData: false
    };
  },
  computed: {},
  methods: {
    getRecord() {
      this.spinShow = true;

      util
        .http({
          url: "/Interface/LogMoneyApi.ashx",
          params: {
            action: "GetUserLogMoney",
            page: this.currentPage
          },
          auto: true
        })
        .then(values => {
          console.log(values);
          if (values.S === "1") {
            this.noData = false;
            this.pageSize = parseInt(values.PageSize);
            this.total = parseInt(values.CountNum);
            this.consumeList = values.LogMoneyList;
          } else {
            this.noData = true;
          }
          this.spinShow = false;
        });
    },
    changePage(e) {
      console.log(e);
      this.currentPage = e;
      this.consumeList = [];
      this.getRecord();
    }
  },
  mounted() {
    this.getRecord();
  }
};
</script>
