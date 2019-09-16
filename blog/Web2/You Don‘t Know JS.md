# You Don‘t Know JS

## 类型

### 基本类型：

- undefined
- null
- boolean
- number
- string
- object
- symbol

```js
typeof undefined === 'undefined'
typeof null === 'object'
typeof true === 'boolean'
typeof 1 === 'number'
typeof 'a' === 'string'
typeof {} === 'object'
typeof Symbol(1) === 'symbol'

// 检测null类型要使用符合条件
var a = null;
(!a && typeof a === 'object') // true
```

### 内置类型：

除了上述的基本类型外，还有：

- Function
- Array

Function和Array都可以看作Object的子类型

```js
function A(a, b) {}

// 获取函数A的形参个数
A.length // 2

typeof A === 'function'
typeof [] === 'object'

// 判断数组类型
Array.isArray([]) // true
[] instanceof Array // true
[].constructor === Array // true
Object.prototype.toString.call([]) // '[object Array]'
```

typeof对于未声明和未定义的变量同样返回undefined：

```js
var a;
a; // undefined
b; // ReferenceError

typeof a; // undefined
typeof b; // undefined
```

### 数组

如果使用索引为数组赋值，并且索引无法强制转换为十进制数字，那么这些元素不会计算在数组长度内：

```js
var a = []
a['0'] = 0
a.length = 1
a['asd'] = 'asd'
a.length = 1
```

类数组的转换：

```js
Array.prototype.slice.call(obj);
Array.from(obj)
```

### 字符串

可以对字符串使用一些数组的方法：

```js
Array.prototype.join.call('123', '-') // "1-2-3"
Array.prototype.map.call('123', (v) => { return v.toUpperCase() + '.'}).join('') // "1.2.3."

// 反转字符串
var a = '123';
Array.from(a).reverse().join('');
```

### 数字

```js
toExponential()
toFixed()        // 指定小数点后位数
toPrecision()    // 指定有效位数
isInteger()      // 检测整数
isSafeInteger()  // 检测安全的整数 -2^53 ~ 2^53

// 通过 Number.EPSILON 比较 0.1 + 0.2 = 0.3
var a = 0.1 + 0.2;
var b = 0.3;
Math.abs(a - b) < Number.EPSILON; // true
```

### undefined和null

- undefined表示未赋值
- null表示没有值

```js
// 使用void的好处可以避免undfined被赋值，非严格模式下undefined被赋值并不会报错
void 0 === undefined // true
```

### NaN

```js
typeof NaN === 'number'

NaN === NaN // false
NaN !== NaN // true

// 通过Number.isNaN()判断变量是否为NaN
var b = '123'
Number.isNaN(b) // false
```



## Promise

注意调用顺序。

```js
var p1 = new Promise(resovle => resovle(1))
var p2 = new Promise(resovle => resovle(p1))
var p3 = new Promise(resolve => resolve(2))
p2.then(res => console.log(res))
p3.then(res => console.log(res))
// 2 1
```

如果向Promise.resolve传递一个非Promise、非thenable的值，就会得到一个用这个值填充的Promise：

```js
// 以下两个语句行为一致
var p1 = new Promise((resolve, reject) => {
  resolve(42)
})
var p2 = Promise.resolve(42)
```

如果向Promise.resolve传递一个Promise值，就会返回一个相同的Promise：

```js
var p1 = Promise.resolve(1);
var p2 = Promise.resolve(p1);
p1 === p2; // true
```

对于返回值不确定是否是Promise的函数，要使用Promise.resolve对其进行一层封装：

```js
// no
foo(42).then((v) => console.log(v));

// yes
Promise.resolve(foo(42)).then((v) => console.log(v));
```

