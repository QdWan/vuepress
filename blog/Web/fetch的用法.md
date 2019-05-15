---
title: 'fetch的用法'
---

## 基本用法

```js
fetch(url).then(res => {})
```

#### 发送带凭据的请求

fetch请求默认是不会带上cookie的，如果需要带上cookie，可以设置fetch的第二个参数：

```js
fetch(url, {
    credentials: 'include'
}).then(res => {})
```

credentials：

- include：跨域时也可带上cookie
- same-origin：仅在同域时带上cookie
- omit：不带cookie

#### 检测是否请求成功

fetch是基于promise的，仅当发生网络故障时，才会抛出错误令catch捕获。类似于404这样的状态码不会被当作错误抛出，因此需要人为在then中判断状态码。

### 自定义对象

```js
var myHeaders = new Headers();

var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

var myRequest = new Request('flowers.jpg', myInit);

fetch(myRequest).then(function(response) {
  return response.blob();
}).then(function(myBlob) {
  var objectURL = URL.createObjectURL(myBlob);
  myImage.src = objectURL;
});
```

复用Request，并且可以传递不同的init对象

```js
var anotherRequest = new Request(myRequest,myInit);
```



## 与ajax比较

优点

- 关注的分离
- Request能被复用
- 基于Promise



缺点：

- 不支持abort，造成流量浪费
- 没有办法检测请求进度
- 只对网络故障进行报错