---
title: ES6学习笔记
---

# ES6

资料

- [exploring es6](https://exploringjs.com/es6/)
- [阮一峰ES6入门](http://es6.ruanyifeng.com/#README)



## Set

- Set函数可以接受一个数组或者具有iterable接口的其他数据结构作为参数

```js
const set = new Set([1, 2, 3])
[...set]
// [1, 2, 3]

const set = new Set(document.querySelectorAll('div'))
```

- 数组去重、字符串去重

```js
[...new Set(array)]
[... new Set('ababbc')].join('')
```

- 向Set加入值的时候不会发生类型转换，所以5和"5"是不同的值。与精确相等运算符(===)不同的是，Set认为NaN等于自身，精确运算符认为NaN不等于自身。

```js
let set = new Set()
let a = NaN
let b = NaN
set.add(a)
set.add(b)
set // Set { NaN }
```

- 两个对象总是不相等

```js
let set = new Set()
set.add({})
set.add({})
set.size // 2
```

- Set实例的属性和方法
  - size
  - add(value)：返回Set结构本身，可以链式调用
  - delete(value)：返回布尔值
  - has(value)
  - clear()
  - keys()：结果与values()一样
  - values()
  - entries()
  - forEach(func)
- Array.from可以将Set结构转为数组

```js
const items = new Set([1, 2, 3, 4, 5])
const array = Array.from(items)
```

- 扩展运算符(...)内部使用for of循环，因此可以用于Set结构



## WeakSet

- 与Set的区别
  - 成员只能是对象
  - WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用
- WeakSet不可遍历

- 以下例子中，成为WeakSet实例对象成员的是变量a的成员，这意味着变量成员必须是对象

```js
// OK
const a = [[1, 2], [3, 4]]
const ws = new WeakSet(a)

// Error
const b = [3, 4]
const ws = new WeakSet(b)
```

- 方法：
  - 没有size属性，因为无法遍历
  - add(value)
  - delete(value)
  - has(value)
- 使用场景
  - 存储DOM节点，当这些节点从文档移除时，不会引发内存泄露
  - [使用场景](https://exploringjs.com/es6/ch_maps-sets.html#sec_weakset)
    - TL;DR：
      - 标记通过proxy工厂函数创建的对象
      - 保证实例的方法只能由相应的实例调用



## Map

- Map数据结构可以解决键名只能为字符串的问题

```js
// 键名会自动转为字符串
const data = {};
const element = document.getElementById('myDiv');

data[element] = 'metadata';
data['[object HTMLDivElement]'] // "metadata"

// 通过对象作为键获得值
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"
```

- 可以接受一个数组作为构造函数的参数

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

- 任何具有Iterator接口、且每个成员都是一个双元素的数组的数组结构都可以作为参数

```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

- 对相同键赋值，会覆盖之前对值
- 只有对同一个对象的引用，才视为同一个键（相同内存地址）

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

- 实例的属性和方法
  - size
  - set(key, value)：返回Map对象，可以采用链式调用
  - get(key)
  - has(key)
  - delete(key)
  - clear()
  - keys()
  - values()
  - entries()
  - forEach()
- Map的遍历顺序就是插入顺序
- 可以通过扩展运算符将Map快速转位数组
- Map本身没有map和filter方法，但是可以结合数组的map和filter方法进行过滤和遍历

```js
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```



## WeakMap

- WeakMap只接受对象作为键名（null除外）
- WeakMap键名指向的对象不计入垃圾回收机制
- WeakMap没有size属性和遍历操作
- 方法
  - get()
  - set()
  - has()
  - delete()
- [用途](https://exploringjs.com/es6/ch_maps-sets.html#sec_weakmap)
  - 缓存计算结果
  - 管理listeners
  - 保存私有数据



## Promise

- 传入resolve的参数可以是Promise类型，此时该Promise实例的状态取决于该参数。下面例子中，如果p1的状态为resolved，则p2的回调函数立刻执行；如果p1点状态为pending，则p2的状态也为pending

```js
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```

- then方法返回的是一个Promise实例，因此可以采用链式调用，如果前一个then中返回的是一个Promise类型，那么后一个回调函数就会等待该Promise对象状态变化再进行调用
- Promise对象的错误具有“冒泡”性质，链式调用的then中，其中一个出错，都会被最后的catch所捕获
- finally在ES2018中引入，不管Promise实例最后的状态是什么，都会执行，但是无法从finally中知道该实例的状态
- Promise.all接受一个数组作为参数（或者参数具有Iterator接口，并且每个返回的成员都是Promise实例），如果参数不是Promise实例就会先调用Promise.resolve进行转换
- 如果Promise.all中实例都fulfilled，实例的返回值就会组成一个数组传递给回调函数
- 如果作为参数的Promise实例，定义了自己的catch方法，那么它一旦被rejected，就不会出发Promise.all的catch方法

- Promise.resolve等价于以下写法

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

- Promise.resolve的参数可以是一个Promise、thenable对象、不是thenable对象或不是对象、不带任何参数



## async

- 返回Promise对象
- 内部的return语句会成为then方法回调函数的参数
- await后面是一个Promise对象并返回该对象的结果，否则直接返回对应的值（也可以是具有then方法的对象）
- 任何一个await语句后面的Promise对象变为reject状态，整个async函数都会中断执行，如果希望不会中断，要是用try、catch结构
- 如果await后面的异步操作出错，那么等同于async函数返回的Promise对象被reject
- async函数可以保留错误堆栈



## Iterator



## Symbol

- 基本类型，不能使用new
- 参数可以为字符串，相同参数的Symbol返回值不相同
- Symbol可以转布尔值，不能转数值
- ES2019提供description方法，直接返回Symbol描述
- Symbom作为对象属性名，不能用点运算符，因为点运算符后面总是字符串

```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```

- 在对象的内部，使用symbol值定义的属性要放在方括号内

```js
let s = Symbol();

let obj = {
  [s]: function (arg) { ... }
};
  
// 或
  
let obj = {
  [s](arg) { ... }
};


obj[s](123);
```

- 实例
  - 消除魔术字符串
- Symbol属性不会出现在for in、for of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回，可以通过Object.getOwnPropertySymbols获取。Reflect.ownKeys也可以访问Symbol的键名，包括常规键名。
- Symbol.for()可以接受一个字符串参数，搜索是否有一该参数为名的Symbol值，有则返回，无则新建并返回该Symbol对象。
- Symbol.keyFor(obj)返回一个已登记的Symbol对象的key
- 内置Symbol值：
  - Symbol.hasInstance
  - Symbol.isConcatSpreadable
  - Symbol.species
  - Symbol.match
  - Symbol.replace
  - Symbol.search
  - Symbol.search
  - Symbol.split
  - Symbol.iterator
  - Symbol.toPrimitive
  - Symbol.toStringTag
  - Symbol.unscopables