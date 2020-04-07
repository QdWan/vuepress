---
sidebar: auto
title: 'Sentry文档'
---

# Sentry文档

## Integration the SDK

通过CDN引入：

```html
<script
  src="https://browser.sentry-cdn.com/5.15.4/bundle.min.js"
  integrity="sha384-Nrg+xiw+qRl3grVrxJtWazjeZmUwoSt0FAVsbthlJ5OMpx0G08bqIq3b/v0hPjhB"
  crossorigin="anonymous"></script>
```

**注意**：如果使用`defer`，要确保JS文件引入顺序，否则在此之前发生的错误Sentry将无法捕获。

通过npm引入：

```bash
npm install @sentry/browser
```

### Connecting the SDK to Sentry

在Sentry中创建项目后会得到一个DSN（Data Soure Name），需要利用这个DSN进行初始化：

```js
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'https://<key>@sentry.io/<project>' });
```

### Verifying Your Setup

```js
Sentry.captureException(new Error("Something broke"));
```

执行该语句会向Sentry发送一个错误报告，打开Sentry对应项目的Issue面板即可查看到错误信息。

## Capturing Errors

### Automatically Capturing Errors

通过引入并配置Sentry，SDK将自动补货全局的`uncaught exception`和`unhandled rejection`。

对于跨域资源产生的错误，需要注意CORS规则，详见：[What the heck is "Script error"?](https://blog.sentry.io/2016/05/17/what-is-script-error#the-fix-cors-attributes-and-headers)。

### Automatically Capturing Errors with Promises

默认情况下，Sentry将会自动捕获未处理的Promise异常。

如果你使用第三方Promise库，需要进行一些额外的Sentry配置。

大多数prmise库都会有全局的hook捕获未处理的错误，你可能需要将全局选项`onunhandledrejection`设置为false，并手动在相关的事件处理函数中调用`Sentry.captureException`。

## Releases

