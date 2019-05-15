---
sidebar: auto
title: ES6学习笔记
---

## let命令

### 不存在变量提升

- var命令会发生变量提升，而let命令不存在变量提升



### 暂时性死区

- 只要块级作用域内存在let命令，它所声明的变量就绑定这个区域，不受外部的影响

```js
var tmp = 123
if (true) {
    tmp = 'abc' // ReferenceError
    let tmp
}
```

- 暂时性死区意味着typeof不再是一个百分之百安全的操作
- 有些死区比较隐蔽，不容易发现

```js
function bar (x=y, y=2) {
    return [x, y]
}

bar() // Error
```

- ES6规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而造成意料之外的行为。



### 不允许重复声明

- let不允许在相同作用域内，重复声明同一个变量
- 不能在函数内部重新声明参数

```js
function func (arg) {
    let arg
}
func() // Error

function func (arg) {
    {
        let arg
    }
}
func() // no error
```





## 块级作用域

### 为什么需要块级作用域？

- ES5只有全局作用域和函数作用域
- 第一种场景，内层变量可能会覆盖外层变量。下面代码由于变量提升导致内层tmp变量覆盖外层tmp变量

```js
var tmp = new Date()
function f () {
    console.log(tmp)
    if (false) {
        var tmp = 'hello world'
    }
}

f() // undefined
```

- 第二种场景，用来计数的循环变量泄露为全局变量

```js
var s = 'hello'
for (var i=0; i<s.length; i++) {
    console.log(s[i])
}
console.log(i) // 5
```

- for循环有个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内是一个单独的子作用域

```js
for (let i=0; i<3; i++) {
    let i = 'abc'
    console.log(i)
}
// abc
// abc
// abc
```



### 块级作用域与函数声明

- ES5规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明
- 下面代码在ES5中运行，会得到“I am inside”，因为在if内声明的函数f会被提升到函数头部

```js
function f () { console.log('I am outside') }
(function () {
    if (false) {
        function f () { console.log('I am inside') }
    }
    
    f()
}())
```

- 上面代码在ES6中运行会报错，实际代码如下。遵循以下规则：
  - 允许在块级作用域内声明函数
  - 函数声明类似于var，会提升到全局作用域或函数作用域
  - 函数声明还会提升到所在的块级作用域的头部

```js
function f () { console.log('I am outside') }
(function () {
    var f = undefined
    if (false) {
        function f () { console.log('I am inside') }
    }
    
    f()
}())
```

- 考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数，必要时，应写成函数表达式
- ES6的块级作用域允许声明函数的规则，只在大括号的情况下成立



## const命令

### 本质

- const保证的不是变量的值不变，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型，值就是保存在变量指向的那个内存地址；对于复合类型，变量指向的内存izhi，保存的只是一个指向实际数据的指针。

### ES6变量声明的6种方式

- var、function
- let、const、import、class



## 顶层对象的属性

- 浏览器环境指的是window对象，Node指的是global对象
- 在ES5中，顶层对象的属性与全局变量是等价的
- ES6中，var和function声明的全局变量依旧是顶层对象的属性；let、const、class声明的全局变量不属于顶层对象的属性



## Promise对象

### Promise的特点

Promise对象有两个特点：

- 对象的状态不受外界影响。共有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。状态的改变只有两种可能：从pending到fulfilled和从pending到rejected。只要这两种情况发生，就会一直保持这个结果，称为resolved（已定形）。

有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免层层嵌套的回调函数，例如有一个异步读取文件的操作readFile，我们需要读完文件a，然后再读文件b，最后读文件c，这个过程可以写成：

```js
function read (filename) {
    return new Promise ((resolve, reject) => {
        readFile(filename, (data) => {
            resolve(data)
        })
    })
}

read('a')
    .then((data) => { // data = 'b'
    	return read(data)
	})
    .then((data) => { // data = 'c'
    	return read(data)
	})
```



### 基本用法

```js
const promise = new Promise(function (resolve, reject) {
    if (/* 异步操作成功 */) {
    	resolve(value)    
	} else {
    	reject(err)
	}
})
```

resolve函数的作用是将Promise对象的状态从pending变为resolved。reject函数的作用是将状态从pending变为rejected。Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数：

```js
promise.then(function(value) {
    // something to do with success
}, funciton(error) {
	// something to do with error             
})
```

其中第二个是处理错误相关的函数，是可选的，不一定要提供。

Promise新建后就会立即执行。因此，常用一个函数对Promise进行一层包装。

可以向resolve和reject函数传递参数，该参数会传递给回调函数。通常reject的参数是Error的实例。resolve函数也可以传另一个Promise实例：

```js
const p1 = new Promise((resolve, reject) => {
    
})
const p2 = new Promise((resolve, reject) => {
    resolve(p1)
})
```

此时p2的状态取决于p1的状态，如果p1状态为pending，p2的回调函数就会等待p1的状态改变；p1的状态一旦改变，p2的回调函数就会立刻执行。



### Promise.all()

all接收一个参数，该参数是一个数组，数组中存放一个个的promise对象

```js
const p1 = new Promise((resolve, reject) => { resolve() })
const p2 = new Promise((resolve, reject) => { resolve() })
const p3 = new Promise((resolve, reject) => { reject() })

Promise.all([p1, p2, p3])
    .then(res => console.log('resolve'))
	.catch(res => console.log('reject'))
// reject
```

当数组中所有promise的状态为fulfilled时，才会执行then，否则，有一个是rejected则会执行catch。

当我们需要利用多个异步请求的结果去决定后续操作的时候，promise.all就很有用了，例如：需要为用户推荐书籍，要异步请求用户信息，还要异步请求目前所有的书籍，当两个异步操作都成功，才会将信息呈现出来。



### Promise.race()

race也是接收一个promise对象数组，不同的是，它的状态取决于对象数组中优先改变的对象的状态。适合用在计时的时候，例如对象p1是用来发出请求的，对象p2是个计时器，在规定时间内p1的状态没有改变，就认为请求超时。



## Proxy

