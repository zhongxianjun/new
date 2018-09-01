<style lang="less">
@import "./500.less";
</style>

<template>
    <div class="error500">
         <p class="error500-body-con-message">对不起,服务端错误了,玩会游戏在刷新一下</p>
         <div class="error500-btn-con">
            <!-- <Button @click="goHome" size="large" style="width: 200px;" type="primary">返回首页</Button> -->
            <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
            <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
        </div>
        <div class="play">
        <p>玩法：点击小圆点，将小猫圈住！</p>
        <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" name="top10movie" width="640" height="480" id="top10movie">
        <param name="movie" value="https://down.52pojie.cn/.52.swf">
        <param name="quality" value="high">
        <param name="menu" value="false">
        <embed src="https://down.52pojie.cn/.52.swf" width="640" height="480" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" id="top10movie" name="top10movie" menu="false" uc-video-toolbar-id="c02fb8a6-7c1a-8f0e-c675-1530521138904">
        </object>
        </div>
        <!-- <div class="error500-body-con">
            <Card>
                <div class="error500-body-con-title">
                    5<span class="error500-0-span"><Icon type="social-freebsd-devil"></Icon></span><span class="error500-0-span"><Icon type="social-freebsd-devil"></Icon></span>
                </div>
                <p class="error500-body-con-message">对不起,服务端错误了,休息会在刷新一下</p>
                <div class="error500-btn-con">
                    <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
                    <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
                </div>
            </Card>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'Error500',
    methods: {
        backPage () {
            this.$router.go(-1);
        },
        goHome () {
            this.$router.push({
                name: 'home_index'
            });
        }
    }
};
</script>
