<style lang="less">
    
</style>

<template>
    <div class="no-data">
        <img src="@/images/nodata.png" />
        <p>{{data}}</p>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: String,
            default: '没有数据'
        }
    },
    data () {
        return {

        };
    },
    computed: {

    },
    methods: {

    },
    mounted () {

    }
};
</script>

<style lang="less" scoped>
  .no-data {
    display: block;
    padding: 20px 0;
    text-align: center;

    img {
      width: 200px;
    }

    p {
      color: #999;
    }
  }
</style>

