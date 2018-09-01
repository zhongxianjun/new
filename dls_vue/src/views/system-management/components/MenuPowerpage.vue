<style lang="less" scoped>
    .parent-menu {
        position: relative;
        .ivu-icon {
            position: absolute; left: 0; top: 50%; transform: translateY(-50%); z-index: 9;
            cursor: pointer;
            text-align: center;
            color: #419aff;
        }
    }
    .child-menu {
        transition: all 0.2s;
    }
    .ivu-poptip-popper {
        z-index: 10;
    }
</style>

<template>
    <div>
        <div class="parent-menu">
            <Icon @click="handleCollapse" :style="{left: 30 * padding + 10 + 'px'}" :type="collapse ? 'ios-arrow-down' : 'ios-arrow-forward'" size="20" v-if="extra.children && extra.children.length" />
            <Row type="flex" align="middle" justify="space-between" class-name="tr">
                <Col span="6" class-name="td" :style="{'padding-left': 30 * padding + 20 + 'px', 'text-align': 'left'}">{{extra.MenuName}}</Col>
                <Col span="4" class-name="td">{{extra.OrderID}}</Col>
                <Col span="4" class-name="td">{{extra.PageURL}}</Col>
                <Col span="4" class-name="td">{{extra.Ioc}}</Col>
                <Col span="4" class-name="td editor-delete-box">
                    <div class="editor-delete-b">
                        <div class="editor-delete">
                            <div class="add" @click="addMenu(extra)">增加子菜单</div>
                            <div class="editor" @click="editorMenu(extra)">编辑</div>
                            <div class="delete">
                                <Poptip
                                    confirm
                                    title="您确认删除这条内容吗？"
                                    placement="left-end"
                                    @on-ok="poptipOk(extra)"
                                    @on-cancel="poptipCancel">
                                    <div>删除</div>
                                </Poptip>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="child-menu" :style="{height: collapse ? 'auto' : '0', overflow: collapse ? 'initial' : 'hidden'}">
            <template v-for="(item, index) in extra.children">
                <menu-powerpage :extra="item" :padding="(padding + 1)" :parentName="extra.MenuName"></menu-powerpage>
            </template>
        </div>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'menu-powerpage',
    props: {
      extra: {
        type: Object,
        default: null
      },
      padding: {
          type: Number,
          default: 0
      },
      parentName: {
          type: String,
          default: null
      }
    },
    components: {
      
    },
    data () {
        return {
           collapse: true 
        }
    },
    computed: {
        
    },
    methods: {
        handleCollapse() {
            this.collapse = !this.collapse;
        },
        addMenu(extra) {
            extra = Object.assign(extra, {
                parentName: this.parentName
            });
            this.$store.commit('addMenuExtra', {main: false, type: 'add', extra: extra});
        },
        editorMenu(extra) {
            extra = Object.assign(extra, {
                parentName: this.parentName
            });
            this.$store.commit('addMenuExtra', {main: false, type: 'editor', extra: extra});
        },
        deleteMenu(extra) {
            this.$store.commit('deleteMenuExtra', {id: extra.ID});
        },
        poptipOk(extra) {
            this.deleteMenu(extra);
        },
        poptipCancel() {

        }
    },
    mounted () {
        // console.log(this.extra);
    },
    destroyed() {
      
    }
};
</script>
