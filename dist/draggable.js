/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.methods = undefined;

var _dragStore;

var _iconImages = __webpack_require__(7);

var _iconImages2 = _interopRequireDefault(_iconImages);

var _config = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dragStore = (_dragStore = {
  /* ********** 被拖元素drag设置的变量 *************/
  //
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
  onDragMoves: [],
  onDrops: [],
  targetPositions: [],

  /* ********** store设置的变量 *************/
  targetIndex: -1,
  _prevValidIndex: -1,
  _inTarget: false,

  /**
   * 监听拖动开始
   */
  onDragStart: function onDragStart(data, el) {
    var _this = this;

    this._initStore();
    this.sourceNode = el;
    this.data = data;
    // 广播拖动开始
    this.targetOnDragStarts.forEach(function (fn, index) {
      return fn && fn({
        data: data,
        enter: index === _this.targetIndex,
        el: _this.targets[index].el,
        sourceNode: _this.sourceNode,
        name: _this.targets[index].name,
        methods: methods
      });
    });
  },


  /**
   * 初始化store状态
   */
  _initStore: function _initStore() {
    this._inTarget = false;
    this._prevValidIndex = -1;
    this.targetIndex = -1;
    this.hideStateicon();
  },


  /**
   * 监听拖动
   */
  onDragMove: function onDragMove(pageX, pageY) {
    this.mousePosition = [pageX, pageY];
    this.targetIndex = this.collision(pageX, pageY);
    this.setIconPosition(pageX, pageY);
    if (this.targetIndex >= 0) {
      // 判断是否在目标外 是的话表示刚刚进入
      if (!this._inTarget) {
        this._prevValidIndex = this.targetIndex;
        this._inTarget = true;

        var _params = {
          enter: true,
          data: this.data,
          el: this.targets[this.targetIndex].el,
          sourceNode: this.sourceNode,
          name: this.targets[this.targetIndex].name,
          methods: methods
        };
        this.onDragEnters[this.targetIndex](_params);
      }
      // 调用回调
      var params = {
        enter: true,
        data: this.data,
        el: this.targets[this.targetIndex].el,
        sourceNode: this.sourceNode,
        name: this.targets[this.targetIndex].name,
        pageX: pageX,
        pageY: pageY,
        methods: methods
      };
      this.onDragMoves[this.targetIndex](params);
    } else {
      // 判断是否在目标内  是的话表示刚刚离开
      if (this._inTarget) {
        this._inTarget = false;
        var _params2 = {
          enter: false,
          data: this.data,
          el: this.targets[this._prevValidIndex].el,
          sourceNode: this.sourceNode,
          name: this.targets[this._prevValidIndex].name,
          methods: methods
        };
        this.onDragLeaves[this._prevValidIndex](_params2);
      }
    }
  },


  /**
   * 监听拖动结束
   */
  onDragEnd: function onDragEnd() {
    var _this2 = this;

    // 触发放置事件
    if (this.targetIndex >= 0) {
      var params = {
        enter: true,
        data: this.data,
        el: this.targets[this.targetIndex].el,
        sourceNode: this.sourceNode,
        name: this.targets[this.targetIndex].name,
        methods: methods
      };
      this.targetIndex >= 0 && this.onDrops[this.targetIndex](params);
    }

    // 广播拖动结束事件
    this.targetOnDragEnds.forEach(function (fn, index) {
      if (!fn) return;
      var params = {
        enter: index === _this2.targetIndex,
        data: _this2.data,
        el: _this2.targets[index].el,
        sourceNode: _this2.sourceNode,
        name: _this2.targets[index].name,
        methods: methods
      };
      fn(params);
    });
  },


  /**
   * 碰撞检测函数
   */
  collision: function collision(pageX, pageY) {
    var targetIndex = -1;
    // 碰撞检测
    for (var i = 0; i < this.targetPositions.length; i++) {
      var position = this.targetPositions[i];
      if (!position) continue;
      var index = i;
      if (pageX >= position.left && pageY >= position.top && pageX <= position.right && pageY <= position.bottom) {
        targetIndex = index;
        break;
      }
    }

    return targetIndex;
  },


  /**
   * 设置状态icon位置跟随鼠标
   */
  setIconPosition: function setIconPosition(x, y) {
    var style = this.stateIcon.style;
    style.left = x + 8 + 'px';
    style.top = y + 'px';
  },


  /**
   * 显示状态icon
   */
  showStateicon: function showStateicon(url) {
    url = _iconImages2.default[url] || url || '';
    var iconStyle = this.stateIcon.style;
    iconStyle.display = 'block';
    iconStyle.background = 'no-repeat url(' + url + ') center center / 100% auto';
  },


  /**
   * 隐藏状态icon
   */
  hideStateicon: function hideStateicon() {
    try {
      this.stateIcon.style.display = 'none';
    } catch (e) {}
  },


  /**
   * 移除被拖动的节点
   * type 动画类型 不传则无动画直接消失 可选 fade | blost | back
   * time 动画持续时长 非必填
   */
  removeDragedNode: function removeDragedNode(type, time) {
    var _this3 = this;

    if (!type) return this.removeMark();
    if (!_config.REMOVE_ANIMATION_TYPES[type]) return this.removeMark();
    setTimeout(function () {
      clearTimeout(_this3.removeMarkTid);
    }, 0);
    this[_config.REMOVE_ANIMATION_TYPES[type]](time);
  }
}, _defineProperty(_dragStore, _config.REMOVE_ANIMATION_TYPES.fade, function () {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 150;

  var style = this.draggedNode && this.draggedNode.style;
  if (!style) return;
  style.transition = 'all ' + time / 1000 + 's ease';
  style.opacity = '0';
  setTimeout(this.removeMark.bind(this), time);
}), _defineProperty(_dragStore, _config.REMOVE_ANIMATION_TYPES.blost, function () {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 150;

  console.log('yeah');
  var style = this.draggedNode && this.draggedNode.style;
  if (!style) return;
  style.transition = 'all ' + time / 1000 + 's ease';
  style.boxShadow = '0 0 50px 30px rgba(0,0,0,0.3)';
  style.opacity = '0';
  setTimeout(this.removeMark.bind(this), time);
}), _defineProperty(_dragStore, _config.REMOVE_ANIMATION_TYPES.back, function () {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;

  var style = this.draggedNode && this.draggedNode.style;
  if (!style) return;
  style.transition = 'all ' + time / 1000 + 's cubic-bezier(0.2,0.4,0.25,1.1)';
  style.transform = 'translate(0,0)';
  setTimeout(this.removeMark.bind(this), time);
}), _defineProperty(_dragStore, 'removeMark', function removeMark() {
  var _this4 = this;

  clearTimeout(this.removeMarkTid);
  this.removeMarkTid = setTimeout(function () {
    console.log('removeMark');
    try {
      document.body.removeChild(_this4.markNode);
      _this4.draggedNode = null;
    } catch (e) {
      // console.log('出错', e)
    }
  }, 10);
}), _defineProperty(_dragStore, 'destroyDrop', function destroyDrop(name) {
  var _this5 = this;

  this.targets.forEach(function (item, i) {
    if (item.name === name) {
      _this5.removeDrop(i);
    }
  });
}), _defineProperty(_dragStore, 'removeDrop', function removeDrop(index) {
  delete this.targets[index];
  delete this.targetOnDragStarts[index];
  delete this.targetOnDragEnds[index];
  delete this.onDragEnters[index];
  delete this.onDragLeaves[index];
  delete this.onDragMoves[index];
  delete this.onDrops[index];
  delete this.targetPositions[index];
}), _defineProperty(_dragStore, 'getStateIconNode', function getStateIconNode() {
  return this.stateIcon;
}), _dragStore);

exports.default = dragStore;

/**
 * 供用户调用的静态方法
 */

var methods = exports.methods = {
  showStateicon: dragStore.showStateicon.bind(dragStore),
  hideStateicon: dragStore.hideStateicon.bind(dragStore),
  getStateIconNode: dragStore.getStateIconNode.bind(dragStore),
  removeDragedNode: dragStore.removeDragedNode.bind(dragStore),
  destroyDrop: dragStore.destroyDrop.bind(dragStore)
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.checkNode = checkNode;
function checkNode(el) {
  var result = el;
  if (!result) {
    return console.error('找不到当前节点', el);
  }
  if (typeof el === 'string') {
    var domName = el;
    result = document.querySelector(domName);
    if (!result) {
      return console.error('找不到当前节点', el);
    }
  } else if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object') {
    if (!el.nodeName) {
      return console.error('找不到当前节点', el);
    }
  }
  return result;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// 获取当前dom相对document位置
var getPosition = exports.getPosition = function getPosition(node) {
  var left = node.offsetLeft;
  var top = node.offsetTop;
  var parent = node.offsetParent;
  while (parent) {
    left += parent.offsetLeft;
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return { left: left, top: top };
};

// 获取当前dom相对视口位置和大小
var getBoundingClientRect = exports.getBoundingClientRect = function getBoundingClientRect(node) {
  return node.getBoundingClientRect();
};

// 获取当前dom大小
var getSize = exports.getSize = function getSize(node) {
  var result = {
    width: node.offsetWidth,
    height: node.offsetHeight
  };
  return result;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _check = __webpack_require__(1);

var _dom = __webpack_require__(2);

var _store = __webpack_require__(0);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drag = function () {
  function Drag(el, options) {
    _classCallCheck(this, Drag);

    this.initData(el, options) && this.init();
  }

  /**
   * 检查和初始化传入参数
   */


  _createClass(Drag, [{
    key: 'initData',
    value: function initData(el, options) {
      this.el = (0, _check.checkNode)(el);
      if (!this.el) return;

      this.el.style.userSelect = 'none';
      this.el.style.cursor = 'default';

      this.options = this.checkOptions(options);
      this.data = options.data;
      this.mouseDownPosition = { left: -1, top: -1 };
      this.mouseDragging = false;
      this.mark = null;
      this.position = { left: 0, top: 0 };
      return true;
    }

    // 初始化

  }, {
    key: 'init',
    value: function init() {
      this.addEventListener();
    }

    /**
     * 事件监听
     */

  }, {
    key: 'addEventListener',
    value: function addEventListener() {
      var _this = this;

      var dom = this.el;
      // 监听当前节点的鼠标点击事件
      dom.addEventListener('mousedown', function (e) {
        var pageX = e.pageX,
            pageY = e.pageY;

        _this.mouseDownPosition = { left: pageX, top: pageY };
        dom.onmousemove = _this.onElMousemove.bind(_this);
        dom.onmouseup = _this.onElMouseUp.bind(_this);
        document.addEventListener('mouseup', _this.onElMouseUp.bind(_this));
      });
    }

    /**
     * 监听拖动开始
     */

  }, {
    key: 'onElMousemove',
    value: function onElMousemove() {
      if (this.mouseDragging) return;
      this.mouseDragging = true;

      _store2.default.onDragStart(this.data, this.el);
      this.position = this.el.getBoundingClientRect();
      // 创建蒙层
      this.mark = document.createElement('div');
      this.mark.className = 'x-drag-mark';
      this.setMarkStyle();
      this.mark.onmousemove = this.onMarkMouseMove.bind(this);
      this.mark.onmouseup = this.onMarkMouseUp.bind(this);
      this.mark.onmouseleave = this.onMarkMouseUp.bind(this);
      _store2.default.markNode = this.mark;
      document.body.appendChild(this.mark);
      // 创建复制元素
      _store2.default.draggedNode = this.el.cloneNode(true);
      this.setCloneNodeStyle();
      this.mark.appendChild(_store2.default.draggedNode);

      // 创建状态icon
      _store2.default.stateIcon = document.createElement('i');
      _store2.default.stateIcon.className = 'x-state-icon';
      this.setIconStyle();
      this.mark.appendChild(_store2.default.stateIcon);

      this.emit('onDragStart', {
        el: this.el,
        data: this.data,
        methods: _store.methods
      });
    }

    /**
     * 监听拖动结束
     */

  }, {
    key: 'onElMouseUp',
    value: function onElMouseUp() {
      this.mouseDragging = false;
      this.el.onmousemove = null;
      this.el.onmouseup = null;
      this.mark && (this.mark.onmousemove = null);
      this.mark && (this.mark.onmouseup = null);
      document.removeEventListener('mouseup', this.onElMouseUp.bind(this));
    }

    /**
     * 监听蒙层鼠标移动
     */

  }, {
    key: 'onMarkMouseMove',
    value: function onMarkMouseMove(e) {
      if (!_store2.default.draggedNode) return;
      var pageX = e.pageX,
          pageY = e.pageY;

      var translateX = pageX - this.mouseDownPosition.left;
      var translateY = pageY - this.mouseDownPosition.top;
      _store2.default.draggedNode.style.transform = 'translate(' + translateX + 'px,' + translateY + 'px)';
      _store2.default.onDragMove(pageX, pageY);
    }

    /**
     * 监听蒙层鼠标放开
     */

  }, {
    key: 'onMarkMouseUp',
    value: function onMarkMouseUp() {
      document.removeEventListener('mouseup', this.onElMouseUp.bind(this));
      this.mouseDragging = false;
      this.mark.onmousemove = null;
      this.el.onmousemove = null;

      this.emit('onDragEnd', {
        el: this.el,
        data: this.data,
        target: _store2.default.targets[_store2.default.targetIndex]
      });
      _store2.default.onDragEnd();
    }

    /**
     * 检查并且初始化options
     */

  }, {
    key: 'checkOptions',
    value: function checkOptions(options) {
      options = options || {};
      var baseOptions = {
        data: '这里可以放需要丢给目标的内容',
        el: this.el,
        removeanimationtype: 1
      };
      for (var option in baseOptions) {
        !options[options] && (options[options] = baseOptions[option]);
      }
      return options;
    }

    /**
     * 设置蒙层样式
     */

  }, {
    key: 'setMarkStyle',
    value: function setMarkStyle() {
      var markStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '10'
      };
      for (var style in markStyle) {
        this.mark.style[style] = markStyle[style];
      }
    }

    /**
     * 设置克隆节点样式
     */

  }, {
    key: 'setCloneNodeStyle',
    value: function setCloneNodeStyle() {
      var dom = _store2.default.draggedNode;
      var style = dom.style;
      var _position = this.position,
          left = _position.left,
          top = _position.top;

      style.position = 'absolute';
      style.left = left + 'px';
      style.top = top + 'px';
      style.transform = 'translate(0,0)';
      style.zIndex = 1000;
    }

    /**
     * 设置状态icon样式
     */

  }, {
    key: 'setIconStyle',
    value: function setIconStyle() {
      var style = _store2.default.stateIcon.style;
      style.display = 'none';
      style.position = 'absolute';
      style.width = '20px';
      style.height = '20px';
      style.zIndex = '10001';
    }

    /**
     * 发布事件
     */

  }, {
    key: 'emit',
    value: function emit() {
      var _options;

      var args = Array.from(arguments);
      var functionName = args.shift();
      typeof this.options[functionName] === 'function' && (_options = this.options)[functionName].apply(_options, _toConsumableArray(args));
    }
  }]);

  return Drag;
}();

module.exports = Drag;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _check = __webpack_require__(1);

var _dom = __webpack_require__(2);

var _config = __webpack_require__(5);

var _store = __webpack_require__(0);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drop = function () {
  function Drop(el, options) {
    _classCallCheck(this, Drop);

    this.initData(el, options) && this.init();
  }

  /**
   * 检查并初始化传入参数
   */


  _createClass(Drop, [{
    key: 'initData',
    value: function initData(el, options) {
      this.el = (0, _check.checkNode)(el);
      if (!this.el) return;
      this.options = this.checkOptions(options);
      if (!this.options) return;

      this.index = -1; // 当前索引
      return true;
    }

    /**
     * 检查并且初始化options
     */

  }, {
    key: 'checkOptions',
    value: function checkOptions(options) {
      if (!options) {
        return console.error(this.el, '未检测到options 请参考相关说明' + _config.DOCUMENT_ADDR);
      }
      if (typeof options.onDrop !== 'function') {
        return console.error(this.el, 'onDrop 必须是一个函数 请参考相关说明' + _config.DOCUMENT_ADDR);
      }
      if (!options.name) {
        console.warn(this.el, '未给Drop定义name属性,不定义name将无法手动销毁当前Drop实例 请参考相关说明' + _config.DOCUMENT_ADDR);
      }
      var baseOptions = {
        name: null
      };
      for (var option in baseOptions) {
        !options[options] && (options[options] = baseOptions[option]);
      }
      return options;
    }

    /**
     * 初始化
     */

  }, {
    key: 'init',
    value: function init() {
      this.setStore();
    }

    /**
     * 托管状态
     */

  }, {
    key: 'setStore',
    value: function setStore() {
      var index = _store2.default.targets.push({
        el: this.el,
        name: this.options.name
      }) - 1;
      this.index = index;

      _store2.default.targetOnDragStarts[index] = this.onDragStart.bind(this);
      _store2.default.targetOnDragEnds[index] = this.onDragEnd.bind(this);
      _store2.default.onDragEnters[index] = this.onDragEnter.bind(this);
      _store2.default.onDragMoves[index] = this.onDragMove.bind(this);
      _store2.default.onDragLeaves[index] = this.onDragLeave.bind(this);
      _store2.default.onDrops[index] = this.onDrop.bind(this);
    }

    /**
     * 目标监听到拖动开始
     */

  }, {
    key: 'onDragStart',
    value: function onDragStart(params) {
      this.setStorePositions();
      this.emit('onDragStart', params);
    }

    /**
     * 目标监听到拖动结束
     */

  }, {
    key: 'onDragEnd',
    value: function onDragEnd(params) {
      this.emit('onDragEnd', params);
      params.methods.removeDragedNode();
    }

    /**
     * 目标监听到拖动进入当前范围
     */

  }, {
    key: 'onDragEnter',
    value: function onDragEnter(params) {
      this.emit('onDragEnter', params);
    }

    /**
     * 目标监听在自己上方拖动
     */

  }, {
    key: 'onDragMove',
    value: function onDragMove(params) {
      this.emit('onDragMove', params);
    }

    /**
     * 目标监听到离开当前范围
     */

  }, {
    key: 'onDragLeave',
    value: function onDragLeave(params) {
      this.emit('onDragLeave', params);
    }

    /**
     * 目标监听到被拖动元素在自己范围内放下
     */

  }, {
    key: 'onDrop',
    value: function onDrop(params) {
      this.emit('onDrop', params);
    }

    /**
     * 托管当前位置信息
     */

  }, {
    key: 'setStorePositions',
    value: function setStorePositions() {
      var _getBoundingClientRec = (0, _dom.getBoundingClientRect)(this.el),
          left = _getBoundingClientRec.left,
          top = _getBoundingClientRec.top,
          width = _getBoundingClientRec.width,
          height = _getBoundingClientRec.height;

      _store2.default.targetPositions[this.index] = {
        top: top,
        bottom: top + height,
        left: left,
        right: left + width
      };
    }

    /**
     * 发布事件
     */

  }, {
    key: 'emit',
    value: function emit() {
      var _options;

      var args = Array.from(arguments);
      var functionName = args.shift();
      typeof this.options[functionName] === 'function' && (_options = this.options)[functionName].apply(_options, _toConsumableArray(args));
    }
  }]);

  return Drop;
}();

module.exports = Drop;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DOCUMENT_ADDR = exports.DOCUMENT_ADDR = '';
var REMOVE_ANIMATION_TYPES = exports.REMOVE_ANIMATION_TYPES = {
  'fade': 'animation_fade',
  'blost': 'animation_blost',
  'back': 'animation_back'
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drag = __webpack_require__(3);

var _drag2 = _interopRequireDefault(_drag);

var _drop = __webpack_require__(4);

var _drop2 = _interopRequireDefault(_drop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var draggable = { Drag: _drag2.default, Drop: _drop2.default };

if (true) {
  window.Drag = _drag2.default;
  window.Drop = _drop2.default;
}

exports.default = { Drag: _drag2.default, Drop: _drop2.default };

// if ( typeof module === "object" && module && typeof module.exports === "object" ) {
//   export default {Drag, Drop}
// } else {
//   window.Drag = Drag
//   window.Drop = Drop
// }
//
// if ( typeof window === "object" && typeof window.document === "object" ) {
//     window.jQuery = window.$ = jQuery;
// }

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var IMAGES = {
  'add': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkUxNENCODcwMjdFMTFFNzhDQjhBODQ4QzIwNTVBM0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkUxNENCODgwMjdFMTFFNzhDQjhBODQ4QzIwNTVBM0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRTE0Q0I4NTAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRTE0Q0I4NjAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsH+M4sAAAPNSURBVHja5FrPS1RRGP3mOuqMQS5EpI0tApEiRVq5UZBAbBW06QdUWuTGRYt+gH+AULZo0aaosYK0TdAqCUJw5SokoxDBRW5CBiGDdGz0Td+Z7kz3Xe8b5715M16n8zgwzLu+d473u/d+97sTyWQyFAKizMfMPmYLs54pPNo6zC3mKnOGOczcLlVApEQjk8wBZiOeFfAZELDOnGZerLSRWWY3s5bCRZo5x+z1+4fCZ/sEM8XsKYMJks/ske9IlKNHMAaWma1eDb5sfqaFjXl6vfaK0s5vHgiOx39OUK2oo/NNl6ijoYtOxE8Weu8K81gxY6gYI0PMR8y4fmNx8yt9YvHPk0850J1gsc3GrjZfp0421R4/bmqyyRzZq4f2MjLGvC17JI+l1CLN//pIE8knocbVYPMN6jp0itpi7fot9Mg4czSIEZi4w6xRv0QP3F25SeXEvdaH2R7SsMO872XGy8iQXBdcPTG19pJeJJ9RJXCl+RpdaLps6plhU5iZjED8T31MPPg+Rh/W31Mlcbqxn24dGTWNmcP6BGCafpdtMAHgnXi3hrjUWHAdSehTLMJpP0yoZqBBQ6seXnpopWSeFMrAftP2jhpEQ/bzhrNB55bOhDkBIF+LmXpkVjWBKbbU2amGr4i8atyTn29ACzQpqJeadxnpVlthnbANBk3dupFJNXfCih32YhcGoAnatNxsUjUyoC96tsKgbSBnJCr3E3kgd7IVBm3QHhVyBY+oWWzQBLASgDZodOWd7EHI7WkeCxaHVQGNfULusfPAfsJ2GDS2CHXtyO41eVNkOwwa64WepjgWj48CGkU0SNpR7CodEzHX57dtxeVsO3z5TWd8G0HuFAlY+VGNFZ6Z/Fd2BFUJfPcIstggoZVNrZ1U0aFVdiN+YhdjImcGJs4u9ZetRwSRewoQByDaDBodITco/9JJUWe9EYPGLRhZVb9BBdB2GDSuwsiM+k3H7nqSdTBonBGyTpSfuFGLjVg8TqBNqxdD+7CQ9aF19Q5qsbbCoA3at3P/+mn1TqfF4WXQNq2u7DgpSufuoCqOgrJtgCatYp+W2l2DYU5tgaq4bTBomjPlWr3qmoLSPopipQCpRkZeQdIOFdCiHTdskXJEp1caUYYcVL+oZAXeCx6V+Qn6e2pgNAJ8I63+u19FbMCjIo8juaOuabmajxXQYERviAeiiysZTgYTRm1ePZJDVRy9qWYO/GFoDlVxPK1OAFb/YIBgxAcTzFSm/EjJdxWt7b/9UY2azmC/OcX8oe5nAiAjnzEln9kbaKxVyw/P/ggwAL2hTh2cIlwtAAAAAElFTkSuQmCC',

  'reject': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUZGQzQzNkEwMjdGMTFFNzhDQjhBODQ4QzIwNTVBM0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUZGQzQzNkIwMjdGMTFFNzhDQjhBODQ4QzIwNTVBM0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRTE0Q0I4OTAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRTE0Q0I4QTAyN0UxMUU3OENCOEE4NDhDMjA1NUEzRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmdTj/IAAAXZSURBVHja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'
};
exports.default = IMAGES;

/***/ })
/******/ ]);