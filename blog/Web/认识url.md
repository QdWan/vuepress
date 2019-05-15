---
title: '认识url'
---

## 组成

- 协议
- 主机地址
- 端口
- 路径
- 参数：通过？连接到path后面，参数之间用&分隔



## “#”

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width initial-scale=0.5">
	<title>Document</title>
</head>
<style>
	div {
		width: 800px;
		height: 800px;
		border: solid 1px
	}
</style>
<body>
	<div id="1"></div>
	<div></div>
	<div id="2"></div>
</body>
</html>
```

在浏览器中打开该html，然后在url后面添加#2，浏览器窗口会滚动到id为2的div处。"#"后面是一个标识符，该标识符可以由id指定，也可以由a标签的name属性指定。

- HTTP请求中是不会包括#后面的字符的，例如访问localhost:3000#home，HTTP的首行地址是`GET /`，不会带上#后面的字符。

- 在浏览器中改变#后面的字符，不会发出HTTP请求。
- 改变#后面的字符，会添加一条历史纪录