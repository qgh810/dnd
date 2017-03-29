import IMAGES from './icon-images'
import { REMOVE_ANIMATION_TYPES, DOCUMENT_ADDR } from './config'

const dragStore = {
  /* ********** 被拖元素drag设置的变量 *************/
  //
  isMobile: false,
  data: null,
  draggedNode: null,
  sourceNode: null,
  markNode: null,
  stateIcon: null,
  mousePosition: null,

  /* ********** drop设置的变量 *************/
  targets: [],
  targetOnDragStarts: [],
  targetOnDragEnds: [],
  onDragEnters: [],
  onDragLeaves: [],
  onDragOvers: [],
  onDrops: [],
  targetPositions: [],

  /* ********** store设置的变量 *************/
  targetIndex: -1,
  _prevValidIndex: -1,
  _inTarget: false,

  /**
   * 监听拖动开始
   */
  onDragStart (data, el) {
    this._initStore()
    this.sourceNode = el
    this.data = data
    // 广播拖动开始
    this.targetOnDragStarts.forEach((fn, index) => fn && fn({
      data,
      enter: index === this.targetIndex,
      el: this.targets[index].el,
      sourceNode: this.sourceNode,
      name: this.targets[index].name,
      methods
    }))
  },

  /**
   * 初始化store状态
   */
  _initStore () {
    this._inTarget = false
    this._prevValidIndex = -1
    this.targetIndex = -1
    this.hideStateicon()
  },

  /**
   * 监听拖动
   */
  onDragOver (pageX, pageY) {
    this.mousePosition = [pageX, pageY]
    this.targetIndex = this.collision(pageX, pageY)
    this.setIconPosition(pageX, pageY)
    if (this.targetIndex >= 0) {
      // 判断是否在目标外 是的话表示刚刚进入
      if (!this._inTarget) {
        this._prevValidIndex = this.targetIndex
        this._inTarget = true

        let params = {
          enter: true,
          data: this.data,
          el: this.targets[this.targetIndex].el,
          sourceNode: this.sourceNode,
          name: this.targets[this.targetIndex].name,
          methods,
        }
        this.onDragEnters[this.targetIndex](params)
      }
      // 调用回调
      let params = {
        enter: true,
        data: this.data,
        el: this.targets[this.targetIndex].el,
        sourceNode: this.sourceNode,
        name: this.targets[this.targetIndex].name,
        pageX,
        pageY,
        methods,
      }
      this.onDragOvers[this.targetIndex](params)
    } else {
      // 判断是否在目标内  是的话表示刚刚离开
      if (this._inTarget) {
        this._inTarget = false
        let params = {
          enter: false,
          data: this.data,
          el: this.targets[this._prevValidIndex].el,
          sourceNode: this.sourceNode,
          name: this.targets[this._prevValidIndex].name,
          methods,
        }
        this.onDragLeaves[this._prevValidIndex](params)
      }
    }
  },

  /**
   * 监听拖动结束
   */
  onDragEnd () {
    // 触发放置事件
    if (this.targetIndex >= 0) {
      let params = {
        enter: true,
        data: this.data,
        el: this.targets[this.targetIndex].el,
        sourceNode: this.sourceNode,
        name: this.targets[this.targetIndex].name,
        methods,
      }
      this.targetIndex >= 0 && this.onDrops[this.targetIndex](params)
    }

    // 广播拖动结束事件
    this.targetOnDragEnds.forEach((fn, index) => {
      if (!fn) return
      let params = {
        enter: index === this.targetIndex,
        data: this.data,
        el: this.targets[index].el,
        sourceNode: this.sourceNode,
        name: this.targets[index].name,
        methods,
      }
      fn(params)
    })
  },

  /**
   * 碰撞检测函数
   */
  collision (pageX, pageY) {
    let targetIndex = -1
    // 碰撞检测
    for (var i = 0; i < this.targetPositions.length; i++) {
      let position = this.targetPositions[i]
      if (!position) continue
      let index = i
      if (
        pageX >= position.left &&
        pageY >= position.top &&
        pageX <= position.right &&
        pageY <= position.bottom
      ) {
        targetIndex = index
        break
      }
    }

    return targetIndex
  },

  /**
   * 设置状态icon位置跟随鼠标
   */
  setIconPosition (x, y) {
    let style = this.stateIcon.style
    style.left = x + 8 + 'px'
    style.top = y + 'px'
  },

  /**
   * 显示状态icon
   * url 可以是图片绝对路径 也可以是 add | reject | delete
   */
  showStateicon (url) {
    if (this.isMobile) return console.warn('showStateicon仅在pc端口可用 请参考相关说明' + DOCUMENT_ADDR)
    url = IMAGES[url] || url || 'add'
    let iconStyle = this.stateIcon.style
    iconStyle.display = 'block'
    iconStyle.background = `no-repeat url(${url}) center center / 100% auto`
  },

  /**
   * 隐藏状态icon
   */
  hideStateicon () {
    try {
      this.stateIcon.style.display = 'none'
    } catch (e) {}
  },

  /**
   * 移除被拖动的节点
   * type 动画类型 不传则无动画直接消失 可选 fade | blost | back
   * time 动画持续时长 非必填
   */
  removeDragedNode (type, time) {
    if (!type) return this.removeMark()
    if (!REMOVE_ANIMATION_TYPES[type]) return this.removeMark()
    setTimeout(() => {
      clearTimeout(this.removeMarkTid)
    }, 0)
    this[REMOVE_ANIMATION_TYPES[type]](time)
  },

  /**
   * 动画 褪色
   * @type {[time]} 动画时间 单位毫秒
   */
  [REMOVE_ANIMATION_TYPES.fade] (time = 150) {
    let style = this.draggedNode && this.draggedNode.style
    if (!style) return
    style.transition = `all ${time / 1000}s ease`
    style.opacity = '0'
    setTimeout(this.removeMark.bind(this), time)
  },

  /**
   * 动画 爆炸
   * @type {[time]} 动画时间 单位毫秒
   */
  [REMOVE_ANIMATION_TYPES.blost] (time = 150) {
    let style = this.draggedNode && this.draggedNode.style
    if (!style) return
    style.transition = `all ${time / 1000}s ease`
    style.boxShadow = '0 0 50px 30px rgba(0,0,0,0.3)'
    style.opacity = '0'
    setTimeout(this.removeMark.bind(this), time)
  },

  /**
   * 动画 返回
   * @type {[time]} 动画时间 单位毫秒
   */
  [REMOVE_ANIMATION_TYPES.back] (time = 400) {
    let style = this.draggedNode && this.draggedNode.style
    if (!style) return
    style.transition = `all ${time / 1000}s cubic-bezier(0.2,0.4,0.25,1.1)`
    style.transform = 'translate(0,0)'
    setTimeout(this.removeMark.bind(this), time)
  },

  /**
   * 移除蒙层
   */
  removeMark () {
    clearTimeout(this.removeMarkTid)
    this.removeMarkTid = setTimeout(() => {
      try {
        document.body.removeChild(this.markNode)
        this.draggedNode = null
      } catch (e) {
        // console.log('出错', e)
      }
    }, 10)
  },

  /**
   * 销毁实例
   * name 实例名称
   */
  destroyDrop (name) {
    this.targets.forEach((item, i) => {
      if (item.name === name) {
        this.removeDrop(i)
      }
    })
  },

  /**
   * 删除状态中的某个Drop相关数据
   */
  removeDrop (index) {
    delete this.targets[index]
    delete this.targetOnDragStarts[index]
    delete this.targetOnDragEnds[index]
    delete this.onDragEnters[index]
    delete this.onDragLeaves[index]
    delete this.onDragOvers[index]
    delete this.onDrops[index]
    delete this.targetPositions[index]
  },

  /**
   * 获取状态icon节点
   */
  getStateIconNode () {
    return this.stateIcon
  }
}

export default dragStore

/**
 * 供用户调用的静态方法
 */
export const methods = {
  showStateicon: dragStore.showStateicon.bind(dragStore),
  hideStateicon: dragStore.hideStateicon.bind(dragStore),
  getStateIconNode: dragStore.getStateIconNode.bind(dragStore),
  removeDragedNode: dragStore.removeDragedNode.bind(dragStore),
  destroyDrop: dragStore.destroyDrop.bind(dragStore),
}
