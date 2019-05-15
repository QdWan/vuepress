---
sidebar: auto
title: CSRF和XSS
---

## XSS

Cross Site Script（跨站脚本攻击），缩写与层叠样式表进行区分，因此称为XSS。

XSS攻击是指攻击者在网站上注入恶意的客户端代码，通过恶意脚本对客户端网页进行篡改，从而在用户浏览网页时，对用户浏览器进行控制或者获取用户隐私数据的一种攻击。

攻击者对客户端网页注入的恶意脚本一般包括 JavaScript，有时也会包含 HTML 和 Flash。有很多种方式进行 XSS 攻击，但它们的共同点为：将一些隐私数据像 cookie、session 发送给攻击者，将受害者重定向到一个由攻击者控制的网站，在受害者的机器上进行一些恶意操作。



### 反射型

这种攻击方式需要诱使用户点击一个恶意链接，或者提交一个表单，或者进入一个恶意网站时，注入脚本进入被攻击者的网站。

```js
const express = require('express')
const path = require('path')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

app.use(cookieParser('test'))
app.use(session({
  secret: 'cr',
  name: 'cr',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: false
  },
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.json())

app.get('/favicon.ico', (req, res) => {
  res.end()
})

app.get('/', (req, res) => {
	req.session.user = {
		name: 'lim'
	}
	res.header('Access-Control-Allow-Origin', '*')
	res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
  res.write('<script>console.log(document.cookie)</script>');
	res.end()
})

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})

module.exports = app

```

```html
// test.html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<style>
	#div {
		height: 35px;
		width: 50px;
		/*border: solid;*/
		background-color: #eee;
	}
	#div::after {
		content: "";
		display: inline-block;
		height: 25px;
		width: 25px;
		margin-left: 40px;
		margin-top: 5px;
		border-radius: 100%;
		background-color: white;
		/*border: solid;*/
	}
</style>
<body>
	<a href="http://localhost:3000" onclick="return false">link</a>
</body>
</html>
```

点击test.html中的a标签，会跳转到新的页面，这个时候服务器返回一段js代码，客户端就会执行该代码。这里返回的代码就会输出document.cookie，以此可以获得用户cookie。



### 存储型

存储型 XSS 会把用户输入的数据 "存储" 在服务器端，当浏览器请求数据时，脚本从服务器上传回并执行。这种 XSS 攻击具有很强的稳定性。

比较常见的一个场景是攻击者在社区或论坛上写下一篇包含恶意 JavaScript 代码的文章或评论，文章或评论发表后，所有访问该文章或评论的用户，都会在他们的浏览器中执行这段恶意的 JavaScript 代码。

准备一个输入页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<input type="text" id="input" value="<script>console.log(document.cookie)</script>">
	<button id="button">submit</button>
	
	<script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js">
	</script>
	<script>
		const input = document.getElementById('input')
		const button = document.getElementById('button')

    button.addEventListener('click', (e) => {
    	$.ajax({
    		type: 'POST',
    		url: 'http://localhost:3000/save',
    		// contentType: "application/json;charset=utf-8",
    		// data: JSON.stringify({"content": input.value}),
    		data: {"content": input.value},
    		dataType: 'json'
    	})
    }, false);
	</script>
</body>
</html>
```

```js
const express = require('express')
const path = require('path')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

let input = ''

app.use(cookieParser('test'))
app.use(session({
  secret: 'cr',
  name: 'cr',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: false
  },
  resave: true,
  saveUninitialized: true
}))

app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	// res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
	// res.header('Access-Control-Allow-Headers', 'Content-Type')
	next()
})

app.use(bodyParser.urlencoded())

app.get('/favicon.ico', (req, res) => {
  res.end()
})

app.get('/save/:id', (req, res) => {
	console.log(1)
	req.session.user = {
		name: 'lim'
	}
	res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
  res.write(input);
	res.end()
})

app.post('/save', (req, res) => {
	input = req.body.content
	console.log(req.body)
	res.end()
})

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})

```

打开输入页面，点击submit按钮，就会发出一个ajax请求，该请求体包含script标签，服务器就会对相应的内容进行存储。打开localhost:3000/save/1，并且服务器就会将这段内容返回，打开浏览器console，就会发现cookie被输出了。



### 基于DOM

应用程序的客户端代码从document.location、document.URL、document.referrer或 其 他 任 何攻击者可以修改的浏览器对象获取数据，如果未验证数据是否存在恶意代码的情况下 ，就将其动态更新到页面的DOM 节点,应用程序将易于受到基于DOM 的XSS攻击。 例如：下面的JavaScript代码片段可从url中读取msg信息，并将其显示给用户。  

var url=document.URL;

document.write(url.substring(url.indexOf("msg=")+4,url.length );  

该段脚本解析URL，读取msg参数的值，并将其写入页面。如果攻击者设计一个恶意的URL，并以JavaScript代码作为msg参数，那么Web浏览器就会像显示HTTP响应那样执行 该代码，应用程序将受到基于DOM 的XSS攻击。



### XSS攻击防范

#### HttpOnly防止窃取Cookie：

```js
const express = require('express')
const path = require('path')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

let input = ''

app.use(cookieParser('test'))
app.use(session({
  secret: 'cr',
  name: 'cr',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  },
  resave: true,
  saveUninitialized: true
}))

app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	// res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
	// res.header('Access-Control-Allow-Headers', 'Content-Type')
	next()
})

app.use(bodyParser.urlencoded())

app.get('/favicon.ico', (req, res) => {
  res.end()
})

app.get('/save/:id', (req, res) => {
	console.log(1)
	req.session.user = {
		name: 'lim'
	}
	res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
  res.write(input);
	res.end()
})

app.post('/save', (req, res) => {
	input = req.body.content
	console.log(req.body)
	res.end()
})

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})

```

上述代码更改了httpOnly的设置，这样就防止了客户端通过js获取cookie。严格来说，HttpOnly 并非阻止 XSS 攻击，而是能阻止 XSS 攻击后的 Cookie 劫持攻击。

#### 输入检查

对用户的输入进行转义，而在一些前端框架中，都会有一份 `decodingMap`， 用于对用户输入所包含的特殊字符或标签进行编码或过滤，如 `<`，`>`，`script`，防止 XSS 攻击：

```js
// vuejs 中的 decodingMap
// 在 vuejs 中，如果输入带 script 标签的内容，会直接过滤掉
const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
}
```

#### 输出检查

用户的输入会存在问题，服务端的输出也会存在问题。一般来说，除富文本的输出外，在变量输出到 HTML 页面时，可以使用编码或转义的方式来防御 XSS 攻击。



## CSRF

CSRF，即 Cross Site Request Forgery，中译是跨站请求伪造。

通常情况下，CSRF 攻击是攻击者借助受害者的 Cookie 骗取服务器的信任，可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击服务器，从而在并未授权的情况下执行在权限保护之下的操作。



### Cookie

每个 Cookie 都会有与之关联的域，这个域的范围一般通过 `donmain` 属性指定。如果 Cookie 的域和页面的域相同，那么我们称这个 Cookie 为第一方 Cookie（first-party cookie），如果 Cookie 的域和页面的域不同，则称之为第三方 Cookie（third-party cookie）。一个页面包含图片或存放在其他域上的资源（如图片）时，第一方的 Cookie 也只会发送给设置它们的服务器。

假设有一个站点: http://www.a.com，登陆后的用户发起如下请求时，会删除指定id的文章:http://www.a.com:3000/content/delete/:id。然后构造一个页面，页面中有一个img标签，其src就是就是删除文章的请求，那么用户在登陆了之后访问这个页面，就会发起删除请求。

在这个过程中，攻击者仅仅是伪造请求，而看不到cookie内容。



### CSRF攻击防范

#### Referer字段的检查

发起请求时，通常会带上referer字段，可以通过检查referer字段来验证请求时否合法，例如图片盗链就没有带上referer字段。

#### 验证码

验证码被认为是对抗 CSRF 攻击最简洁而有效的防御方法。

用户每次进入页面时，服务器就返回验证码，当用户提交表单时，将验证码一起提交，服务器判断是否合法。验证成功后就将当前验证码删除，下次返回一个新的验证码。例如登陆注册页面的实现。但是如果都这种方法避免csrf，用户体验会下降。

#### 添加 token 验证

这个token是由服务器生成并返回给客户端的，用户每次请求都带上token，服务器进行身份验证。如：JWT。



## 参考

https://juejin.im/post/5b4cb141e51d45195c072ef3