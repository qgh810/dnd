<template>
  <div class="root">

    <draggable
      :data="'希望drop组件接收到的数据'"
      @dragstart="onSourceDragStart"
      @dragsend="onSourceDragEnd">

      <div class="drag-content">拖动我</div>

    </draggable>

    <droppable
      class="drop-box"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @drop="onDrop"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave">

      <div>被拖动的东西可以在这里放下</div>

    </droppable>

  </div>
</template>

<script>
import Draggable from 'components/draggable'
import Droppable from 'components/droppable'

export default {
  components: {
    Draggable,
    Droppable
  },

  methods: {
    onSourceDragStart (params) {
      console.log('被拖动元素监听到拖动开始')
    },

    onSourceDragEnd (params) {
      console.log('被拖动元素监听到拖动结束')
    },

    onDragStart (params) {
      console.log('监听到拖动开始')
    },
    onDragEnd (params) {
      console.log('监听到拖动结束')
    },
    onDrop (params) {
      console.log('监听到被拖动元素放下')
    },
    onDragEnter (params) {
      console.log('监听到被拖动元素进入当前范围')
    },
    onDragOver (params) {
      // console.log('监听到被拖动元素在上方移动, 这个调用调多次就不打印了')
    },
    onDragLeave (params) {
      console.log('监听到被拖动元素离开当前范围')
    }
  }
}
</script>

<style lang="stylus">
  .drop-box
    width 100px
    height 100px
</style>
