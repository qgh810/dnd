
export function checkNode (el) {
  let result = el
  if (!result) {
    return console.error('找不到当前节点', el)
  }
  if (typeof el === 'string') {
    let domName = el
    result = document.querySelector(domName)
    if (!result) {
      return console.error('找不到当前节点', el)
    }
  } else if (typeof el === 'object') {
    if (!el.nodeName) {
      return console.error('找不到当前节点', el)
    }
  }
  return result
}
