import { checkNode } from './utils/check'
import { getBoundingClientRect } from './utils/dom'
import store from './store'


class Drag {
  constructor (el, options) {
    this.initData(el, options) && this.init()
  }

  initData (el, options) {
    this.el = checkNode(el)
    if (!this.el) return

    this.el.style.userSelect = 'none'

    this.options = this.checkOptions(options)
    this.data = options.data
    this.mouseDownPosition = {left: -1, top: -1}
    this.mouseDragging = false
    this.backTime = 300
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

    store.data = this.data
    this.el.style.opacity = '0.5'
    this.position = getBoundingClientRect(this.el)
    // 创建蒙层
    this.mark = document.createElement('div')
    this.mark.className = 'x-drag-mark'
    this.setMarkStyle()
    this.mark.onmousemove = this.onMarkMouseMove.bind(this)
    this.mark.onmouseup = this.onMarkMouseUp.bind(this)
    this.mark.onmouseleave = this.onMarkMouseUp.bind(this)
    document.body.appendChild(this.mark)
    // 创建复制元素
    store.cloneDom = this.el.cloneNode(true)
    this.setCloneDomStyle()
    this.mark.appendChild(store.cloneDom)

    // 创建状态icon
    store.stateIcon = document.createElement('i')
    this.setIconStyle()
    this.mark.appendChild(store.stateIcon)

    this.emit('onDragStart')
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
    if (!store.cloneDom) return
    let {pageX, pageY} = e
    let translateX = pageX - this.mouseDownPosition.left
    let translateY = pageY - this.mouseDownPosition.top
    store.cloneDom.style.transform = `translate(${translateX}px,${translateY}px)`
    store.mousePosition = [pageX, pageY]
  }

  onMarkMouseUp () {
    document.removeEventListener('mouseup', this.onElMouseUp.bind(this))
    this.mouseDragging = false
    this.mark.onmousemove = null
    this.el.onmousemove = null

    this.mark.style.cursor = 'auto'
    let style = store.cloneDom && store.cloneDom.style
    if (!style) return
    // 复制的dom的动画效果
    if (store.canBack) {
      style.transition = `all ${this.backTime / 1000}s cubic-bezier(0.2,0.4,0.25,1.1)`
      style.transform = 'translate(0,0)'
      setTimeout(this.removeMark.bind(this), this.backTime)
    } else {
      if (this.options.removeanimationtype === 0 && !store._inTarget) {
        // 删除动画类型0 渐渐消失
        style.transition = 'all 0.1s ease'
        style.opacity = '0'
        setTimeout(this.removeMark.bind(this), 200)
      } else if (this.options.removeanimationtype === 1 && !store._inTarget) {
        // 删除动画类型1 爆炸
        style.transition = 'all 0.1s ease'
        style.boxShadow = '0 0 50px 30px rgba(0,0,0,0.3)'
        style.opacity = '0'
        setTimeout(this.removeMark.bind(this), 100)
      } else {
        this.removeMark()
      }
    }
    // 1是否会返回, 2源数据, 3是否在目标内, 4拓展参数
    this.emit('onDragEnd', {
      isBack: store.canBack,
      data: this.data,
      inTarget: store._targetIndex > -1
    })
    store.data = null
  }

  removeMark () {
    try {
      document.body.removeChild(this.mark)
      store.cloneDom = null
      this.el.style.opacity = '1'
    } catch (e) {
      console.log('出错', e)
    }
  }

  // 检查并且初始化options
  checkOptions (options) {
    options = options || {}
    let baseOptions = {
      data: '这里可以放需要丢给目标的内容',
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
      background: 'rgba(0,0,0,0.1)',
      zIndex: '10',
      cursor: 'move',
    }
    for (let style in markStyle) {
      this.mark.style[style] = markStyle[style]
    }
  }

  setCloneDomStyle () {
    let dom = store.cloneDom
    let style = dom.style
    let { left, top } = this.position
    style.position = 'absolute'
    style.left = left + 'px'
    style.top = top + 'px'
    style.opacity = '1'
    style.transform = 'translate(0,0)'
    style.cursor = 'move'
    style.zIndex = 10
  }

  setIconStyle () {
    let style = store.stateIcon.style
    style.display = 'none'
    style.position = 'absolute'
    style.width = '20px'
    style.height = '20px'
    style.zIndex = '100'

    // style.borderRadius = '20px'
    // style.border = '2px solid #fff'
    // style.boxSizing = 'border-box'
  }

  emit () {
    let args = Array.from(arguments)
    let functionName = args.shift()
    typeof this.options[functionName] === 'function' && this.options[functionName](...args)
  }
}

module.exports = Drag
