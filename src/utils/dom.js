// 获取当前dom相对document位置
export const getPosition = function (node) {
  var left = node.offsetLeft
  var top = node.offsetTop
  var parent = node.offsetParent
  while (parent) {
    left += parent.offsetLeft
    top += parent.offsetTop
    parent = parent.offsetParent
  }
  return {left: left, top: top}
}

// 获取当前dom相对视口位置和大小
export const getBoundingClientRect = function (node) {
  return node.getBoundingClientRect()
}

// 获取当前dom大小
export const getSize = function (node) {
  var result = {
    width: node.offsetWidth,
    height: node.offsetHeight
  }
  return result
}
