const dragStore = {
  _data: null,
  // 当前鼠标位置
  _mousePosition: [-1, -1],
  // 当前目标索引
  _targetIndex: -1,
  // 上一个有效的目标的索引
  _prevValidIndex: -1,
  // 上一个目标的索引
  _prevIndex: -1,
  // 是否在目标内
  _inTarget: false,

  // 源 控制是否执行返回动画
  canBack: false,
  // 源 当前被拖元素的复制dom
  cloneDom: null,

  // 目标位置集合
  targetPositions: [],
  // 目标条件集合
  conditions: [],
  // 目标 监听拖拽开始事件集合
  targetOnDragStarts: [],
  // 目标 监听拖拽结束事件集合
  targetOnDragEnds: [],
  // 目标 监听进入范围事件集合
  onDragEnters: [],
  // 目标 监听离开范围事件集合
  onDragLeaves: [],
  // 目标 监听在目标内放下事件集合
  onDrops: [],

  // 指示图标类名
  iconClasss: [],

  // 获取数据
  get data () {
    return this._data
  },
  // 设置数据
  set data (val) {
    let oldData = this._data
    this._data = val
    // store监听数据data变化事件
    this._onDataChange(val, oldData)
  },

  // 获取鼠标位置
  get mousePosition () {
    return this._mousePosition
  },
  // 设置鼠标位置
  set mousePosition (position) {
    this._mousePosition = position
    this._onPositionChange(position)
  },

  get targetIndex () {
    return this._targetIndex
  },
  set targetIndex (index) {
    if (this._targetIndex > -1 && this._prevIndex !== this._targetIndex) this._prevIndex = this._targetIndex
    if (this._targetIndex > -1) this._prevValidIndex = this._targetIndex
    this._targetIndex = index
  },

  _onDataChange (data, oldData) {
    // 如果当前数据存在 向被拖拽元素广播拖动开始事件
    data && this.targetOnDragStarts.map((fn, index) => fn && fn(data, this.conditions[index](data)))
    // 鼠标放下 向成功目标广播事件
    // targetOnDragEnds
    // !data && this.targetOnDragEnds[this.targetIndex](this.targetIndex > -1, oldData)
    !data && this.targetOnDragEnds.forEach(fn => fn(this.targetIndex > -1, oldData))
    !data && this.targetIndex > -1 && this.onDrops[this.targetIndex](!this.canBack, oldData)
    this._initStore()
  },

  _onPositionChange (position) {
    let [pageX, pageY] = position
    this.targetIndex = -1
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
        this.targetIndex = index
        break
      }
    }
    if (this.targetIndex > -1) {
      if (!this._inTarget) {
        this._inTarget = true
        let success = Boolean(this.conditions[this.targetIndex](this.data))
        let iconClassName = success ? this.iconClasss[this.targetIndex].accept : this.iconClasss[this.targetIndex].notAccept

        this._stateIcon = document.createElement('i')
        this._stateIcon.className = iconClassName
        this.cloneDom.appendChild(this._stateIcon)

        this.canBack = !success
        this.onDragEnters[this.targetIndex](success, this.data)
      } else {
        if (this._prevIndex > -1 && this.targetIndex !== this._prevIndex) {
          this.canBack = true
          this._inTarget = false
          this.removeIcon()
          this.onDragLeaves[this._prevValidIndex]()
        }
      }
    } else {
      if (this._inTarget) {
        this.canBack = false
        this._inTarget = false
        this.removeIcon()
        this.onDragLeaves[this._prevValidIndex]()
      }
    }
  },

  _initStore () {
    // 这里需要初始化store  因为这里是因为数据data变化出发的 所以这里初始化不能设置data
    this.canBack = false
    this._inTarget = false
    this._mousePosition = [-1, -1]
    this.removeIcon()
    this.cloneDom = null
  },

  removeIcon () {
    try {
      this.cloneDom.removeChild(this._stateIcon)
    } catch (e) {}
  },

  removeDrop (index) {
    delete this.targetPositions[index]
    delete this.conditions[index]
    delete this.targetOnDragStarts[index]
    delete this.onDragEnters[index]
    delete this.onDragLeaves[index]
    delete this.onDrops[index]
    delete this.iconClasss[index]
  }

}

export default dragStore
