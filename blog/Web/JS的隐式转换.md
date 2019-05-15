---
title: 'JS的隐式转换'
---

## 基本类型的转换

字符串和数字相加，数字转成字符串。

```js
10 + '20' // '1020'
```

数字和字符串相减，字符串转成数字。如果字符串不是纯数字，就会转成NaN。

```js
10 - '20' // -10
10 - '100a' // NaN
```

乘、除、大于、小于的转换和减一样。

### 使用==比较

```js
undefined == null // true
```

字符串和数字比较，字符串转数字。

```js
'6' == 6 // true
```

数字和布尔值比较时，布尔值转数字。

```js
0 == false // true
1 == true // true
2 == true // false
```

字符串和布尔比较时，两者转数字。

```js
'0' == false // true
'1' == true // true
'2' == true // false
```

## 引用类型的转换

对象和数字比较时，先看对象的valueOf转换的是否是数字，是则用该数字比较，否则调用toString()得到字符串去比较。

```js
0 == [] // true, [].valueOf() -> [], [].toString() -> '', Number('') -> 0
```

对象和字符串比较时调用toString()

```js
'2' == ['2'] // true
```

分析以下 [] == ![]

```js
[].toString() -> ''
![] -> !Boolean([]) -> false
'' -> 0
false -> 0
```

## 显示转换

```js
Number([]) // 0
String([]) // ''
Boolean([]) // true
```

