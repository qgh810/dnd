import IMAGES from './icon-images'
const dragStore = {
  /* ********** drag设置的变量 *************/
  data: null,
  draggedNode: null,
  markNode: null,
  stateIcon: null,
  mousePosition: null,

  /* ********** drop设置的变量 *************/
  targetOnDragStarts: [],
  targetOnDragEnds: [],
  onDragEnters: [],
  onDragLeaves: [],
  onDragMoves: [],
  onDrops: [],
  targetPositions: [],

  /* ********** store设置的变量 *************/
  targetIndex: -1,
  _prevValidIndex: -1,
  _inTarget: false,

  onDragStart (data) {
    this._initStore()
    this.data = data
    // 广播拖动开始
    this.targetOnDragStarts.forEach((fn, index) => fn && fn(data))
  },

  _initStore () {
    this._inTarget = false
    this._prevValidIndex = -1
    this.hideStateicon()
  },

  onDragMove (pageX, pageY) {
    this.mousePosition = [pageX, pageY]
    this.targetIndex = this.collision(pageX, pageY)
    this.setIconPosition(pageX, pageY)
    if (this.targetIndex >= 0) {
      // 判断是否在目标外 是的话表示刚刚进入
      if (!this._inTarget) {
        this._prevValidIndex = this.targetIndex
        this._inTarget = true
        this.onDragEnters[this.targetIndex](this.data)
      }
      // 调用回调
      this.onDragMoves[this.targetIndex](this.data)
    } else {
      // 判断是否在目标内  是的话表示刚刚离开
      if (this._inTarget) {
        this._inTarget = false
        this.onDragLeaves[this._prevValidIndex]()
      }
    }
  },

  onDragEnd () {
    // 触发放置事件
    this.targetIndex >= 0 && this.onDrops[this.targetIndex]({data: this.data})
    // 广播拖动结束事件
    this.targetOnDragEnds.forEach((fn, index) => {
      if (!fn) return
      let params = {
        success: index === this.targetIndex,
        data: this.data,
      }
      fn(params)
    })
  },

  // 碰撞检测函数
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

  setIconPosition (x, y) {
    let style = this.stateIcon.style
    style.left = x + 8 + 'px'
    style.top = y + 'px'
  },

  showStateicon (url) {
    url = IMAGES[url] || url || ''
    let iconStyle = this.stateIcon.style
    iconStyle.display = 'block'
    iconStyle.background = `no-repeat url(${url}) center center / 100% auto`
  },

  hideStateicon () {
    try {
      this.stateIcon.style.display = 'none'
    } catch (e) {}
  },

  hideDragedNode (type) {
    switch (type) {
      case 'blost':
        this.blost()
        break
      case 'fade':
        this.blost()
        break
      default:
        this.removeMark()
        break
    }
  },

  fade () {
    console.log(123123)
    let style = this.draggedNode && this.draggedNode.style
    if (!style) return
    style.transition = 'all 0.15s ease'
    style.opacity = '0'
    setTimeout(this.removeMark.bind(this), 150)
  },

  blost () {
    let style = this.draggedNode && this.draggedNode.style
    if (!style) return
    style.transition = 'all 0.15s ease'
    style.boxShadow = '0 0 50px 30px rgba(0,0,0,0.3)'
    style.opacity = '0'
    setTimeout(this.removeMark.bind(this), 150)
  },

  // 移除蒙层
  removeMark () {
    try {
      document.body.removeChild(this.markNode)
      this.draggedNode = null
    } catch (e) {
      // console.log('出错', e)
    }
  }
}

export default dragStore

export const methods = {
  showStateicon: dragStore.showStateicon.bind(dragStore),
  hideStateicon: dragStore.hideStateicon.bind(dragStore),
  hideDragedNode: dragStore.hideDragedNode.bind(dragStore),
}
