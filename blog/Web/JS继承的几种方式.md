---
title: 'JS继承的几种方式'
---

## 原型链继承

```js
function Animal(color) {
	this.species = 'animal'
	this.color = color
	this.type = []
}

function Dog() {
	this.name = 'dog'
}

Dog.prototype = new Animal('white')

var dog = new Dog()
console.log(dog.name);

// 引用缺陷
dog.type.push('dog')
var dog2 = new Dog()
console.log(dog2.type);

// 无法为不同实例初始化继承属性
console.log(dog.color);
console.log(dog2.color); 
```

该继承的有两个缺点：引用缺陷和无法为不同的实例初始化继承来的属性。

- 引用缺陷是指，如果父类中的属性是引用类型的，子类继承了这个属性，则对一个子类实例更改了该引用类型，会影响其他子类实例，上述例子中，对dog实例更改了type引用属性，也影响了dog2实例中type的结果；

- 无法为不同实例初始化继承成来的属性体现在为所有的Dog实例的color都只能为white。



## 借用构造函数继承（经典继承）

构造函数继承方式可以避免类式继承的缺陷。但是无法共享父类方法。下面代码输出中，dog和dog2的color和type都不一样，但是父类的hello方法无法调用。每次创建对象都会创建一遍方法。并且无法使用instanceof判断。

```js
function Animal(color) {
	this.color = color
	this.type = []
}

Animal.prototype.hello = function() {
	console.log('hello');
}

function Dog(color) {
	Animal.apply(this, arguments)
}

var dog = new Dog('white')
dog.type.push('dog')

var dog2 = new Dog('black')
dog2.type.push('dog2')

console.log(dog.color);
console.log(dog.type);
console.log(dog2.color);
console.log(dog2.type);
dog.hello() //报错
```



## 组合继承

组合继承就是结合类式继承和构造函数继承的优点。缺点是会调用两次父构造函数，导致下面Dog.prototype中有color属性，dog中也有color属性。

```js
function Animal(color) {
	this.color = color
	this.type = []
}

Animal.prototype.hello = function() {
	console.log('hello');
}

function Dog(color) {
	Animal.apply(this, arguments)
}

Dog.prototype = new Animal()

var dog = new Dog('white')
dog.type.push('dog')

var dog2 = new Dog('black')
dog2.type.push('dog2')

console.log(dog.color);
console.log(dog.type);
console.log(dog2.color);
console.log(dog2.type);
dog.hello()
```



## 寄生组合式继承

```js
function Parent (name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
 
Parent.prototype.getName = function () {
  console.log(this.name)
}
 
function Child (name, age) {
  Parent.call(this, name);
  this.age = age;
}
// 关键的三步
var F = function () {};
 
F.prototype = Parent.prototype;
 
Child.prototype = new F();
 
 
var child1 = new Child('kevin', '18');
 
console.log(child1);
```

关键的三步保证了原型链的同时，消去了new Parent()带来的多余的属性。