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
            <h2>活动标题：</h2>
            <Input v-model="ADName" placeholder="" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>活动描述：</h2>
            <Input v-model="ADInfo" placeholder="" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>活动链接：</h2>
            <Input v-model="LinkUrl" placeholder="" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>图片链接：</h2>
            <Input v-model="Img_Url" placeholder="" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>排序：</h2>
            <Input v-model="OrderID" placeholder="" clearable style="width: 300px"></Input>
        </div>
        <div class="item-box">
            <h2>客户端显示：</h2>
            <div class="xianshi">
              <div>
                <Checkbox v-model="Status">启用</Checkbox>
              </div>
              <div>
                <Checkbox v-model="IsPC" :disabled="!Status">PC</Checkbox>
                <Checkbox v-model="IsH5" :disabled="!Status">H5</Checkbox>
                <Checkbox v-model="IsXCX" :disabled="!Status">小程序</Checkbox>
                <Checkbox v-model="IsAndroid" :disabled="!Status">安卓</Checkbox>
                <Checkbox v-model="IsIOS" :disabled="!Status">IOS</Checkbox>
              </div>
            </div>
        </div>
        <div class="item-box">
            <h2>活动时间：</h2>
            <DatePicker type="date" @on-change="startDate" placement="top" :placeholder="StartDate" style="width: 300px"></DatePicker>
            <h3 style="margin: 0 20px;">~</h3>
            <DatePicker type="date" @on-change="endDate" placement="top" :placeholder="EndDate" style="width: 300px;"></DatePicker>
        </div>

        <div class="confirm" @click="confirm">确定</div>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import urlencode from 'urlencode';
export default {
    props: {
      extra: {
        type: Object,
        default: null
      }
    },
    data () {
        return {
            ADName: '',
            ADInfo: '',
            LinkUrl: '',
            Img_Url: '',
            OrderID: '',

            Status: '',
            IsPC: '',
            IsH5: '',
            IsXCX: '',
            IsAndroid: '',
            IsIOS: '',

            StartDate: '开始日期',
            EndDate: '结束日期'
        }
    },
    computed: {
      
    },
    methods: {
        startDate(e) {
          console.log(e);
          this.StartDate = e;
        },

        endDate(e) {
          console.log(e)
          this.EndDate = e;
        },

        confirm() {
          const UserInfo = util.parseInfo();
          const extra = this.extra;
          const data = this.extra.data;
          let url;
          let params = {
              UserID: UserInfo.AdminID,
              UserToken: UserInfo.UserToken,
              ADName: urlencode(this.ADName, 'gbk'),
              ADInfo: urlencode(this.ADInfo, 'gbk'),
              Img_Url: urlencode(this.Img_Url, 'gbk'),
              LinkUrl: urlencode(this.LinkUrl, 'gbk'),
              Status: this.Status ? '1' : '0',
              IsH5: this.IsH5 ? '1' : '0',
              IsAndroid: this.IsAndroid ? '1' : '0',
              IsIOS: this.IsIOS ? '1' : '0',
              IsXCX: this.IsXCX ? '1' : '0',
              IsPC: this.IsPC ? '1' : '0',
              OrderID: urlencode(this.OrderID, 'gbk'),
              StartDate: urlencode(this.StartDate, 'gbk'),
              EndDate: urlencode(this.EndDate, 'gbk')
          };
          if (extra && data && data.ID) {
            // 修改
            url = '/Interface/MarketAdmin/MarketAdvertApi.ashx';
            params = Object.assign(params, {
              ID: data.ID,
              action: 'UpdateMarketAdvert',
            });
          } else {
            // 新增
            url = '/Interface/MarketAdmin/MarketAdvertApi.ashx';
            params = Object.assign(params, {
              action: 'AddMarketAdvert',
            });
          }
          
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
        const extra = this.extra;
        const data = this.extra.data;
        console.log(data);
        if (extra && data) {
          this.ADName = data.ADName;
          this.ADInfo = data.ADInfo;
          this.LinkUrl = data.Url;
          this.Img_Url = data.Img_Url;
          this.OrderID = data.OrderID;

          this.Status = data.Status === '1' ? true : false;
          this.IsPC = data.IsPC === 'True' ? true : false;
          this.IsH5 = data.IsH5 === 'True' ? true : false;
          this.IsXCX = data.IsXCX === 'True' ? true : false;
          this.IsAndroid = data.IsAndroid === 'True' ? true : false;
          this.IsIOS = data.IsIOS === 'True' ? true : false;

          this.StartDate = data.StartDate ? data.StartDate : '开始日期';
          this.EndDate = data.EndDate ? data.EndDate : '结束日期';
        }
    },
    destroyed() {
      
    }
};
</script>
