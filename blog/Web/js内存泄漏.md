---
sidebar: auto
title: js内存泄漏
---

## 垃圾回收机制

### 原理

垃圾收集器会按照一定的时间间隔，周期性的找出不再继续使用的变量，然后释放其占用的内存。

### 标记清除

JS中最常用的垃圾收集方式。垃圾收集器在运行的时候给存储在内存中的所有变量都加上标记。然后去掉环境中的变量以及被环境中的变量引用的变量的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。

### 引用计数

当声明了一个变量并将一个引用类型值赋给该变量时，则这个值的引用次数就是1。如果同一个值又被赋给另一个变量，则该值的引用次数加1。当这个值引用次数为0时，其占用的内存空间将被回收。这样，下次垃圾收集器运行时，就会释放引用次数为0的值所占用的内存。这种垃圾回收机制会因为循环引用而致使内存泄漏：

```js
var element = document.getElementById('some_element')
var myObject = new Object()
myObject.element = element
element.someObject = myObject
```

这个例子中，element的属性指向myObject，myObject的属性指向element，从而导致循环引用，IE9以下的浏览器的Dom和Bom对象是COM形式实现的，COM对象的垃圾收集机制就是引用计数，循环引用使得该Dom元素element不会被回收，即便该Dom元素从页面中移除。幸运的是，现在的浏览器大多都使用标记清除，IE也修复了这个问题。

## 内存泄漏的情况

### 意外的全局变量

全局变量是不会被当成垃圾回收的：

```js
function foo() {
    this.bar = 'bar'
    bar2 = 'bar2'
}
foo()
```

上述例子中，直接调用foo，那么this的指向就是window，因此bar和bar2都会被当做window的属性，成为全局变量。可以使用严格模式解决这个问题，因为严格模式下，直接调用函数的this是undefined。

### 被遗忘的定时器

```js
var someResources = getData()
setInterval(function() {
    var node = document.getElementById('Node')
    if (node) {
        node.innerHTML = JSON.stringify(someResources)
    }
}, 1000)
```

我们知道，要清除定时器，就要用一个变量去记载它，如var timer = setInterval(...)，上面代码无法清除定时器，并且定时器中使用了someResources这个变量，如果上述代码是在一个函数体中，因为闭包的关系，someResources是得不到释放的，如果someResources内存很大，后果是不堪设想的。

### 闭包

```js
function test () {
    var button1 = document.querySelector("#button")
    button1.onclick = function () {
        console.log(button1)
    }
}
test()
```

上述代码中，button1的onclick属性是个函数，这个闭包保留了对button1的引用，即使conslo.log的内容不是button1。这就导致了button1的泄漏。通过下面的方法解决

```js
function hello () {
    console.log(button1)
}
function test () {
    var button1 = document.querySelector("#button")
    button1.onclick = hello
}
test()
```

这个时候点击button，就会报错了。



### 超出DOM引用

```js
var element = {
    button: document.getElementById('button')
}
document.body.removeChild(document.getElementById('button'));
```

上述代码中，element的属性引用了一个dom元素，这个时候remove掉该dom元素，也依然能够访问到element中的dom元素，因此引起泄漏。还有一种情况是，使用了一个对象保留一个td节点，然后你remove掉了该td节点的父节点table，这个时候整个table仍然在内存中，因为td是table的子节点，它保留着对父节点的引用。