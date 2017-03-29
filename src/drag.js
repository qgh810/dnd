import { checkNode } from './utils/check'
import { getBoundingClientRect } from './utils/dom'
import store from './store'
import { methods } from './store'

class Drag {
  constructor (el, options) {
    this.initData(el, options) && this.init()
  }

  initData (el, options) {
    this.el = checkNode(el)
    if (!this.el) return

    this.el.style.userSelect = 'none'
    this.el.style.cursor = 'default'

    this.options = this.checkOptions(options)
    this.data = options.data
    this.mouseDownPosition = {left: -1, top: -1}
    this.mouseDragging = false
    this.mark = null
    this.position = { left: 0, top: 0}
    return true
  }

  init () {
    this.addEventListener()
  }

  addEventListener () {
    let dom = this.el
    // 监听当前节点的鼠标点击事件
    dom.addEventListener('mousedown', (e) => {
      let {pageX, pageY} = e
      this.mouseDownPosition = {left: pageX, top: pageY}
      dom.onmousemove = this.onElMousemove.bind(this)
      dom.onmouseup = this.onElMouseUp.bind(this)
      document.addEventListener('mouseup', this.onElMouseUp.bind(this))
    })
  }

  onElMousemove () {
    if (this.mouseDragging) return
    this.mouseDragging = true

    store.onDragStart(this.data, this.el)
    this.position = this.el.getBoundingClientRect()
    // 创建蒙层
    this.mark = document.createElement('div')
    this.mark.className = 'x-drag-mark'
    this.setMarkStyle()
    this.mark.onmousemove = this.onMarkMouseMove.bind(this)
    this.mark.onmouseup = this.onMarkMouseUp.bind(this)
    this.mark.onmouseleave = this.onMarkMouseUp.bind(this)
    store.markNode = this.mark
    document.body.appendChild(this.mark)
    // 创建复制元素
    store.draggedNode = this.el.cloneNode(true)
    this.setCloneNodeStyle()
    this.mark.appendChild(store.draggedNode)

    // 创建状态icon
    store.stateIcon = document.createElement('i')
    store.stateIcon.className = 'x-state-icon'
    this.setIconStyle()
    this.mark.appendChild(store.stateIcon)

    this.emit('onDragStart', {
      el: this.el,
      data: this.data,
      methods,
    })
  }

  onElMouseUp () {
    this.mouseDragging = false
    this.el.onmousemove = null
    this.el.onmouseup = null
    this.mark && (this.mark.onmousemove = null)
    this.mark && (this.mark.onmouseup = null)
    document.removeEventListener('mouseup', this.onElMouseUp.bind(this))
  }

  onMarkMouseMove (e) {
    if (!store.draggedNode) return
    let {pageX, pageY} = e
    let translateX = pageX - this.mouseDownPosition.left
    let translateY = pageY - this.mouseDownPosition.top
    store.draggedNode.style.transform = `translate(${translateX}px,${translateY}px)`
    store.onDragMove(pageX, pageY)
  }

  onMarkMouseUp () {
    document.removeEventListener('mouseup', this.onElMouseUp.bind(this))
    this.mouseDragging = false
    this.mark.onmousemove = null
    this.el.onmousemove = null

    this.emit('onDragEnd', {
      el: this.el,
      data: this.data,
      target: store.targets[store.targetIndex]
    })
    store.onDragEnd()
  }

  // 检查并且初始化options
  checkOptions (options) {
    options = options || {}
    let baseOptions = {
      data: '这里可以放需要丢给目标的内容',
      el: this.el,
      removeanimationtype: 1,
    }
    for (let option in baseOptions) {
      !options[options] && (options[options] = baseOptions[option])
    }
    return options
  }

  setMarkStyle () {
    let markStyle = {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '10',
    }
    for (let style in markStyle) {
      this.mark.style[style] = markStyle[style]
    }
  }

  setCloneNodeStyle () {
    let dom = store.draggedNode
    let style = dom.style
    let { left, top } = this.position
    style.position = 'absolute'
    style.left = left + 'px'
    style.top = top + 'px'
    style.transform = 'translate(0,0)'
    style.zIndex = 1000
  }

  setIconStyle () {
    let style = store.stateIcon.style
    style.display = 'none'
    style.position = 'absolute'
    style.width = '20px'
    style.height = '20px'
    style.zIndex = '10001'
  }

  emit () {
    let args = Array.from(arguments)
    let functionName = args.shift()
    typeof this.options[functionName] === 'function' && this.options[functionName](...args)
  }
}

module.exports = Drag
