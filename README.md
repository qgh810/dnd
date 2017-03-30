## dnd.js

##### 拖放库 drag and drop

不依赖任何第三方库的拖放库,兼容低版本浏览器,兼容移动端,自带常用动画效果,[如果在vue项目中使用](https://github.com/qgh810/dnd/tree/master/vue),可以拷贝上面已经封装好的组件直接使用.

<img src="https://raw.githubusercontent.com/qgh810/draggable/master/demo/demo.gif" width="650">


### 安装方法
  方式一
  ```
  npm install dnd.js --save
  ```

  方式二

    下载项目中的dist/dnd.js, 然后用script标签插入到你的项目中, 如下
    这种方式会在window对象上挂载dnd属性

  ```html
  <script type="text/javascript" src="dist/dnd.js"></script>
  ```

  ### 使用方法
  ```js
  import { Drag, Drop } from 'dnd.js'

  new Drag(element, options)
  new Drop(element, options)
  ```
  如果是使用方式二引入的话, 可以这样使用
  ```js
  var Drag = dnd.Drag
  var Drop = dnd.Drop
  new Drag(element, options)
  new Drop(element, options)
  ```

  ### 参数说明
  ...
