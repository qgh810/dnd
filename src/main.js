
import Drag from './drag'
import Drop from './drop'

const draggable = {Drag, Drop}

if (true) {
  window.Drag = Drag
  window.Drop = Drop
}

export default {Drag, Drop}
// var Drag = require('./drag.js')
// var Drop = require('./drop.js')
// module.exports = {}
