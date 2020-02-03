---
sidebar: auto
---

# Handbook

## Basic Types

### Boolean

```js
let isDone: boolean = false;
```

### Number

在TS中，所有数字都是浮点型。支持16进制、10进制、8进制、2进制。

```js
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

### String

```js
let color: string = "blue";
```

### Array

```js
// 方式一
let list: number[] = [1, 2, 3];

// 方式二
let list: Array<number> = [1, 2, 3];
```

### Tuple

元组中初始化需要和定义具有一致的类型顺序。

```js
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ["hello", 10]; // OK

// Initialize it incorrectly
x = [10, "hello"]; // Error
```

获取指定元素，其类型是确定的。

```js
console.log(x[0].substring(1)); // OK
console.log(x[1].substring(1)); // Error, 'number' does not have 'substring'
```

超出元组范围会报错。

```js
x[3] = "world"; // Error, Property '3' does not exist on type '[string, number]'.

console.log(x[5].toString()); // Error, Property '5' does not exist on type '[string, number]'
```

### Enum

```js
enum Color {Red, Green, Blue}
let c: Color = Color.Green
```

枚举类型默认从`0`开始。也可以设置从别的值开始，例如从`1`开始：

```js
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

也可以设置每个枚举元素对应的值：

```js
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

枚举的其中一个特性是可以通过下标访问枚举元素对应的名字：

```js
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName); // Displays 'Green' as its value is 2 above
```

### Any

`any`类型可以用于一些无法确定的变量，例如用户输入、第三方库。

```js
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

`any`类型允许开发者渐进式地从js迁移到ts。

`Object`类型允许赋予任何值，但是无法调用其方法：

```js
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

如果变量为数组，但是其元素类型不一致，也可以使用`any`：

```js
let list: any[] = [1, true, "free"];

list[1] = 100;
```

### Void

`void`最常见于没有返回值的函数：

```js
function warnUser(): void {
    console.log("This is my warning message");
}
```

如果一个变量类型为`void`，只能赋予其`null`或者`undefined`，并且没有指定`--strictNullChecks`，否则会出现报错。

```js
let unusable: void = undefined;
unusable = null; // OK if `--strictNullChecks` is not given
```

### Null and Undefined

```js
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

在TS中，`undefined`和`null`是两种类型。默认情况下，`null`和`undefined`是其他类型的子类型，意味着你可以为别的类型赋值`null`或`undefined`。

如果开启了`--strictNullChecks`，`null`和`undefined`只可以赋值给其类型本身和`any`类型。如果一个变量可能为`string`、`null`、`undefined`，可以使用联合类型`string | null | undefined`。

### Never

`never`主要用于抛出或返回错误的函数。

`never`是任何可赋值类型的子类型，但是任何可赋值类型的类型都不是`never`的子类型。

```js
// Function returning never must have unreachable end point
function error(message: string): never {
    throw new Error(message);
}

// Inferred return type is never
function fail() {
    return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {
    }
}
```

`never`也可以用于做一些详细的类型检查。示例请见[Typescript中never的作用](https://www.zhihu.com/question/354601204)。

### Object

`object`类型用于表示非原始类型，即不是`number`、`string`、`boolean`、`bigint`、`symbol`、`null`、`undefined`。

使用`object`类型，可以更好地表示一些类似`Object.create`类型的API，例如：

```js
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

### Type assertions

```js
// 方式一
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 方式二
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

如果使用JSX，那么需要使用方式二。