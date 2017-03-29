import { checkNode } from './utils/check'
import { getBoundingClientRect } from './utils/dom'
import { DOCUMENT_ADDR } from './config'
import store from './store'
import { methods } from './store'
class Drop {
  constructor (el, options) {
    this.initData(el, options) && this.init()
  }

  initData (el, options) {
    this.el = checkNode(el)
    if (!this.el) return
    this.options = this.checkOptions(options)
    if (!this.options) return

    this._active = false // 是否进入当前范围
    this._accept = false // 是否同意
    this.index = -1 // 当前索引
    this.acceptIconClass = 'drag-clone-icon accept'
    this.notAcceptIconClass = 'drag-clone-icon not-accept'
    return true
  }

  // 检查并且初始化options
  checkOptions (options) {
    if (!options) {
      return console.error('未检测到options 请参考相关说明' + DOCUMENT_ADDR)
    }
    if (typeof options.onDrop !== 'function') {
      return console.error('onDrop 必须是一个函数 请参考相关说明' + DOCUMENT_ADDR)
    }
    if (options.condition && typeof options.condition !== 'function') {
      return console.error('condition必须是一个函数 并且根据传入的data返回一个布尔值 请参考相关说明' + DOCUMENT_ADDR)
    }
    let baseOptions = {
      condition () { return true }
    }
    for (let option in baseOptions) {
      !options[options] && (options[options] = baseOptions[option])
    }
    return options
  }

  init () {
    this.setStore()
  }

  setStore () {
    let index = store.targetOnDragStarts.push(this.onDragStart.bind(this)) - 1
    this.index = index
    store.targetOnDragEnds[index] = this.onDragEnd.bind(this)
    store.onDragEnters[index] = this.onDragEnter.bind(this)
    store.onDragMoves[index] = this.onDragMove.bind(this)
    store.onDragLeaves[index] = this.onDragLeave.bind(this)
    store.onDrops[index] = this.onDrop.bind(this)
  }

  // 目标监听到拖动开始
  onDragStart (data, accept) {
    console.log('目标监听到拖动开始')
    this._active = false
    this._accept = accept
    this.setStorePositions()
    this.emit('onDragStart', data, accept)
  }

  // 目标监听到拖动结束
  onDragEnd (inTarget, data) {
    console.log('目标监听到拖动结束')
    this.emit('onDragEnd', inTarget, data)
    methods.hideDragedNode('blost')
  }

  /**
   * 目标监听到拖动进入当前范围
   */
  onDragEnter (accept, data) {
    console.log('目标监听到拖动进入当前范围')
    methods.showStateicon('add')
    this._active = true
    this._accept = accept
    this.emit('onDragEnter', accept, data)
  }

  onDragMove () {
    console.log('目标监听到正在自己上面拖动')
  }

  // 目标监听到离开当前范围
  onDragLeave () {
    methods.hideStateicon()

    console.log('目标监听到离开当前范围')
    this._active = false
    this._accept = false
    this.emit('onDragLeave')
  }

  // 目标监听到被拖动元素在自己范围内放下
  onDrop (success, data) {
    console.log('目标监听到放下成功')
    this._active = false
    this._accept = false
    this.emit('drop', success, data)
  }


  setStorePositions () {
    let {left, top, width, height} = getBoundingClientRect(this.el)
    store.targetPositions[this.index] = {
      top: top,
      bottom: top + height,
      left: left,
      right: left + width
    }
  }

  emit () {
    let args = Array.from(arguments)
    let functionName = args.shift()
    typeof this.options[functionName] === 'function' && this.options[functionName](...args)
  }
}

module.exports = Drop
