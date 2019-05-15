---
title: '关于css放顶部和js放底部的一些理解'
---

## CSS文件放在顶部

### 为什么放在顶部会加快页面呈现

CSS的加载和DOM解析是可以并行执行的，但是css文件放在顶部可以尽早地构建CSSOM树，页面的呈现必须依赖DOM树和CSSOM树生成的Render树，所以如果css文件在底部时，CSSOM树的建立也会被推迟，从而导致页面的呈现被推迟。

### 为什么要结合DOM树和CSSOM树才能渲染

如果仅依靠DOM树就进行渲染，那么当CSS改变了DOM节点的尺寸时，就会导致页面的重排和重绘，会造成性能的损耗。与其让这个重排重绘的过程发生，倒不如等到CSSOM构建完成之后，一次性的将页面呈现给用户，这样就可以减少重排和重绘了。



## JS文件放在底部

如果script标签不带defer和async标签时，script标签会阻塞DOM解析这个过程，即需要加载js文件并执行，才会接着后面元素的解析。如果js文件执行的时间过长，那么页面就会一直处于空白。在遇到script标签时，浏览器会先对先前的DOM节点进行一次渲染，这样script标签可以获取该script标签之前的dom元素节点，但是拿不到之后的节点。

### async属性和defer属性

async属性的script不会阻塞后续元素的解析，但是一旦加载完毕就会立刻执行，因此不保证之间的执行顺序，并且执行时期可能在DOMContentLoaded之前或之后，不建议进行dom操作。defer属性的script也不会阻塞后续元素的解析，并且它的执行是在DOMContentLoaded之后，脚本的执行有先后顺序。使用这两个属性的脚本不能调用document.write方法，只适用于外部脚本。



## 参考

[how-js-and-css-block-dom](<https://github.com/ljf0113/how-js-and-css-block-dom>)

[浅谈script标签中的async和defer属性](<https://www.cnblogs.com/jiasm/p/7683930.html>)

