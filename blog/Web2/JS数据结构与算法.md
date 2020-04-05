---
sidebar: auto
title: 'JS数据结构与算法'
---

# JS数据结构与算法

## 数组

### 方法

- concat
- every：在每个元素运行给定函数，如果每个元素都返回true，则返回true
- filter
- forEach
- join
- indexOf
- lastIndexOf
- map
- reverse
- slice
- some：在每个元素运行给定函数，如果任一元素返回true，则返回true
- sort
- toString
- valueOf
- reduce
- copyWithin：复制数组中一系列元素到同一数组的起始位置
- entries
- includes
- find
- findIndex
- fill
- from
- keys
- values

使用@@interator对象

```js
const arr = ['a', 'b', 'c', 'd', 'e']
const iterator = arr[Symbol.iterator]()
console.log(iterator.next()); // { value: 'a', done: false }
```

### 类型数组

- Int8Arrary
- Uint8Array
- [Uint8ClampedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)：8位无符号整型固定数组
- Int16Array
- Uint16Array
- Int32Array
- Uint32Array
- Float32Array
- Float64Array

使用WebGL API、进行位操作、处理文件和图像时，类型数组可以大展拳脚。[类型数组教程](https://www.html5rocks.com/en/tutorials/webgl/typed_arrays/)。



## 栈

后进先出。

包含的方法：

- push
- pop
- peek
- isEmpty
- clear
- size

### 保护数据结构内部的元素

Stack类中声明的items和count属性外界可以访问，可以通过以下方法解决：

- 下划线命名约定
- 使用Symbol类型的类成员变量
  - Object.getOwnPropertySymbols仍能获得类中声明的属性
- WeakMap存储items
  - 可读性不强，扩展该类无法集成私有属性

```js
const items = new WeakMap()

class Stack {
  constructor() {
    items.set(this, [])
  }
  push(element) {
    const s = items.get(this)
    s.push(element)
  }
}
```

### 用栈的方法解决问题

#### 从十进制到二进制

#### 进制转换算法



## 队列和双端队列

先进先出。

包含方法：

- enqueue
- dequeue
- peek
- isEmpty
- size

双端队列允许同时从前、后两处添加和删除元素。

包含方法：

- addFront
- addBack
- removeFront
- removeBack
- peekFront
- peekBack

### 使用队列和双端队列解决问题

#### 循环队列——击鼓传花游戏

#### 回文检查器

#### JS任务队列



## 链表

与数组不同，链表元素并不是连续内存。

包含的方法：

- push
- insert
- getElementAt
- remove
- indexOf
- removeAt
- isEmpty
- size

### 双向链表

一个链表节点中，既能链向下一个元素，也能链向上一个元素。

### 循环链表

既可以单向引用，也可以双向引用。head.prev指向tail，tail.next指向head。

### 有序链表



## 集合

无序且唯一。

包含的方法：

- add
- delete
- has
- clear
- size
- values

### 集合运算

- 并集
- 交集
- 差集
- 子集

#### 改进交集方法

迭代元素数量较少的集合

### 多重集或袋



## 字典和散列表

### 字典

字典包含的方法：

- set
- remove
- hasKey
- get
- clear
- size
- isEmpty
- keys
- values
- keyValues
- forEach

### 散列表

散列表包含的方法：

- put
- remove
- get

解决冲突：

- 线性探查

需要一个散列函数，利于lose lose、djb2。



## 递归

