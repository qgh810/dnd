function Drag (el, options) {
  // 检测el是否为dom
  if (typeof el === 'string') {
    let domName = el
    el = document.querySelector(domName)
    if (!el) {
      return console.error('未找到' + domName)
    }
  }

  if (!el.nodeName) {
    return console.error('未找到' + el)
  }

}

module.exports = Drag
