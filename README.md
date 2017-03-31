## dnd.js

##### 拖放库 drag and drop

[查看DEMO](http://qgh810.github.io/src/dnd/index.html)

不依赖任何第三方库的拖放库,兼容低版本浏览器,兼容移动端,自带常用动画效果,[如果在vue项目中使用](https://github.com/qgh810/dnd/tree/master/vue),可以拷贝上面vue文件夹中已经封装好的组件直接使用.

<img src="https://raw.githubusercontent.com/qgh810/draggable/master/demo/demo.gif" width="650">


### 安装方法
-  方式一
```bash
npm install dnd.js --save
```

- 方式二

```bash
下载项目中的dist/dnd.js, 然后用script标签插入到你的项目中, 如下
这种方式可以通过window.dnd访问
```

```html
<script type="text/javascript" src="dist/dnd.js"></script>
```

### 使用方法
-  最简单的使用方法可以可以查看[最小demo](https://github.com/qgh810/dnd/blob/master/demo/demo-mini.html)
- 也可以查看[稍微复杂一点的demo](https://github.com/qgh810/dnd/blob/master/demo/demo1.html)
```js
import { Drag, Drop } from 'dnd.js'

new Drag(element, options)
new Drop(element, options)
```
- 如果是使用方式二引入的话, 可以这样使用
```js
var Drag = dnd.Drag
var Drop = dnd.Drop
new Drag(element, options)
new Drop(element, options)
```

- 最小demo代码展示
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>最小化demo</title>
    <script type="text/javascript" src="../dist/dnd.js"></script>
    <style>
      html, body { width:100%; height:100%; }
      body { margin:0; padding:20px; box-sizing:border-box; }
      .drop { margin:20px auto; width:100%; height:100px; border:1px solid #000; }
    </style>
  </head>

  <body>
    <div class="drop"></div>
    <div class="drag">
      拖动我到上方框框
    </div>
  </body>

  <script>
    var Drag = dnd.Drag
    var Drop = dnd.Drop
    new Drag('.drag')
    new Drop('.drop', {
      onDrop: function (params) {
        params.el.appendChild(params.sourceNode)
      }
    })
  </script>
</html>
```


### 参数说明
-  创建
```js
new Drag(element, options)
new Drop(element, options)
```
| 参数 | 是否必填 | 类型 | 说明 |
| :------------ |:---------------:| :---------------| :-----|
| element | 是 | String or htmlElementObject | 可以传入类名class 或者 id名 或者 dom节点 |
| options | 是 | Object | 相关参数和回调函数,具体说明看下面 |

-  options说明 (Drag)

例如:

```js
  let element = '.drag-container'
  let options = {
    data: '本次拖动希望传递给Drop对象的参数',
    onDragStart: function (params) {
      console.log('监听到拖动开始')
    },
    onDragEnd: function (params) {
      console.log('监听到拖动结束')
    }
  }
  new Drag(element, options)
```

##### options属性说明:

| 参数 | 是否必填 | 类型 | 说明 |
| :-------- |:-----:| :-----:| :-----|
| data | 否 | 任意 | 本次拖动希望传递给Drop对象的参数 |
| onDragStart | 否 | Function | 拖动开始回调函数 |
| onDragEnd | 否 | Function | 拖动结束回调函数 |

-  options说明 (Drop)

例如:

```js
  let element = '.drop-container'
  let options = {
    name: '当前Drop对象的名字',
    onDragStart (params) {
      console.log('监听到拖动开始')
    },
    onDragEnter (params) {
      console.log('监听到被拖元素进入')
    },
    onDragOver (params) {
      console.log('监听到被拖动元素在自己上方移动')
      console.log('这个函数会被连续调用')
    },
    onDragLeave (params) {
      console.log('监听被拖动元素离开')
    },
    onDrop (params) {
      console.log('监听到被拖动元素在自己上方放下')
    },
    onDragEnd (params) {
      console.log('监听到拖动结束')
    }
  }
  new Drop(element, options)
```

##### options属性说明:

| 属性 | 是否必填 | 类型 | 说明 | 回调函数参数说明 |
| :-------- |:-----:| :-----:| :-----| :---|
| name | 否 | String | 定义当前Drop对象的名字 | - |
| onDragStart | 否 | Function | 拖动开始时调用 | 见下方说明 |
| onDragEnter | 否 | Function | 拖动进入时调用 | 见下方说明 |
| onDragOver | 否 | Function | 被拖动元素在自己上方移动时候调用, 这个函数会被连续调用 | 见下方说明 |
| onDragLeave | 否 | Function | 拖动离开时候调用 | 见下方说明 |
| onDrop | 是 | Function | 被拖动元素在自己上方放下时调用 | 见下方说明 |
| onDragEnd | 否 | Function | 拖动结束时候调用 | 见下方说明 |

##### 回调函数的参数params说明:

| 属性 | 类型 | 描述 |
| :----- | :----- | :----- |
| data | 不定 | 被拖动元素定义的data属性, 类型由Drag对象被创建的时候传入的data属性决定 |
| el | Object | 当前dom节点 |
| enter | Boolean | 是否进入当前范围的标志位, 布尔值 |
| methods | Object | 见下方 回调函数参数中的methods说明 |
| name | String | Drop名称, 在销毁当前Drag对象时候需要用到 |
| sourceNode | Object | 被拖动元素的dom节点 |

##### 回调函数的参数中的methods对象说明:

提供一些方法供回调函数调用


- showStateicon: 显示状态图标<br />例如:<br />
showStateicon('add')
<br />
<img src="https://raw.githubusercontent.com/qgh810/qgh810.github.io/master/src/dnd/assets/images/show-add.gif">
<br />
showStateicon('error')<br />
<img src="https://raw.githubusercontent.com/qgh810/qgh810.github.io/master/src/dnd/assets/images/show-error.gif">
<br />
你也可以传入自己喜欢的图片 例如这样:<br /> showStateicon('https://ss2.bdstatic.com/lfoZeXSm1A5BphGlnYG/icon/10062.png')<br />
<img src="https://raw.githubusercontent.com/qgh810/qgh810.github.io/master/src/dnd/assets/images/show-taobao.gif">
<br />
还有 showStateicon('delete') 和 showStateicon('reject') 分别出现'删除'图标和'禁止'的图标
<br />
- hideStateicon: 隐藏状态图标
<br />
- removeDragedNode: 移除跟随鼠标移动的被拖元素<br />例如:<br />
removeDragedNode('fade')
<br />
<img src="https://raw.githubusercontent.com/qgh810/qgh810.github.io/master/src/dnd/assets/images/hide-node-fade.gif">
<br />
removeDragedNode('back')
<br />
<img src="https://raw.githubusercontent.com/qgh810/qgh810.github.io/master/src/dnd/assets/images/hide-node-back.gif">
<br />
removeDragedNode('blost')
<br />
<img src="https://raw.githubusercontent.com/qgh810/qgh810.github.io/master/src/dnd/assets/images/hide-node-blost.gif">
<br />


- getStateIconNode: 获取跟随鼠标移动的状态图标dom节点


- destroyDrop: 销毁当前Drop对象


| 方法名 | 示例 | 参数说明 | 描述 |
| :---  | :--- | :----  | :-- |
| showStateicon | params.methods.showStateicon('add') | 参数类型: String, 内置三种常用图标: 添加('add'), 错误('error'), 删除('delete'), 拒绝(reject),传入对应的名字即可, 也可以自定义图标,直接传入图片的完整地址  | 显示状态图标, 调用后会在鼠标旁边出现一个跟随鼠标移动的小图标, 如果要隐藏只需要调用hideStateicon函数即可 |
| hideStateicon | params.methods.hideStateicon() | 无参数  | 隐藏跟随鼠标移动的状态图标(如果没有调用showStateicon函数的话图标默认不显示) |
| removeDragedNode | params.methods.removeDragedNode(animationName, time) | animationName(动画类型), 参数类型:String, 非必填, 可选: fade / blost / back, time(动画时间, 单位毫秒), 参数类型: Number, 非必填  | 移除跟随鼠标移动的被拖元素, 如果没有参数则直接消失, 有参数表示执行消失动画后再消失 目前支持三种动画, 分别是: 褪色(fade), 爆炸(blost), 反弹(back), 三种动画对应不同也应用场景, 例如: removeDragedNode('blost', 300) |
| getStateIconNode | params.methods.getStateIconNode() | 无参数  | 返回跟随鼠标移动的状态图标dom节点 |
| destroyDrop | params.methods.destroyDrop({name}) | 参数类型: String, Drag对象的名字  | 销毁Drop对象,匹配所有名字跟传入参数一致的Drop对象并销毁, 销毁后将不能接收Drag对象 |
