<style lang="less" scoped>

</style>

<template>
  <div>
      <Card>
          <h2>邀请用户，笔笔提成</h2>
          <p style="margin-top: 14px;">在微信中，通过以下链接或二维码邀请到新用户注册，则此用户之后在PP题库的每笔订单，您都能抽取{{ratio}}提成。</p>
          <div style="margin-top: 14px;">
              <strong>链接：</strong>
              {{linkUrl}}
          </div>
          <div style="margin-top: 14px;">
                <p><strong>二维码：</strong></p>
                <img :src="imgUrl" alt="">
          </div>
      </Card>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import urlencode from 'urlencode';
export default {
    components: {
        
    },
    data() {
        return {
            ratio: '--',
            MchID: '',
            linkUrl: '',
            imgUrl: ''
        };
    },
    computed: {

    },
    methods: {
        loadRoleList() {
            this.spinShow = true;
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
                if (values.S === '1') {
                    return values.UserGroupList;
                } else {
                    return [];
                }
            });
        },
        async init() {
            let roleList = await this.loadRoleList();
            const UserInfo = util.parseInfo();
            console.log(UserInfo);
            let ratio = roleList.find((item, index) => {
                return UserInfo.GroupID = item.ID
            }).Ratio * 100 + '%';
            console.log(ratio);
            this.ratio = ratio;

            let linkUrl = `https://user.ppkao.com/loginAPI/weixin/redirect_to_login.aspx?MchID=${UserInfo.AdminID}`;

            this.linkUrl = linkUrl;

            util.http({
                url: '/Interface/MarketApi.ashx',
                params: {
                    action: 'GetMarketQRCode',
                    UserID: UserInfo.AdminID,
                    UserToken: UserInfo.UserToken,
                    LinkUrl: urlencode(linkUrl, 'gbk')
                }
            })
            .then((values) => {
                console.log(values);
                if (values.S === '1') {
                    this.imgUrl = values.qrcode
                } else {
                    
                }
            });
            



        }
    },
    mounted() {
        this.init()

    },
};
</script>

