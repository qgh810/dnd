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
  draggedNode: null,

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
      this.setIconPosition(pageX, pageY)
      if (!this._inTarget) {
        this._inTarget = true
        let accept = Boolean(this.conditions[this.targetIndex](this.data))
        let iconClassName = accept ? this.iconClasss[this.targetIndex].accept : this.iconClasss[this.targetIndex].notAccept
        this.stateIcon.className = iconClassName
        // this.stateIcon.style.display = 'block'
        this.setIconStyle(accept)

        this.canBack = !accept
        this.onDragEnters[this.targetIndex](accept, this.data)
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
    this.draggedNode = null
  },

  setIconStyle (accept) {
    let style = this.stateIcon.style
    style.display = 'block'

    let acceptbackground = 'no-repeat  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkUxNENCODcwMjdFMTFFNzhDQjhBODQ4QzIwNTVBM0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkUxNENCODgwMjdFMTFFNzhDQjhBODQ4QzIwNTVBM0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRTE0Q0I4NTAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRTE0Q0I4NjAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsH+M4sAAAPNSURBVHja5FrPS1RRGP3mOuqMQS5EpI0tApEiRVq5UZBAbBW06QdUWuTGRYt+gH+AULZo0aaosYK0TdAqCUJw5SokoxDBRW5CBiGDdGz0Td+Z7kz3Xe8b5715M16n8zgwzLu+d473u/d+97sTyWQyFAKizMfMPmYLs54pPNo6zC3mKnOGOczcLlVApEQjk8wBZiOeFfAZELDOnGZerLSRWWY3s5bCRZo5x+z1+4fCZ/sEM8XsKYMJks/ske9IlKNHMAaWma1eDb5sfqaFjXl6vfaK0s5vHgiOx39OUK2oo/NNl6ijoYtOxE8Weu8K81gxY6gYI0PMR8y4fmNx8yt9YvHPk0850J1gsc3GrjZfp0421R4/bmqyyRzZq4f2MjLGvC17JI+l1CLN//pIE8knocbVYPMN6jp0itpi7fot9Mg4czSIEZi4w6xRv0QP3F25SeXEvdaH2R7SsMO872XGy8iQXBdcPTG19pJeJJ9RJXCl+RpdaLps6plhU5iZjED8T31MPPg+Rh/W31Mlcbqxn24dGTWNmcP6BGCafpdtMAHgnXi3hrjUWHAdSehTLMJpP0yoZqBBQ6seXnpopWSeFMrAftP2jhpEQ/bzhrNB55bOhDkBIF+LmXpkVjWBKbbU2amGr4i8atyTn29ACzQpqJeadxnpVlthnbANBk3dupFJNXfCih32YhcGoAnatNxsUjUyoC96tsKgbSBnJCr3E3kgd7IVBm3QHhVyBY+oWWzQBLASgDZodOWd7EHI7WkeCxaHVQGNfULusfPAfsJ2GDS2CHXtyO41eVNkOwwa64WepjgWj48CGkU0SNpR7CodEzHX57dtxeVsO3z5TWd8G0HuFAlY+VGNFZ6Z/Fd2BFUJfPcIstggoZVNrZ1U0aFVdiN+YhdjImcGJs4u9ZetRwSRewoQByDaDBodITco/9JJUWe9EYPGLRhZVb9BBdB2GDSuwsiM+k3H7nqSdTBonBGyTpSfuFGLjVg8TqBNqxdD+7CQ9aF19Q5qsbbCoA3at3P/+mn1TqfF4WXQNq2u7DgpSufuoCqOgrJtgCatYp+W2l2DYU5tgaq4bTBomjPlWr3qmoLSPopipQCpRkZeQdIOFdCiHTdskXJEp1caUYYcVL+oZAXeCx6V+Qn6e2pgNAJ8I63+u19FbMCjIo8juaOuabmajxXQYERviAeiiysZTgYTRm1ePZJDVRy9qWYO/GFoDlVxPK1OAFb/YIBgxAcTzFSm/EjJdxWt7b/9UY2azmC/OcX8oe5nAiAjnzEln9kbaKxVyw/P/ggwAL2hTh2cIlwtAAAAAElFTkSuQmCC) center center / 100% auto'
    let notAcceptBackground = 'no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUZGQzQzNkEwMjdGMTFFNzhDQjhBODQ4QzIwNTVBM0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUZGQzQzNkIwMjdGMTFFNzhDQjhBODQ4QzIwNTVBM0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRTE0Q0I4OTAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRTE0Q0I4QTAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmdTj/IAAAXZSURBVHja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) center center / 100% auto'
    style.background = accept ? acceptbackground : notAcceptBackground
  },

  setIconPosition (x, y) {
    let style = this.stateIcon.style
    style.left = x + 8 + 'px'
    style.top = y + 'px'
  },

  removeIcon () {
    try {
      this.stateIcon.style.display = 'none'
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
