<template>
  <div class="vue-canvas-nest-element">
  </div>
</template>
<script>
import CanvasNest from 'canvas-nest.js';
export default {
    name: 'vueCanvasNest',
    props: {
        config: {
            type: Object,
            default () {
                return {
                    color: '65,154,255',
                    count: 199,
                    opacity: 0.8
                };
            }
        }
    },
    data () {
        return {
            cn: ''
        };
    },
    mounted () {
        const el = document.querySelector('.vue-canvas-nest-element');
        this.cn = new CanvasNest(el, this.config);
    },
    beforeDestroy () {
        this.cn.destroy();
    }
};
</script>
<style scoped>
.vue-canvas-nest-element {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: auto;
  opacity: 0.7;
}
</style>