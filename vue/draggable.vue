<template>
  <div class="dnd-drag-content">
    <slot></slot>
  </div>
</template>

<script>
/**
 * 作者 邱国辉
 * 使用方法:
 * :data: 要传递给目标的数据
 * @dragstart: 拖动开始的回调函数
 * @dragend: 拖动后放开的回调函数
 * 参考文档 https://github.com/qgh810/dnd
  <draggable
    :data="'希望drop组件接收到的数据'"
    @dragstart="onDragStart"
    @dragend="onDragEnd">
    <div class="drag-content">拖动我</div>
  </draggable>
 */
import { Drag } from 'dnd.js'
export default {
  name: 'Draggable',

  props: {
    data: null
  },

  data () {
    return {
      drag: null
    }
  },

  // Vue1.0
  ready () {
    this.init()
  },
  // Vue2.0
  mounted () {
    this.init()
  },

  methods: {
    init () {
      let self = this
      /* eslint-disable no-new */
      this.drag = new Drag(this.$el, {
        data: this.data,
        onDragStart (params) {
          self.$emit('dragstart', params)
        },
        onDragEnd (params) {
          self.$emit('dragend', params)
        }
      })
    }
  }
}
</script>
