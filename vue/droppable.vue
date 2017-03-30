<template>
  <div class="dnd-drop-content">
    <slot></slot>
  </div>
</template>

<script>
/**
 * 作者 邱国辉
 * 使用方法:
 * @dragstart 拖动开始回调函数
 * @dragend 拖动结束回调函数
 * @drop 放下回调函数
 * @dragenter 被拖元素进入自己的范围的回调函数
 * @dragover 被拖元素进入自己的范围内移动的回调函数 (持续调用)
 * @dragleave 被拖元素离开自己的范围的回调函数
 * 参考文档 https://github.com/qgh810/dnd
 * 例如:
<droppable
  @dragstart="onDragStart"
  @dragsend="onDragEnd"
  @drop="onDrop"
  @dragenter="onDragEnter"
  @dragover="onDragOver"
  @dragleave="onDragLeave">
  <div>被拖动的东西可以在这里放下</div>
</droppable>
 */
import { Drop } from 'dnd.js'

export default {
  name: 'Droppable',

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
      new Drop(this.$el, {
        onDragStart (params) {
          self.$emit('dragstart', params)
        },
        onDragEnter (params) {
          self.$emit('dragenter', params)
        },
        onDragOver (params) {
          self.$emit('dragover', params)
        },
        onDragLeave (params) {
          self.$emit('dragleave', params)
        },
        onDrop (params) {
          self.$emit('drop', params)
        },
        onDragEnd (params) {
          self.$emit('dragend', params)
        }
      })
    }
  }
}
</script>
