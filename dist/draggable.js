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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drag = __webpack_require__(1);

var _drag2 = _interopRequireDefault(_drag);

var _drop = __webpack_require__(2);

var _drop2 = _interopRequireDefault(_drop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var draggable = { Drag: _drag2.default, Drop: _drop2.default };

if (true) {
  window.Drag = _drag2.default;
  window.Drop = _drop2.default;
}

exports.default = { Drag: _drag2.default, Drop: _drop2.default };
// var Drag = require('./drag.js')
// var Drop = require('./drop.js')
// module.exports = {}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Drag(el, options) {
  // 检测el是否为dom
  if (typeof el === 'string') {
    var domName = el;
    el = document.querySelector(domName);
    if (!el) {
      return console.error('未找到' + domName);
    }
  }

  if (!el.nodeName) {
    return console.error('未找到' + el);
  }
}

module.exports = Drag;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Drop() {
  console.log('drop');
}

module.exports = Drop;

/***/ })
/******/ ]);