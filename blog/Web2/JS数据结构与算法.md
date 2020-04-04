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

后进先出的数据结构。

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

