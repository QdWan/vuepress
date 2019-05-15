---
sidebar: auto
title: this的指向
---

## 直接调用函数

```js
function fn() {
    console.log(this)
}
fn() // 全局对象
```

console.log输出的内容是全局对象，fn()可以理解为window.fn()，在浏览器环境下则是window对象。



## 对象函数调用

谁调用函数，this则指向谁

```js
let obj = {
    a: 111,
    fn: function () {
        console.log(this.a)
    }
}
obj.fn() // 111

let obj2 = {
    a: 222
}
obj2.fn = obj.fn
obj2.fn() // 222
```



## 构造函数调用

```js
let Student = function () {
    this.name = 'lim'
}
let student = new Student()
console.log(student.name) // lim
student.name = 'zhong'
console.log(student.name) // zhong
```

之前笔记记载过new到底做了些什么，其实就是3件事：创建一个空对象，将空对象的\_\_proto\_\_属性指向构造函数的prototype，已该空对象为上下文调用构造函数。因此该例子中的student其实就是new过程中的空对象，因此有一个name的属性。



## apply、call、bind

apply、call、bind都可以用来改变一个函数的this指向，区别在于，apply和call的第二个参数形式上有些不一样，apply的第二个参数是个数组，call则是一个参数列表；而bind可以永久绑定一个函数的上下文。多次bind只有第一个生效。



## 箭头函数

箭头函数中的this是固定的

```js
function foo () {
	setTimeout(function () {
		console.log(this.id)
	}, 1000)
}

var id = 12
foo.call({id: 24}) // 12

function foo () {
	setTimeout(() => {
		console.log(this.id)
	}, 1000)
}

var id = 12
foo.call({id: 24}) // 24
```

上述例子运行在浏览器console中。第一个例子中，setTimeout的回调函数是普通函数，但是console.log出来的结果是12，这是因为发生回调函数的时候，原本的执行上下文已经不存在了。而第二个例子中，回调函数使用了箭头函数，foo是通过对象{id: 24}调用的，因此函数中的this指向该对象，箭头函数的特点在于，它的this是继承自外面环境的，它本身是没有this的。这有什么好处呢？看下面例子：

```js
var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
}
```

上面例子中，init方法执行一个事件绑定，采用了箭头函数。考虑一下这样一个场景：当我通过handler调用init的时候，init中箭头函数的this就指向handler对象了，如果不采用箭头函数会发生什么呢？那就是当我们点击绑定了click事件的dom元素时会报错，为什么呢？因为这是个回调函数，和上面例子中一样，不使用箭头函数的话，回调函数执行的时候，原来的上下文已经不在了，this指向了window，而window中没有doSomething这个方法，因此会报错。使用箭头函数，this始终指向handler对象，因此当回调函数发生时，是会调用handler中的doSomething的。

箭头函数转成ES5的代码如下：

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
```

从这里看出，箭头函数的this就是定义时的this。正因为this中本身没有this，因此下面代码中只有一个this：

```js
function foo() {
  return () => {
    return () => {
      return () => {
        console.log('id:', this.id);
      };
    };
  };
}

var f = foo.call({id: 1});
```

箭头函数也有一些不适用的场合：

定义函数的方法，且该方法内部包括this：

```js
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  }
}
```

当调用cat.jumps()时，this的指向是全局对象，并非cat。

第二个场合是需要动态this的时候，也不应使用箭头函数。

```js
var button = document.getElementById('press');
button.addEventListener('click', () => {
  this.classList.toggle('on');
});
```

这里的this也是指向全局对象。