---
sidebar: auto
---

# TypeScript Handbook笔记

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



## Variable Declarations

### `let` declaration

`catch`语句括号中的变量拥有块级作用域。

```js
try {
    throw "oh no!";
}
catch (e) {
    console.log("Oh well.");
}

// Error: 'e' doesn't exist here
console.log(e);
```

函数中`let`声明不可和参数名一致（暂时性死区表现），但是函数内的诸如`if`块可以声明。

```js
// 示例一
function f(x) {
    let x = 100; // error: interferes with parameter declaration
}

// 示例二
function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0); // returns '0'
f(true, 0);  // returns '100'
```

### Destructuring

数组解构赋值可以忽略其中一些元素。

```js
let [, second, , fourth] = [1, 2, 3, 4];
console.log(second); // outputs 2
console.log(fourth); // outputs 4
```

对象解构赋值：

```js
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;
```



## Interface

### Readonly properites

`ReadonlyArray<T>`类型的数组，无法调用变更式的方法，并且`ReadonlyArray`无法转换为`Array`：

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

如果希望从`ReadonlyArray`转成`Array`，可以使用类型断言：

```js
a = ro as number[];
```

`readonly`和`const`的区别就是，前者作用于属性，后者作用于变量。

### Function Types

函数类型接口和函数定义的参数名可以不一致：

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
```

### Indexable Types

`number`索引签名返回类型，必须是`string`索引签名返回类型的子类型，因为使用`number`索引时，JS会将其转换成`string`，即：`a[100] -> a["100"]`，所以两者必须相容：

```ts
// 示例一
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}

// 示例二
interface NumberDictionary {
    [index: string]: number;
    length: number;    // ok, length is a number
    name: string;      // error, the type of 'name' is not a subtype of the indexer
}
```

如果希望签名索引返回类型包含不同类型的话，可以借助联合类型：

```js
interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number;    // ok, length is a number
    name: string;      // ok, name is a string
}
```

### Class Type

```js
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

如果接口中具有构造函数签名，并且一个类实现了这个接口，会出现报错，因为只有类的实例会被检查，而构造函数属于静态方法，不会被检查：

```js
// 出现报错
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

有以下两种方法可以解决上述问题：

```js
// 方式一
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick(): void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

// 方式二
interface ClockConstructor {
  new (hour: number, minute: number);
}

interface ClockInterface {
  tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
      console.log("beep beep");
  }
}
```

### Extending Interfaces

一个接口可以扩展多个接口：

```js
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

### Hybrid Types

接口中的属性可以混合函数类型和对象类型：

```js
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = (function (start: number) { }) as Counter;
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### Interfaces Extending Classes

接口可以扩展类，扩展类的同时会继承类的`private`和`protected`属性，如果类中有这两个属性，并且接口扩展了该类，这意味着这个接口只能由这个类及其子类去实现：

```js
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// Error: Property 'state' is missing in type 'Image'.
class Image implements SelectableControl {
    private state: any;
    select() { }
}

class Location {

}
```

