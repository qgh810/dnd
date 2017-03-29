import { checkNode } from './utils/check'
import { DOCUMENT_ADDR } from './config'
import store from './store'

class Drop {
  constructor (el, options) {
    this.initData(el, options) && this.init()
  }

  /**
   * 检查并初始化传入参数
   */
  initData (el, options) {
    this.el = checkNode(el)
    if (!this.el) return
    this.options = this.checkOptions(options)
    if (!this.options) return

    this.index = -1 // 当前索引
    return true
  }

  /**
   * 检查并且初始化options
   */
  checkOptions (options) {
    if (!options) {
      return console.error(this.el, '未检测到options 请参考相关说明' + DOCUMENT_ADDR)
    }
    if (typeof options.onDrop !== 'function') {
      return console.error(this.el, 'onDrop 必须是一个函数 请参考相关说明' + DOCUMENT_ADDR)
    }
    let baseOptions = {
      name: null
    }
    for (let option in baseOptions) {
      !options[options] && (options[options] = baseOptions[option])
    }
    return options
  }

  /**
   * 初始化
   */
  init () {
    this.setStore()
  }

  /**
   * 托管状态
   */
  setStore () {
    let index = store.targets.push({
      el: this.el,
      name: this.options.name
    }) - 1
    this.index = index

    store.targetOnDragStarts[index] = this.onDragStart.bind(this)
    store.targetOnDragEnds[index] = this.onDragEnd.bind(this)
    store.onDragEnters[index] = this.onDragEnter.bind(this)
    store.onDragOvers[index] = this.onDragOver.bind(this)
    store.onDragLeaves[index] = this.onDragLeave.bind(this)
    store.onDrops[index] = this.onDrop.bind(this)
  }

  /**
   * 目标监听到拖动开始
   */
  onDragStart (params) {
    this.setStorePositions()
    this.emit('onDragStart', params)
  }

  /**
   * 目标监听到拖动结束
   */
  onDragEnd (params) {
    this.emit('onDragEnd', params)
  }

  /**
   * 目标监听到拖动进入当前范围
   */
  onDragEnter (params) {
    this.emit('onDragEnter', params)
  }

  /**
   * 目标监听在自己上方拖动
   */
  onDragOver (params) {
    this.emit('onDragOver', params)
  }

  /**
   * 目标监听到离开当前范围
   */
  onDragLeave (params) {
    this.emit('onDragLeave', params)
  }

  /**
   * 目标监听到被拖动元素在自己范围内放下
   */
  onDrop (params) {
    this.emit('onDrop', params)
  }

  /**
   * 托管当前位置信息
   */
  setStorePositions () {
    let {left, top, width, height} = this.el.getBoundingClientRect()
    store.targetPositions[this.index] = {
      top: top,
      bottom: top + height,
      left: left,
      right: left + width
    }
  }

  /**
   * 发布事件
   */
  emit () {
    let args = Array.from(arguments)
    let functionName = args.shift()
    typeof this.options[functionName] === 'function' && this.options[functionName](...args)
  }
}

module.exports = Drop
