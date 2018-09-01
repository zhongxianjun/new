<style lang="less">
    @import '../../styles/common.less';
    @import './marketing-settings.less';
    .ivu-input-disabled {
        color: #999 !important;
    }
</style>

<template>
    <div>
        <Card>
            <div class="invoice-container">
                <div class="invoice-info">
                    <div class="invoice-title">
                        <p>发票信息</p>
                        <span @click="infoEdite">编辑</span>
                    </div>
                    <div class="invoice-content">
                        <aside>
                            <h2>发票抬头：</h2><Input v-model="invoiceTitle" :disabled="!infoAble" placeholder="" style="width: 300px"></Input>
                        </aside>
                        <aside>
                            <h2>开票内容：</h2><Input v-model="invoiceContent" :disabled="!infoAble" placeholder="" style="width: 300px"></Input>
                        </aside>
                        <aside>
                            <h2>求知税号：</h2><Input v-model="invoiceDuty" :disabled="!infoAble" placeholder="" style="width: 300px"></Input>
                        </aside>
                        <aside>
                            <h2>发票类型：</h2><Input v-model="invoiceType" :disabled="!infoAble" placeholder="" style="width: 300px"></Input>
                        </aside>

                        <div class="operation" v-if="infoAble">
                            <p @click="infoCancel">取消</p><p @click="infoOk">确定</p>
                        </div>
                    </div>
                </div>
                <div class="invoice-address">
                    <div class="invoice-title">
                        <p>发票邮寄地址</p>
                        <span @click="addressEdite">编辑</span>
                    </div>
                    <div class="invoice-content">
                        <aside>
                            <h2>公司地址：</h2><Input v-model="companyAddress" :disabled="!addressAble" placeholder="" style="width: 300px"></Input>
                        </aside>
                        <aside>
                            <h2>收件人：</h2><Input v-model="recipients" :disabled="!addressAble" placeholder="" style="width: 300px"></Input>
                        </aside>
                        <aside>
                            <h2>电话：</h2><Input v-model="phoneNum" :disabled="!addressAble" placeholder="" style="width: 300px"></Input>
                        </aside>
                        <aside>
                            <h2>邮编：</h2><Input v-model="postCode" :disabled="!addressAble" placeholder="" style="width: 300px"></Input> 
                        </aside>

                        <div class="operation" v-if="addressAble">
                            <p @click="addressCancel">取消</p><p @click="addressOk">确定</p>
                        </div>
                    </div>
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
export default {
    components: {
        
    },
    data () {
        return {
            spinShow: false,

            infoAble: false,
            invoiceTitle: '长沙求知信息技术有限公司',
            invoiceContent: '信息服务费/技术服务费',
            invoiceDuty: '911515451516415N',
            invoiceType: '普通增值税',

            addressAble: false,
            companyAddress: '湖南省长沙市雨花区宽寓大厦2106',
            recipients: '长沙求知',
            phoneNum: '0731-88888888',
            postCode: '410000'
        }
    },
    computed: {

    },
    methods: {
       infoEdite() {
           this.infoAble = true;

       },
       infoCancel() {
           this.infoAble = false;
       },
       infoOk() {
           this.infoAble = false;
       },

       addressEdite() {
           this.addressAble = true;
       },
       addressCancel() {
           this.addressAble = false;
       },
       addressOk() {
           this.addressAble = false;
       }
    },
    mounted () {
        
    }
};
</script>
