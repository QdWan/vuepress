---
sidebar: auto
title: 'TypeScript Handbook笔记'
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



## Classes

### EMAScript Private Fields

在TS 3.8中，`private`支持新的语法`#`：

```ts
class Animal {
    #name: string;
    constructor(theName: string) { this.#name = theName; }
}

new Animal("Cat").#name; // Property '#name' is not accessible outside class 'Animal' because it has a private identifier.
```

### Understanding TypeScript's `private`

在TS中，类A和类B如果结构上一致，即有相同的属性方法，则认为两者是相容的。但是如果属性为`private`或`protected`，并且类A和类B不是父子关系，那么两者就是不相容的了：

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
```

### Understanding `protected`

构造函数也可以是`protected`，这意味着该类无法被外部实例化，但是继承它的子类可以通过`super()`调用：

```ts
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee can extend Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // Error: The 'Person' constructor is protected
```

### Readonly modifier

类中构造函数参数也可以被`readonly`修饰，意味着该类包含该参数名的属性：

```ts
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(public readonly name: string) {
    }
}

const octopus = new Octopus("octopus");
console.log(octopus.name) // "octopus"
```

### Accessors

通过`get`、`set`，可以做一些拦截功能：

```ts
const fullNameMaxLength = 10;

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (newName && newName.length > fullNameMaxLength) {
            throw new Error("fullName has a max length of " + fullNameMaxLength);
        }
        
        this._fullName = newName;
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

注意事项：

- 使用accessors需要设置编译器输出ECMAScript5以上版本。
- 如果只有`get`没有`set`，则默认为`readonly`。

### Static Properties

通过`Classname.propertyname`的格式来调用：

```ts
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

### Abstract Classes

抽象类不可被实例化，但是其方法可能已包含实现细节。`abstract`关键字可以用于定义类以及类的方法：

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```

抽象方法不包含实现细节，其子类必须实现这些抽象方法。

### Advanced Techniques

可以将类直接赋给变量，该变量可以直接调用类的静态属性：

```ts
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet()); // "Hello, there"

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet()); // "Hey there!"
```

接口可以实现类：

```ts
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```



## Functions

函数类型中的参数可以标注名字，类型中的参数名字只是为了增强可读性，函数具体的实现中，参数名可以与类型中参数名不一致：

```ts
let myAdd: (baseValue: number, increment: number) => number =
    function(x: number, y: number): number { return x + y; };
```

默认参数和可选参数不同，可选参数必须放到参数列表最后。

### `this`parameters

函数类型的第一个参数可以指定函数中`this`的类型，这并不是一个真实的参数，只是提供给TS作类型检查：

```ts
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

### Overloads

函数重载可以有效利用TS的类型检查。



## Generics

泛型函数有两种调用方法：

```ts
function identity<T>(arg: T): T {
    return arg;
}

// 方法一：指明类型
let output = identity<string>("myString");  // type of output will be 'string'

// 方法二：类型推断
let output = identity("myString");  // type of output will be 'string'
```

### Generic Types

```ts
// 放到接口函数中
interface GenericIdentityFn {
    <T>(arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn = identity;

// 放到接口中
interface GenericIdentityFn<T> {
    (arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn<number> = identity;
```

### Generic Classes

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

需要注意类中的静态成员无法使用泛型标注。

### Generic Constraints

有时候需要使用泛型约束，限定类型具有的属性特点，看下面例子：

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

我们确定传入的类型一定会有`length`属性，但是TS并不知道，这里就会出现错误提示。因此，需要使用`extends`来指明该类型是具有`length`属性的：

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

可以定义另一个类型参数，以此来确保代码中获取的属性都是存在于对象中的：

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

在类的构造函数(静态成员)中引入泛型：

```ts
function create<T>(c: {new(): T; }): T {
    return new c();
}


// 具备继承关系
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```



## Enums

### Numeric enums

数值型枚举类型可以制定从哪个数开始递增：

```ts
enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}
```

如果枚举元素是混合类型的，那么没有显示初始化的元素必须在前面或者紧跟数值型元素：

```ts
enum E {
    A = getSomeValue(),
    B, // Error! Enum member must have initializer.
}
```

### String enums

字符串类型的枚举元素必须显式初始化：

```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

### Computed and constant members

满足以下任一条件的枚举成员属于常量：

- 作为枚举类型的第一个成员，并且没有显式初始化：

```ts
// E.X is constant:
enum E { X }
```

- 没有显示初始化，并且前一元素属于数值型常量：

```ts
// All enum members in 'E1' and 'E2' are constant.

enum E1 { X, Y, Z }

enum E2 {
    A = 1, B, C
}
```

- 使用常量枚举表达式初始化的成员，以下属于枚举常量表达式：
  - 字符串或数值枚举表达式
  - 引用事先定义的常量枚举成员
  - 使用`+`、`-`、`～`任一元运算符的常量表达式
  - 使用`+`、`-`、`*`、`/`、`%`、`<<`、`>>`、`>>>`、`&`、`｜`、`^`任意二元运算符的常量表达式

其余都是计算型枚举类

```ts
enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
```

### Enums at runtime

枚举类型存在于运行时：

```ts
enum E {
    X, Y, Z
}

function f(obj: { X: number }) {
    return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
f(E);
```

### Enums at compile time

```ts
enum LogLevel {
    ERROR, WARN, INFO, DEBUG
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
    const num = LogLevel[key];
    if (num <= LogLevel.WARN) {
       console.log('Log level key is: ', key);
       console.log('Log level value is: ', num);
       console.log('Log level message is: ', message);
    }
}
printImportant('ERROR', 'This is a message');
```

### Reverse mappings

```ts
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"

// ===> 编译

var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

### `const` enums

`const`类型的枚举变量和普通枚举变量不同，它将会在编译期间转换成真实的数字：

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]

// ===> 编译
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

### Ambient enums

`ambient`枚举变量和非`ambient`枚举变量区别在于，`ambiemt`枚举变量成员如果没有显式初始化，则始终会被认为是计算型，而非常量型。

[参考阅读](https://stackoverflow.com/questions/28818849/how-do-the-different-enum-variants-work-in-typescript)

## Type Inference

## Type Compatibility

typescript中类型兼容是基于结构化类型，即考虑两者的类型是否一致，如下面例子所示，相同结构的接口和类型是兼容的：

```ts
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// OK, because of structural typing
p = new Person();
```

### Starting out

在ts中，如果y满足和x一样的结构，那么y就可以赋值给x，即使y中有多余的成员：

```ts
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y;
```

### Comparing two functions

ts中比较函数时仅比较参数列表，不会比较函数名：

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

示例中，x中的每个参数，在y中都有类型与之相对的参数，因此x可以赋值给y，反之不行。之所以允许忽视掉一些参数，是因为在JS中，这种忽视部分参数的写法非常常见，例如`Array#forEach`，它接受的回调函数可以传入3个参数，而常常我们只会传入一个参数：

```ts
let items = [1, 2, 3];

// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach(item => console.log(item));
```

#### Function Parameter Bivariance

#### Optional Parameters and Rest Parameters

#### Functions with overloads

### Classes

比较类的对象时，只会比较类对象的非成员，静态成员和构造函数不会进行比较。

```ts
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let s: Size;

a = s;  // OK
s = a;  // OK
```

#### Private and protected members in classes

如果类a中有`private`类型的成员，那么类b必须也有相对应的`private`成员，而且需要继承自相同的父类，两者才能相容，对于`protected`也是如此。

### Generics

```ts
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // OK, because y matches structure of x

interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // Error, because x and y are not compatible
```

对于泛型，如果没有指定其类型参数，则会认为是`any`：

```ts
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // OK, because (x: any) => any matches (y: any) => any
```

## Advanced Types

### Intersection Types

交叉类型经常用于mixins等概念：

```ts
function extend<First, Second>(first: First, second: Second): First & Second {
    const result: Partial<First & Second> = {};
    for (const prop in first) {
        if (first.hasOwnProperty(prop)) {
            (result as First)[prop] = first[prop];
        }
    }
    for (const prop in second) {
        if (second.hasOwnProperty(prop)) {
            (result as Second)[prop] = second[prop];
        }
    }
    return result as First & Second;
}

class Person {
    constructor(public name: string) { }
}

interface Loggable {
    log(name: string): void;
}

class ConsoleLogger implements Loggable {
    log(name) {
        console.log(`Hello, I'm ${name}.`);
    }
}

const jim = extend(new Person('Jim'), ConsoleLogger.prototype);
jim.log(jim.name);
```

### Union Types

联合类型只能引用多个类型共有的成员：

```ts
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim();    // errors
```

### Type Guards and Differentiaing Types

### User-Defined Type Guards

#### Using type predicates

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly()
}
```

`pet is Fish`就是type predicate。调用`isFish`时，typescript会缩小变量类型范围，推断出pet是Fish类型还是Bird类型。

#### Using the in operator

使用`n in x`表达式同样可以缩小类型范围：

```ts
function move(pet: Fish | Bird) {
  if ("swim" in pet) {
    return pet.swim();
  }
  return pet.fly();
}
```

### typeof type guards

```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

### instanceof type guards

```ts
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5
    ? new SpaceRepeatingPadder(4)
    : new StringPadder("  ");
}

// Type is 'SpaceRepeatingPadder | StringPadder'
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
  padder; // type narrowed to 'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
  padder; // type narrowed to 'StringPadder'
}
```

### Nullable types

### Optional parameters and properties

开启了`--strictNullChecks`之后可选参数自动添加`|undefined`：

```ts
function f(x: number, y?: number) {
  return x + (y || 0);
}
f(1, 2);
f(1);
f(1, undefined);
f(1, null); // error, 'null' is not assignable to 'number | undefined'
```

对于类中可选属性也是一样：

```ts
class C {
  a: number;
  b?: number;
}
let c = new C();
c.a = 12;
c.a = undefined; // error, 'undefined' is not assignable to 'number'
c.b = 13;
c.b = undefined; // ok
c.b = null; // error, 'null' is not assignable to 'number | undefined'
```

### Type guards and type assertions

移除`null`的类型守护示例：

```ts
function f(sn: string | null): string {
  if (sn == null) {
    return "default";
  } else {
    return sn;
  }
}

// 简化
function f(sn: string | null): string {
  return sn || "default";
}
```

当编译器无法消除`null`或者`undefined`时，例如一些嵌套函数，可以使用类型断言运算符进行手动移除：

```ts
function broken(name: string | null): string {
  function postfix(epithet: string) {
    return name.charAt(0) + ".  the " + epithet; // error, 'name' is possibly null
  }
  name = name || "Bob";
  return postfix("great");
}

function fixed(name: string | null): string {
  function postfix(epithet: string) {
    return name!.charAt(0) + ".  the " + epithet; // ok
  }
  name = name || "Bob";
  return postfix("great");
}
```

### Type Aliases

类型别名可以为一种类型（如：基本类型、联合类型等）创建一个别名：

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

和接口一样，类型别名可以为泛型：

```ts
type Container<T> = { value: T };

//
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};
type LinkedList<T> = T & { next: LinkedList<T> };

//
interface Person {
  name: string;
}
var people: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;
```

### Interfaces vs. Type Aliases

和接口相比，类型别名不会创建一个新的名字。

在高于2.7版本中，类型别名允许扩展创建一个新的交集类型，如：`type Cat = Animal & { purrs: true }`。

### String Literal Types

### Numeric Literal Types

### Enum Member Types

### Discriminated Unions

- 拥有共通属性
- 将多个类型联合起来的类型别名
- 基于共通属性

```ts
// #1
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

// #2
type Shape = Square | Rectangle | Circle;

// #3
function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

### Exhaustiveness checking

有时候希望编译器告诉开发者没有考虑到覆盖所有类型的错误：

```ts
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}
function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
    default:
      return assertNever(s); // error here if there are missing cases
  }
}
```

### Polymorphic this types

```ts
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}

class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin() {
    this.value = Math.sin(this.value);
    return this;
  }
  // ... other operations go here ...
}

let v = new ScientificCalculator(2)
  .multiply(5)
  .sin()
  .add(1)
  .currentValue();
```

### Index types

使用索引类型可以让编译器检查使用动态属性名的代码，例如：

```ts
function pluck(o, propertyNames) {
  return propertyNames.map(n => o[n]);
}
```

我们希望能够检测传入propertyNames的属性是否存在于对象o中:

```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map(n => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}
let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014
};

// Manufacturer and model are both of type string,
// so we can pluck them both into a typed string array
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// If we try to pluck model and year, we get an
// array of a union type: (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);
```

上述例子中使用了索引类型查询运算符`keyof`，`keyof T`将会获得`T`中属性构成的联合类型，例如：

```ts
let carProps: keyof Car; // the union of ('manufacturer' | 'model' | 'year')
```

### Index types and index signatures

索引签名的参数类型必须是number或string类型。如果索引签名的索引为string类型，那么`keyof T`的结果是`string | number`，如果索引为number类型，那么`keyof T`的结果为`number`。

```ts
interface Dictionary<T> {
  [key: string]: T;
}
let keys: keyof Dictionary<number>; // string | number
let value: Dictionary<number>["foo"]; // number
```

```ts
interface Dictionary<T> {
  [key: number]: T;
}
let keys: keyof Dictionary<number>; // number
let value: Dictionary<number>["foo"]; // Error, Property 'foo' does not exist on type 'Dictionary<number>'.
let value: Dictionary<number>[42]; // number
```

### Mapped types

TS可以通过映射类型的方式基于旧的类型创建一个新的类型：

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type Partial<T> = {
  [P in keyof T]?: T[P];
};
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

需要注意这是创建一个新的类型，而不是一个成员，如果要新增一个成员：

```ts
// Use this:
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }

// **Do not** use the following!
// This is an error!
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean;
}
```

#### Inference from mapped types

```ts
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}

let originalProps = unproxify(proxyProps);
```

### Conditional Types

```ts
T extends U ? X : Y

declare function f<T extends boolean>(x: T): T extends true ? string : number;
// Type is 'string | number'
let x = f(Math.random() < 0.5);
```

如果传入条件类型的泛型参数类型同样为泛型，那么无法确知推断出其类型：

```ts
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
  // Has type 'U extends Foo ? string : number'
  let a = f(x);

  // This assignment is allowed though!
  let b: string | number = a;
}
```

因为无法确切得知x的类型，那么f的执行结果可能为string或number。

### Distributive conditional types

如果传入给`T extends U ? X : Y`的参数类型是`A | B | C`，那么推断的结果则是：`(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`。

分布条件类型常常用于过滤：

```ts
type Diff<T, U> = T extends U ? never : T; // Remove types from T that are assignable to U
type Filter<T, U> = T extends U ? T : never; // Remove types from T that are not assignable to U

type T30 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "b" | "d"
type T31 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"
type T32 = Diff<string | number | (() => void), Function>; // string | number
type T33 = Filter<string | number | (() => void), Function>; // () => void

type NonNullable<T> = Diff<T, null | undefined>; // Remove null and undefined from T

type T34 = NonNullable<string | number | undefined>; // string | number
type T35 = NonNullable<string | string[] | null | undefined>; // string | string[]

function f1<T>(x: T, y: NonNullable<T>) {
  x = y; // Ok
  y = x; // Error
}

function f2<T extends string | undefined>(x: T, y: NonNullable<T>) {
  x = y; // Ok
  y = x; // Error
  let s1: string = x; // Error
  let s2: string = y; // Ok
}
```

条件类型和映射类型可以结合在一起使用：

```ts
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type T40 = FunctionPropertyNames<Part>; // "updatePart"
type T41 = NonFunctionPropertyNames<Part>; // "id" | "name" | "subparts"
type T42 = FunctionProperties<Part>; // { updatePart(newName: string): void }
type T43 = NonFunctionProperties<Part>; // { id: number, name: string, subparts: Part[] }
```

### Types inference in conditional types

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

```ts
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type T0 = Unpacked<string>; // string
type T1 = Unpacked<string[]>; // string
type T2 = Unpacked<() => string>; // string
type T3 = Unpacked<Promise<string>>; // string
type T4 = Unpacked<Promise<string>[]>; // Promise<string>
type T5 = Unpacked<Unpacked<Promise<string>[]>>; // string
```

对不同变量的对象推断得到联合类型

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T10 = Foo<{ a: string; b: string }>; // string
type T11 = Foo<{ a: string; b: number }>; // string | number
```

对不同变量的对象推断得到相交类型

```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;
type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>; // string & number
```

函数重载时作用于最后一个函数签名

```ts
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;
type T30 = ReturnType<typeof foo>; // string | number
```

`infer`不能用于类型参数

```ts
type ReturnType<T extends (...args: any[]) => infer R> = R; // Error, not supported
```

但可以通过下面方法实现相同效果

```ts
type AnyFunction = (...args: any[]) => any;
type ReturnType<T extends AnyFunction> = T extends (...args: any[]) => infer R
  ? R
  : any;
```

### Predefined conditional types

- `Exclude<T, U>` -- 从`T`中剔除可以赋值给`U`的类型。
- `Extract<T, U>` -- 提取`T`中可以赋值给`U`的类型。
- `NonNullable` -- 从`T`中剔除`null`和`undefined`。
- `ReturnType` -- 获取函数返回值类型。
- `InstanceType` -- 获取构造函数类型的实例类型。

```ts
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"
type T04 = NonNullable<string | number | undefined>;  // string | number
type T10 = ReturnType<() => string>;  // string
type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // any
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error
```

##Declaring Merging

### Merging Interfaces

```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

接口中的非函数成员必须唯一，如果不唯一也必须对应类型一致。

接口中存在相同名称的函数成员时就会形成重载，并且靠后声明的具有较高的优先级：

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}

// result
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

但是，如果函数参数为单个字符串字面量类型（不是联合字面量类型），将会提高最高优先级：

```ts
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}

// result
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}
```

### Merging Namespaces

```ts
namespace Animals {
  export class Zebra {}
}

namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}
// is equivalent to
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```

未被export的变量在合并之后，只存在于原来的namespace中：

```ts
namespace Animal {
  let haveMuscles = true;

  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}

namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // Error, because haveMuscles is not accessible here
  }
}
```

### Merging Namespaces with Classes, Functions and Enums

#### Merging Namespaces with Classes

```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```

```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}

console.log(buildLabel("Sam Smith"));
```

```ts
enum Color {
  red = 1,
  green = 2,
  blue = 4
}

namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    } else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == "magenta") {
      return Color.red + Color.blue;
    } else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}
```

### Disallowed Merges

类无法和其他的类或者变量进行合并。

### Module Augmentation

```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
Observable.prototype.map = function(f) {
  // ... another exercise for the reader
};
```

上述例子中，typescript编译器无法获知`Observable.prototype.map`的任何信息。

```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function(f) {
  // ... another exercise for the reader
};

// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map(x => x.toFixed());
```

通过module augmentation可以解决这个问题。

module augmentation有两个限制：

- 无法在顶层增加新的声明，只能扩展已有声明
- 默认导出无法被augmented

### Global Augmentation

```ts
// observable.ts
export class Observable<T> {
  // ... still no implementation ...
}

declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}

Array.prototype.toObservable = function() {
  // ...
};
```



## Decorators

使用decorator，需要在tsconfig.json中开启`experimentalDecorators`。

### Decorator Factories

### Decorator Composition

- decorator表达式自顶向下执行
- 表达式返回的结果自底向上执行

```ts
function f() {
  console.log("f(): evaluated");
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("f(): called");
  };
}

function g() {
  console.log("g(): evaluated");
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("g(): called");
  };
}

class C {
  @f()
  @g()
  method() {}
}

// result
f(): evaluated
g(): evaluated
g(): called
f(): called
```

### Decorator Evaluation

### Class Decorator

class decorator在类前声明，作用于类的构造函数。无法用于声明文件（例如`declare`类）。

class decorator将在运行时作为函数被调用，类的构造函数作为其唯一的参数。

如果class decorator有返回值，那么该返回值将替换掉原先的构造函数。

```ts
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

```ts
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

console.log(new Greeter("world"));// { "property": "property", "hello": "override", "newProperty": "new property" } 
```

### Method Decorator

method decorator在类方法前声明。作用于方法的`Property Descriptor`，可以观察、修改、替换调用方法的定义。和class decorator一样，无法用于声明文件中。

method decorator在运行时被调用，并接受三个参数：

- 对于静态方法，则是类的构造函数；对于实例方法，则是实例本身
- 方法的名字
- 方法的`Property Descriptor`，**注意：如果目标环境低于ES5，那么该值为undefined**

```ts
function enumerable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### Accessor Decorators

accessor decorator在存取器前声明。同样作用于`Property Descritor`。

**注意**：typescript不允许同时对同一个成员的`get`、`set`使用decorator，并且accessor decorator必须书写于前面的存取器中。因为`Property Descriptor`中可以指定`get`、` set`。

accessor decorator接受的参数和method decorator一致。

```ts
function configurable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

### Property Decorators

property decorator在类成员变量前声明。

只接受两个参数，没有`Property Descriptor`。

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}
```

### Parameter Decorators

parameter decorator作用于方法参数。

接受三个参数，第三个参数为该成员其所在参数列表中的序号。

```ts
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey
  );
}

function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>
) {
  let method = descriptor.value;
  descriptor.value = function() {
    let requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName
    );
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          arguments[parameterIndex] === undefined
        ) {
          throw new Error("Missing required argument.");
        }
      }
    }

    return method.apply(this, arguments);
  };
}

class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  @validate
  greet(@required name: string) {
    return "Hello " + name + ", " + this.greeting;
  }
}
```

### Metadata

使用reflect-metadata

```bash
npm i reflect-metadata --save
```

开启装饰器：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```ts
import "reflect-metadata";

class Point {
  x: number;
  y: number;
}

class Line {
  private _p0: Point;
  private _p1: Point;

  @validate
  set p0(value: Point) {
    this._p0 = value;
  }
  get p0() {
    return this._p0;
  }

  @validate
  set p1(value: Point) {
    this._p1 = value;
  }
  get p1() {
    return this._p1;
  }
}

function validate<T>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) {
  let set = descriptor.set;
  descriptor.set = function(value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);
    if (!(value instanceof type)) {
      throw new TypeError("Invalid type.");
    }
    set.call(target, value);
  };
}
```

```ts
class Line {
  private _p0: Point;
  private _p1: Point;

  @validate
  @Reflect.metadata("design:type", Point)
  set p0(value: Point) {
    this._p0 = value;
  }
  get p0() {
    return this._p0;
  }

  @validate
  @Reflect.metadata("design:type", Point)
  set p1(value: Point) {
    this._p1 = value;
  }
  get p1() {
    return this._p1;
  }
}
```

- [JavaScript Reflect Metadata 详解](https://www.jianshu.com/p/653bce04db0b)

