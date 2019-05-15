---
sidebar: auto
title: 'PWA学习'
---

## 初始化项目

mkdir learn-pwa

npm init -y

npm i koa koa-static -S

准备两张图片cow.svg，dog.svg

新建app.js

```js
const Koa = require('koa')
const koaStatic = require('koa-static')

const app = new Koa()
app.use(koaStatic(__dirname))

app.listen(3000)
```

新建index.html

```js
<!DOCTYPE html>
An image will appear here in 3 seconds:
<script>
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered!', reg))
    .catch(err => console.log('Boo!', err));

  setTimeout(() => {
    const img = new Image();
    img.src = '/cow.svg';
    document.body.appendChild(img);
  }, 3000);
</script>
```

新建sw.js

```js
self.addEventListener('install', event => {
  console.log('V1 installing…');

  // cache a cat SVG
  event.waitUntil(
    caches.open('static-v1').then(cache => cache.add('/dog.svg'))
  );
});

self.addEventListener('activate', event => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // serve the cat SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  // console.log(url.pathname)
  if (url.origin == location.origin && url.pathname == '/cow.svg') {
    event.respondWith(caches.match('/dog.svg'));
  }
});
```

## 运行项目

node app.js

浏览器打开 localhost:3000，可以看到cow.svg，刷新浏览器看到的则是dog.svg。上述代码中cache.add('/dog.svg')在install这个生命周期中缓存了dog.svg，刷新浏览器会出发fetch事件，service worker则比较路径名是否为 /cow.svg，如果是那么就用缓存的 dog.svg 作为fetch的结果。

默认情况下，不会通过service worker提取页面，因此第一次请求时看到依然是 cow.svg，即使dog.svg已经在缓存中，但是我们可以使用 `clients.claim()`作出改变:

```js
self.addEventListener('install', event => {
  console.log('V1 installing…');

  // cache a cat SVG
  event.waitUntil(
    caches.open('static-v1').then(cache => cache.add('/dog.svg'))
  );
});

self.addEventListener('activate', event => {
  clients.claim()
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // serve the cat SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  // console.log(url.pathname)
  if (url.origin == location.origin && url.pathname == '/cow.svg') {
    event.respondWith(caches.match('/dog.svg'));
  }
});
```

使用了`clents.claim()`则让service worker获得控制权，页面请求的结果直接由service worker进行返回。



## 更新Service Woker

准备第三张图片 horse.svg

```js
const expectedCaches = ['static-v2'];

self.addEventListener('install', event => {
  console.log('V2 installing…');

  // cache a horse SVG into a new cache, static-v2
  event.waitUntil(
    caches.open('static-v2').then(cache => cache.add('/zelda.jpg'))
  );
});

self.addEventListener('activate', event => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V2 now ready to handle fetches!');
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // serve the horse SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  if (url.origin == location.origin && url.pathname == '/cow.svg') {
    event.respondWith(caches.match('/zelda.jpg'));
  }
});
```

刷新页面，图片并没有改变，这是因为虽然新的service worker已经install了，但是因为旧的service worker依然存在，新的service worker只能延迟执行，只有与旧service worker有关的标签页都关闭之后，新的service worker才会进入activate。可以在install阶段调用`self.skipWaiting()`使得新的service worker立刻获得掌控权：

```js
const expectedCaches = ['static-v2'];

self.addEventListener('install', event => {
  console.log('V2 installing…');
  self.skipWaiting();

  // cache a horse SVG into a new cache, static-v2
  event.waitUntil(
    caches.open('static-v2').then(cache => cache.add('/zelda.jpg'))
  );
});

self.addEventListener('activate', event => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V2 now ready to handle fetches!');
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // serve the horse SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  if (url.origin == location.origin && url.pathname == '/cow.svg') {
    event.respondWith(caches.match('/zelda.jpg'));
  }
});
```

同时看到activate阶段的回调函数，它删除了旧的缓存，`caches.key()`返回的值是`caches.open()`中的参数，在上述所有代码中，创建过`static-v1`和`static-v2`，因此caches.key()返回的就是这两个值，因此上述代码会通过`!expectedCaches.includes(key)`判断当前遍历的是否是属于`static-v2`的缓存，如果不是就删除掉。

## webpack中快速配置PWA

mkdir webpack-with-pwa

npm i webpack webpack-cli -D

npm i html-webpack-plugin clean-webpack-plugin workbox-webpack-plugin -S

新建webpack.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Progressive Web Application 2'
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
}
```

更改package.json

```js
{
  ...
  "scripts": {
-    "build": "webpack"
+    "build": "webpack",
+    "start": "http-server dist"
  },
  ...
}
```

新建index.js

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}
```

### 运行

npm run build

npm start

浏览器打开localhost:8080，然后终端关闭掉webpack开启的服务器，刷新浏览器，并不会报错，说明网页使用了service worker的缓存，pwa目的达成，也可以从 chrome dev tool中看到缓存的内容。



## 参考

[PWA](<https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#service_worker>)