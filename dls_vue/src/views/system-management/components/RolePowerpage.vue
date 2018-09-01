<style lang="less" scoped>
  .power-page {
    .sub-page {
      padding-left: 30px;
    }
  }
</style>

<template>
    <div class="power-page">
      <div class="main-page">
           <Checkbox
              :label="extra.ID"

              :indeterminate="indeterminate"
              :value="checked"

              @click.prevent.native="checkAll"
           >{{extraData.MenuName}}</Checkbox>
      </div>

      <div class="sub-page">
            <template v-for="(item, index) in extraData.children">
                <role-powerpage :extra="item" :key="index"></role-powerpage>
            </template>
      </div>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'role-powerpage',
    props: {
      extra: {
        type: Object,
        default: null
      }
    },
    components: {
      
    },
    data () {
      return {
        
      }
    },
    computed: {
      extraData: {
        get() {
          return this.extra;
        },
        set() {
          
        }
      },
      indeterminate: {
        get() {
          return this.extra.indeterminate;
        },
        set() {
          
        }
      },
      checked: {
        get() {
          return this.extra.checked;
        },
        set() {
          
        }
      }
    },
    watch: {
      
    },
    methods: {
      checkAll() {
          let extra = this.extraData;
          console.log(extra);
          let indeterminate = extra.indeterminate;
          let checked = extra.checked;
          console.log('indeterminate', indeterminate , 'checked', checked);

          if (indeterminate) {
            indeterminate = false;
            checked = false;
          } else {
            if (checked) {
              checked = false;
              // this.checked = false;
            } else {
              checked = true;
              // this.checked = true;
            }
            indeterminate = false;
            // this.indeterminate = false;
          }
          
          console.log('indeterminate', indeterminate , 'checked', checked);

          this.$store.commit('rolePowerExtra', {ID: extra.ID, indeterminate: indeterminate, checked: checked, ParentID: extra.ParentID});
      }
    },
    mounted () {
      
    },
    destroyed() {
      
    }
};
</script>
