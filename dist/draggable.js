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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _check = __webpack_require__(6);

var _dom = __webpack_require__(7);

var _store = __webpack_require__(5);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drag = function () {
  function Drag(el, options) {
    _classCallCheck(this, Drag);

    this.initData(el, options) && this.init();
  }

  _createClass(Drag, [{
    key: 'initData',
    value: function initData(el, options) {
      this.el = (0, _check.checkNode)(el);
      if (!this.el) return;

      this.el.style.userSelect = 'none';

      this.options = this.checkOptions(options);
      this.data = options.data;
      this.mouseDownPosition = { left: -1, top: -1 };
      this.mouseDragging = false;
      this.backTime = 300;
      this.mark = null;
      this.position = { left: 0, top: 0 };
      return true;
    }
  }, {
    key: 'init',
    value: function init() {
      this.addEventListener();
    }
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
  }, {
    key: 'onElMousemove',
    value: function onElMousemove() {
      if (this.mouseDragging) return;
      this.mouseDragging = true;

      _store2.default.data = this.data;
      this.el.style.opacity = '0.5';
      this.position = (0, _dom.getBoundingClientRect)(this.el);
      // 创建蒙层
      this.mark = document.createElement('div');
      this.mark.className = 'x-drag-mark';
      this.setMarkStyle();
      this.mark.onmousemove = this.onMarkMouseMove.bind(this);
      this.mark.onmouseup = this.onMarkMouseUp.bind(this);
      this.mark.onmouseleave = this.onMarkMouseUp.bind(this);
      document.body.appendChild(this.mark);
      // 创建复制元素
      _store2.default.cloneDom = this.el.cloneNode(true);
      this.setCloneDomStyle();
      this.mark.appendChild(_store2.default.cloneDom);

      this.emit('onDragStart');
    }
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
  }, {
    key: 'onMarkMouseMove',
    value: function onMarkMouseMove(e) {
      if (!_store2.default.cloneDom) return;
      var pageX = e.pageX,
          pageY = e.pageY;

      var translateX = pageX - this.mouseDownPosition.left;
      var translateY = pageY - this.mouseDownPosition.top;
      _store2.default.cloneDom.style.transform = 'translate(' + translateX + 'px,' + translateY + 'px)';
      _store2.default.mousePosition = [pageX, pageY];
    }
  }, {
    key: 'onMarkMouseUp',
    value: function onMarkMouseUp() {
      document.removeEventListener('mouseup', this.onElMouseUp.bind(this));
      this.mouseDragging = false;
      this.mark.onmousemove = null;
      this.el.onmousemove = null;

      this.mark.style.cursor = 'auto';
      var style = _store2.default.cloneDom && _store2.default.cloneDom.style;
      if (!style) return;
      // 复制的dom的动画效果
      if (_store2.default.canBack) {
        style.transition = 'all ' + this.backTime / 1000 + 's cubic-bezier(0.2,0.4,0.25,1.1)';
        style.transform = 'translate(0,0)';
        setTimeout(this.removeMark, this.backTime);
      } else {
        if (this.options.removeanimationtype === 0 && !_store2.default._inTarget) {
          // 删除动画类型0 渐渐消失
          style.transition = 'all 0.1s ease';
          style.opacity = '0';
          setTimeout(this.removeMark, 200);
        } else if (this.options.removeanimationtype === 1 && !_store2.default._inTarget) {
          // 删除动画类型1 爆炸
          style.transition = 'all 0.1s ease';
          style.boxShadow = '0 0 50px 30px rgba(0,0,0,0.3)';
          style.opacity = '0';
          setTimeout(this.removeMark, 100);
        } else {
          this.removeMark();
        }
      }
      // 1是否会返回, 2源数据, 3是否在目标内, 4拓展参数
      this.emit('onDragEnd', {
        isBack: _store2.default.canBack,
        data: this.data,
        inTarget: _store2.default._targetIndex > -1
      });
      _store2.default.data = null;
    }
  }, {
    key: 'removeMark',
    value: function removeMark() {
      document.body.removeChild(this.mark);
      _store2.default.cloneDom = null;
      this.el.style.opacity = '1';
    }

    // 检查并且初始化options

  }, {
    key: 'checkOptions',
    value: function checkOptions(options) {
      options = options || {};
      var baseOptions = {
        data: '这里可以放需要丢给目标的内容',
        removeanimationtype: 1
      };
      for (var option in baseOptions) {
        !options[options] && (options[options] = baseOptions[option]);
      }
      return options;
    }
  }, {
    key: 'setMarkStyle',
    value: function setMarkStyle() {
      var markStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.1)',
        zIndex: '10',
        cursor: 'move'
      };
      for (var style in markStyle) {
        this.mark.style[style] = markStyle[style];
      }
    }
  }, {
    key: 'setCloneDomStyle',
    value: function setCloneDomStyle() {
      var dom = _store2.default.cloneDom;
      var style = dom.style;
      var _position = this.position,
          left = _position.left,
          top = _position.top;

      style.position = 'absolute';
      style.left = left + 'px';
      style.top = top + 'px';
      style.opacity = '1';
      style.transform = 'translate(0,0)';
      style.cursor = 'move';
      style.zIndex = 10;
    }
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Drop() {
  console.log('drop');
}

module.exports = Drop;

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drag = __webpack_require__(0);

var _drag2 = _interopRequireDefault(_drag);

var _drop = __webpack_require__(1);

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
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var dragStore = {
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
  get data() {
    return this._data;
  },
  // 设置数据
  set data(val) {
    var oldData = this._data;
    this._data = val;
    // store监听数据data变化事件
    this._onDataChange(val, oldData);
  },

  // 获取鼠标位置
  get mousePosition() {
    return this._mousePosition;
  },
  // 设置鼠标位置
  set mousePosition(position) {
    this._mousePosition = position;
    this._onPositionChange(position);
  },

  get targetIndex() {
    return this._targetIndex;
  },
  set targetIndex(index) {
    if (this._targetIndex > -1 && this._prevIndex !== this._targetIndex) this._prevIndex = this._targetIndex;
    if (this._targetIndex > -1) this._prevValidIndex = this._targetIndex;
    this._targetIndex = index;
  },

  _onDataChange: function _onDataChange(data, oldData) {
    var _this = this;

    // 如果当前数据存在 向被拖拽元素广播拖动开始事件
    data && this.targetOnDragStarts.map(function (fn, index) {
      return fn && fn(data, _this.conditions[index](data));
    });
    // 鼠标放下 向成功目标广播事件
    // targetOnDragEnds
    // !data && this.targetOnDragEnds[this.targetIndex](this.targetIndex > -1, oldData)
    !data && this.targetOnDragEnds.forEach(function (fn) {
      return fn(_this.targetIndex > -1, oldData);
    });
    !data && this.targetIndex > -1 && this.onDrops[this.targetIndex](!this.canBack, oldData);
    this._initStore();
  },
  _onPositionChange: function _onPositionChange(position) {
    var _position = _slicedToArray(position, 2),
        pageX = _position[0],
        pageY = _position[1];

    this.targetIndex = -1;
    // 碰撞检测
    for (var i = 0; i < this.targetPositions.length; i++) {
      var _position2 = this.targetPositions[i];
      if (!_position2) continue;
      var index = i;
      if (pageX >= _position2.left && pageY >= _position2.top && pageX <= _position2.right && pageY <= _position2.bottom) {
        this.targetIndex = index;
        break;
      }
    }
    if (this.targetIndex > -1) {
      if (!this._inTarget) {
        this._inTarget = true;
        var success = Boolean(this.conditions[this.targetIndex](this.data));
        var iconClassName = success ? this.iconClasss[this.targetIndex].accept : this.iconClasss[this.targetIndex].notAccept;

        this._stateIcon = document.createElement('i');
        this._stateIcon.className = iconClassName;
        this.cloneDom.appendChild(this._stateIcon);

        this.canBack = !success;
        this.onDragEnters[this.targetIndex](success, this.data);
      } else {
        if (this._prevIndex > -1 && this.targetIndex !== this._prevIndex) {
          this.canBack = true;
          this._inTarget = false;
          this.removeIcon();
          this.onDragLeaves[this._prevValidIndex]();
        }
      }
    } else {
      if (this._inTarget) {
        this.canBack = false;
        this._inTarget = false;
        this.removeIcon();
        this.onDragLeaves[this._prevValidIndex]();
      }
    }
  },
  _initStore: function _initStore() {
    // 这里需要初始化store  因为这里是因为数据data变化出发的 所以这里初始化不能设置data
    this.canBack = false;
    this._inTarget = false;
    this._mousePosition = [-1, -1];
    this.removeIcon();
    this.cloneDom = null;
  },
  removeIcon: function removeIcon() {
    try {
      this.cloneDom.removeChild(this._stateIcon);
    } catch (e) {}
  },
  removeDrop: function removeDrop(index) {
    delete this.targetPositions[index];
    delete this.conditions[index];
    delete this.targetOnDragStarts[index];
    delete this.onDragEnters[index];
    delete this.onDragLeaves[index];
    delete this.onDrops[index];
    delete this.iconClasss[index];
  }
};

exports.default = dragStore;

/***/ }),
/* 6 */
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
/* 7 */
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

/***/ })
/******/ ]);