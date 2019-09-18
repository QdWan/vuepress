## JS获取鼠标位置

### 相对于屏幕

```js
event.screenX, event.screenY
```



### 相对于浏览器窗口

```js
event.clientX, event.clientY
```



### 相对于文档

和相对于浏览器窗口相比，该位置会加上页面滚动的高度

```js
event.pageX || (event.clientX + document.documentElement.scrollLeft || document.body.scrollLeft)
event.pageY || (event.clientY + document.documentElement.scrollTop || document.body.scrollTop)
```



[scrollTop scrollHeight clientHeight offsetHeight整理](<https://github.com/iuap-design/blog/issues/38>)