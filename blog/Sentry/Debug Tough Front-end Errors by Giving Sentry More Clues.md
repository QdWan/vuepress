---
sidebar: auto
title: 'Debug Tough Front-end Errors by Giving Sentry More Clues'
---

# Debug Tough Front-end Errors by Giving Sentry More Clues

- [原文阅读](https://blog.sentry.io/2019/01/17/debug-tough-front-end-errors-sentry-clues)

## Group errors your way with fingerprints

Sentry具有聚合相同错误事件的功能。该功能由fingerprint的实现，fingerprint即每个事件对应的一个字符串。 默认情况下，fingerprint由事件堆栈信息hash生成（忽略node_modules和一些库）。如果没有堆栈信息，则由错误信息生成。

- 堆栈信息（stack trace content）
- 错误信息（error message）

[Rollup and Grouping documentation](https://docs.sentry.io/data-management/event-grouping/?platform=browser?platform=browser)中深入介绍Sentry如何聚合错误。

默认的fingerprints生成方式适用于大部分情况，但是有时候你使用了一个自定义的错误处理函数，就可能导致不同的错误被聚合在一起，这种情况下就需要手动设置适合fingerprints来区分错误。例如下面示例：

```jsx
class AsyncComponent extends React.Component {
  componentDidMount() {
    fetch(this.props.endpoint).catch(() => {
      this.setState({
        error: new Error('Unable to load all required endpoints'),
      });
    });
  }
  render() {
    if (this.state.error) {
      return <RouteError error={this.state.error} />; // shows crash dialog
    }
    return this.props.children(this.state);
  }
}
```

该AsyncComponent会进行网络调用并且捕获网络错误。这个组件中存在的缺点在于：对于不同的API调用失败情况下，生成的错误堆栈是一样的。为了解决这个问题，可以手动设置fingerprints：

```js
Sentry.withScope(scope => {
  scope.setFingerprint([window.location.pathname]);
  Sentry.captureException(error);
});
```

这样我们就能得知哪个页面中导致出错，获得更有用的聚合方式。

- 手动设置fingerprints，例如：自定义错误处理函数导致的错误堆栈一致、获得更适合的错误分类方式。

## See the whole picture with breadcrumbs

默认情况下，Sentry browser SDK会自动收集breadcrumbs。从breadcrumbs中可以得知错误发生前的操作。例如：fetch API、DOM交互（点击）和通过console输出的信息等。

可以添加自定义的breadcrumbs信息：

```js
export function openModal(renderer, options) {
  ModalActions.openModal(renderer, options);
  Sentry.addBreadcrumb({
    category: 'ui',
    message: `Opened "${options.title}" modal`,
    level: 'info',
    type: 'user',
  });
}
```

如果使用状态管理库，可以通过hook的方式自动收集actions或者state变化相关的breadcrumbs。例如Redux，可以使用raven-for-redux的中间件进行收集。

- 添加breadcrumbs信息

## Filter and segment errors with tags

Tags可以用于快速搜索错误以及观察错误如何影响用户，例如：搜索`browser:Firefox`。Sentry client SDK自动设置`browser`和`os`标签。

可以设置自定义tag：

```js
Sentry.configureScope((scope) => {
  scope.setTag("subscription", subscription.name);
});
```

- 添加tag信息
- 根据tag快速搜索
- 根据tag分析错误在不同用户间的分布

## Record complex state as additional data

tag可以记录一些简单的state，但它只是一个键值对。可以通过extra data记录复杂的state，例如数组等。extra data不可用于搜索。

```js
Sentry.withScope(scope => {
  scope.setExtra('orgAccess', access);
  Sentry.captureException(error);
});
```

- 利用extra data记录复杂state