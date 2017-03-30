## dnd.js

##### 拖放库 drag and drop

不依赖任何第三方库的拖放库,兼容低版本浏览器,兼容移动端,自带常用动画效果,[如果在vue项目中使用](https://github.com/qgh810/dnd/tree/master/vue),可以拷贝上面已经封装好的组件直接使用.

<img src="https://raw.githubusercontent.com/qgh810/draggable/master/demo/demo.gif" width="650">


### 安装方法
-  方式一
```bash
npm install dnd.js --save
```

- 方式二

```bash
下载项目中的dist/dnd.js, 然后用script标签插入到你的项目中, 如下
这种方式会在window对象上挂载dnd属性
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
-  待完善...
