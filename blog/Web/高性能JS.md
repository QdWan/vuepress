---
sidebar: auto
title: '高性能JS'
---

## 关于重排和重绘

```js
div.style.top = '10px'
div.style.bottom = '10px'
// console.log(div.offsetWidth)
div.style.right = '10px'
div.style.left = '10px'
```

上面代码中，除了注释部分有4条语句，都改变了dom节点的样式，浏览器会有个优化，就是维护一个渲染队列，一次性进行重排和重绘。但是有一些操作会强制刷新这个渲染队列，触发重排，例如上面注释那行代码，访问了offsetWidth属性，一般访问这些位置相关的属性时，就会强制刷新这个渲染队列，以便确定准确的位置。也存在一些老版本浏览器，可能没有维护队列，进行优化。

### 优化方法

- 样式集中改变
- 缓存布局属性
- 将DOM离线，可能造成闪烁的问题
- 脱离文档流
- 启用GPU加速
  - Canvas2D
  - CSS transition
  - CSS transform
  - WebGL
  - video