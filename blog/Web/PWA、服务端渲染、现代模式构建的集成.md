# PWA、服务端渲染、现代模式构建的集成

## 介绍

集成PWA、SSR和modern build是为了兼顾以上的优点：

- service worker提供更快的资源响应以及提升用户离线体验
- 加速首屏加载
- 根据用户浏览器减少不必要的带宽浪费

以下是我在集成过程中碰到的主要问题，如果对上面三个概念不清楚，可以先阅读我的博客：

- [PWA](渐进式Web应用PWA.html)
- [服务端渲染](服务端渲染开发记录.html)
- [现代模式构建](现代模式打包.html)



## 解决现代模式构建出两套资源的问题

现代模式构建会生成两套资源，即vue ssr client plugin会产生两个clientManifest.json文件，服务端的html是响应时根据clientManifest.json进行资源注入的，这一点和SPA不同，SPA是在客户端构建时就注入完成。为了解决究竟使用哪套资源时，我借鉴了Nuxt框架的做法，根据用户请求时的用户代理来选用clientManifest.json进行资源注入，具体的用户代理如下：

```js
const ModernBrowsers = {
  Edge: '16',
  Firefox: '60',
  Chrome: '61',
  'Chrome Headless': '61',
  Chromium: '61',
  Iron: '61',
  Safari: '10.1',
  Opera: '48',
  Yandex: '18',
  Vivaldi: '1.14',
  'Mobile Safari': '10.3'
};
```

## 解决服务端渲染的离线情况下Service Worker无法正常返回页面的问题

SPA情况下，如果离线时用户访问www.example.com/user，我们可以简单fallback到返回www.example.com的缓存响应中，这个时候Vue会根据url进行前端页面跳转，而服务端渲染的页面有一个`data-server-rendered="true`，Vue会认为该页面是服务端渲染返回的，因此会保留页面的DOM，这就会导致一些逻辑出错，这部分我还没有细致研究，只是猜测。解决这个问题的方法就是，当用户第一次访问页面，先预缓存一个客户端打包生成的index.html，用户在不同路径下刷新返回的document也会利用workbox的runtimeCache进行缓存，如果用户离线时，访问刷新的路径不在Cache Storage中，就fallback到客户端打包生成的index.html（该html使用的资源和服务端渲染自动注入的资源是一致的），这样就可以启用单页面模式；如果runtimeCache中有对应路径的缓存就可以直接返回该缓存的内容。



## 最后

相关配置文件可以在[闲钱宝前端github仓库](https://github.com/earnsparemoney/frontend)中找到：

- vue.config.js：集成3种特性的webpack相关配置
- server/router
  - dev-ssr.js：开发环境下服务端渲染的路由
  - ssr.js：生产环境下服务端渲染的路由
- src/sw/serviceWorker.js：关于PWA对常见请求的缓存策略
- public/manifest.json：安装PWA所需要的manifest.json配置文件