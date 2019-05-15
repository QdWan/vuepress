---
title: 'JS数组遍历和性能比较'
---

## 数组遍历方法

### 普通for循环

```js
for (let i=0; i<arr.length; i++)
```

### 缓存数组长度的for循环

```js
for (let i=0, len=arr.length; i<len; i++)
```

### 使用变量本身作为判断的for循环

```js
for (let i=0; arr[i]!=null; i++)
```

### forEach循环

```js
arr.forEach(function(item, index) {})
```

### 变种forEach循环

```js
Array.prototype.forEach.call(arr, function(el){})
```

### for in循环

```js
for (item in arr) {}
```

### map循环

```js
arr.map(function(item) {})
```

### for of循环

```js
for (let item of arr) {}
```

## 性能对比

第一梯队：普通for循环 > forEach循环 

第二梯队：forEach循环、for of循环

第三梯队：for in循环、map循环