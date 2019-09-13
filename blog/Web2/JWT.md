# JWT



## 格式

```js
base64UrlEncode(header).base64UrlEncode(payload).XXX

XXX = HMACSHA256(
	base64UrlEncode(header) + '.' +
  base64UrlEncode(payload),
  secret
)

header {
  alg,
  (typ),
  (cty),
  (kid)
}

payload {
  iss,
  sub,
  aud,
  exp,
  nbf,
  iat,
  jti
}
// 各部分具体格式可见最后的链接：浅析JWT
```

- 其中HMACSHA256为签名算法，可以指定为其他，例如RSA256。

- 可以看到header和payload并不是加密的，如果token丢失，payload的信息可以通过base64解码得到。payload如果放置太多信息，base64编码后的字符串将非常长。

- SHA是散列算法，基于MD5实现，用于确保信息传输的完整性，也就是传输的信息如果遭到篡改，那么使用相同的签名计算出来的值则会不同。
- 如果有一台身份认证服务器和多台应用服务器，那么可以由身份认证服务器使用的算法可以使用RSA256。RSA是非对称加密算法，只有身份认证服务器存储着私钥，其他存储着公钥，因此减少了私钥丢失的可能性。如果使用HMACSHA256，那么密钥都是一致的，其中一台服务器丢失密钥，其他服务器都必须更新。



## 存储问题

Web Storage：

- 容易遭受XSS攻击，XSS攻击可来自第三库、head中的统计代码以及一些动态生成的页面内容。
- 如果有中间层服务器，可以使用double cookie来保存token，其中一个cookie为Http Only，另一个不是，这样可以保证遭受XSS攻击时不被获取到完整的token，同时遭受CSRF攻击时也不会将另一半的token放入Authorization字段。

Cookie：

- 容易遭受CSRF攻击，可增加CSRF Token；或者Cookie设置Same Site，但是该方法兼容性取决于浏览器实现。
- 如果调用第三方api时没有经过中间层服务器，Http Only的cookie中无法在前端取出token。
- 如果没有中间层服务器进行处理，那么也应当选择cookie作为存储载体，因为可以设置cookie的Path，与localStorage等相比，可以减少遭受攻击的可能。同时如果使用服务端渲染，cookie作为载体依然可以在服务端拿出token。



## 丢失问题

- 如果后端没有存储token，一旦用户token丢失或者登出账户，也无法主动注销token。
- 如果后端存储token，每一次请求都必须验证token是否被注销，这样不利于水平扩展，和session没有太大区别。
- 可以增加一个存活时间较长的refresh token，而将access token有效性设置短一些，后端存储refresh token。这么做可以减少每次请求都进行access token的验证，但是存在短时间内token丢失导致的安全性问题。



阅读：

[MY EXPERIENCE WITH JSON WEB TOKENS](<https://x-team.com/blog/my-experience-with-json-web-tokens/>)

[Stop using JWT for sessions](<http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/>)

[浅析JWT](<https://learnku.com/articles/28909>)