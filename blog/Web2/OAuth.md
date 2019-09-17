# OAuth

## 流程

## 安全

### 关于state

- state的作用是防止CSRF。

- 如果没有state，攻击者A可以创建一个账号并获取code，然后把用自己的code生成一个url让用户B点击，这个时候用户B登陆的就是攻击者A的账户，B这个时候上传了一些机密文件，其实是上传到攻击者的账户中的。

- state可以解决这个问题，用户重定向至Authorization Endpoint时为其生成一个state，拿到code后验证state是否和之前的state一致即可。
- state可以在客户端本地生成存在cookie中，拿到code重定向至客户端服务器会带上该cookie，此时服务器再比较cookie中的state是否和url中的state一致。

[针对OAuth2的CSRF攻击](https://www.jianshu.com/p/c7c8f51713b6)

[Nuxt中的auth模块](https://auth.nuxtjs.org/#getting-started)



### 关于redirect_uri

- 如果不指定redirect_uri，那么攻击者可以随意生成一个url，这样就能获得用户的code，从而以用户身份登陆。



### 为什么需要拿到code再拿token

- 拿到code之后在服务器端拿token，就能保证token不会被截获。
- 因为认证服务器通常是HTTPS的，而应用服务器不一定，因此如果直接把token通过重定向传给应用服务器的话，无法保证浏览器到应用服务器的传输过程不会截获。当服务器拿到code之后，再去找认证服务器生成token，两者传输过程基于HTTPS，因此不会被截获利用。
- 虽然code有可能被截获，但是OAuth中的code通常只会被使用一次，如果攻击者截获code请求到token，用户又通过该code请求token，那么认证服务器就会发现该code使用了两次，从而revoke掉之前发出的token。而这个过程对于用户来说结果就是登录失败，通常只需重新登录即可。