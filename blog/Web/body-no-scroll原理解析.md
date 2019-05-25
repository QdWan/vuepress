---
title: 'body-scroll-lock原理解析'
---

## body-scroll-lock原理解析

在做个人项目[Clash-Royale-PWA](https://www.pomo16.club/)时，碰到了一个问题：点击添加卡组后会出现遮罩层，但是此时触摸遮罩层仍然会滚动外层body。自己尝试使用的方法其实和`body-no-scroll`处理`ios`端的方法一致，只是其封装的比较好，因此在这里决定记录一下这种解决body滚动方法。

## 解决IOS端之外的方法

其实就是弹出遮罩层时将`document.body`的`overflow`设置成`hidden`，这样外层body就不会再滚动，待遮罩层隐藏时，再重新设回`overfloaw`即可。

## 解决IOS端的方法

这里`body-scroll-lock`使用了事件委托的机制，这也是它封装的比较好的地方。

### 实现

```js
let locks = []
```

首先创建一个`locks`数组存储使用了`body-scroll-lock`的dom节点，例如：如果我有两个弹出层，那么`locks`数组存储的就是这两个dom节点，当我点击任意一个弹出层时，只需通过事件委托，遍历该数组找到对应弹出层，让其可以滚动即可。

```js
function disableBodyScroll (targetElement) {
  if (isIOS) {
    if (!locks.some(lock => lock === targetElement)) {
      locks.push(targetElement)
    }
  } else {
    // ...
  }
}
```

这里首先判断是否是`IOS`环境，其次判断`locks`数组中是否已经缓存了该dom节点，如果没有就将该节点缓存进数组中进行记录。

```js
let initialClientY;
function disableBodyScroll (targetElement) {
  if (isIOS) {
    if (!locks.some(lock => lock === targetElement)) {
      locks.push(targetElement)
      
      targetElement.ontouchstart = (event) => {
        initialClientY = event.targetTouches[0].clientY;
      }
    }
  } else {
    // ...
  }
}
```

然后监听`touchstart`事件，并用initialClientY`记录一开始点击的位置，这是因为后续要使用该值判断滚动方向是向上还是向下。

