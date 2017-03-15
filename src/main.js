
import Drag from './drag'
import Drop from './drop'

const draggable = {Drag, Drop}

if (true) {
  window.Drag = Drag
  window.Drop = Drop
}

export default {Drag, Drop}

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
