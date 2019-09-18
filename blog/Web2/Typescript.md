# Typescript

阅读材料：

- [typescript官网](<https://www.tslang.cn/docs/home.html>)
- [typescript deep dive](<https://github.com/basarat/typescript-book>)
  - [中文翻译版](<https://jkchao.github.io/typescript-book-chinese/>)



## tsconfig

以下的tsconfig配置文件是通过Vue CLI创建而成的。

```js
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
      "webpack-env"
    ],
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### compilerOptions

编译相关的配置。

#### target

指定编译之后的JS版本。

```js
// greeter.ts
var a = () => {};

tsc greeter.ts
// greeter.js
var a = function () { };

tsc greeter.ts --target ES6
//greeter.js
var a = () => {};
```



#### module

指定生成哪个模块系统代码。

```js
// greeter.ts
import cookie from 'cookie';
var cookies = cookie.parse('foo=bar; equation=E%3Dmc%5E2');

tsc greeter.ts --module CommonJS --allowSyntheticDefaultImports
// greeter.js
"use strict";
exports.__esModule = true;
var cookie_1 = require("cookie");
var cookies = cookie_1["default"].parse('foo=bar; equation=E%3Dmc%5E2');

tsc greeter.ts --module ES6 --allowSyntheticDefaultImports
// greeter.js
import cookie from 'cookie';
var cookies = cookie.parse('foo=bar; equation=E%3Dmc%5E2');
```



#### allowSyntheticDefaultImports

官网解释：”允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。“

在上面的代码例子中运行tsc命令时都添加了`--allowSyntheticDefaultImports`，否则将会报`Module '"/node_modules/@types/cookie/index"' has no default export.`的错误，当设置了该参数，则允许从没有默认导出的模块中默认导入（不做检查）。



#### esModuleInterop

阅读材料

- [更便利的与ECMAScript模块的互通性](<https://www.tslang.cn/docs/release-notes/typescript-2.7.html>)

上述代码例子生成的commonjs模块的greeter.js是无法运行的，从代码中可知`cookie_1`并没有`default`的属性，因为allowSynthenticDefaultImports仅为了类型检查，而不转译。esModuleInterop则会负责转译，开启了该参数会默认开启allowSynthenticDefaultImports。

```js
// greeter.ts
import cookie from 'cookie';
var cookies = cookie.parse('foo=bar; equation=E%3Dmc%5E2');

tsc greeter.ts --module CommonJS --esModuleInterop
// greeter.js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var cookie_1 = __importDefault(require("cookie"));
var cookies = cookie_1["default"].parse('foo=bar; equation=E%3Dmc%5E2');

```

转移后的这段代码可以正常运行。该配置选项可以帮助你从babel中迁移到ts时，代码无需做过多的改变。