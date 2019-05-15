---
title: 'Nginx学习笔记'
---

## 引入配置文件

### nginx.conf中添加引用文件

- 在nginx.conf文件中的http模块中添加`include /usr/local/nginx/conf/your_directory/*.conf`

### 编写配置文件

- 在`/usr/local/nginx/conf/`目录下新建一个存放配置文件的文件夹，例如`mkdir cr`

- `cd cr`，添加cr.conf
  - alias的意思是指，当请求`129.204.209.69/static/images/…`到来的时候，将alias指定的目录作为对应目录；和root的区别在于，root的值后面才拼接上`/static/images/...`
  - expires指定过期时间
  - autoindex为on时会为当前路径建立索引，客户可以访问到，否则无法访问，显示403 forbidden
  - 注意: 这里使用了服务器本地目录作为图片资源目录，nginx可能没有权限访问目录，因此要在nginx.conf中添加`user root`设置用户
  - proxy_pass指定访问129.204.209.69的请求，代理到`cr`变量中，也就是上面设置的upstream，请求变成`localhost:3000/...`
  - proxy_cache和proxy_cache_key与缓存相关（待补充）
  - location的匹配是有顺序的

```
upstream cr {
	server localhost:3000
	keepalive 64;
}

proxy_cache_path /usr/local/nginx/cache/ levels=1:2 keys_zone=cache:512m inactive=1d max_size=8g;

server {
	listen 80;
	server_name 129.204.209.69;
	
	location /static/images/ {
		alias /root/Clash-Royale-PWA/dist/static/images;
		expires 7d;
		# autoindex on;
	}
	
	location ~*\.(js|css)$ {
		proxy_pass http://cr;
		proxy_cache cache;
		proxy_cache_key $uri$is_args$args;
		expires 7d;
		proxy_set_header X-Nginx-Proxy true;
	}
	
	location / {
		proxy_pass http://cr
	}
}
```

### 重启nginx服务

`nginx -s reload`

### sendfile指令的作用

- 见[sendfile的作用](<https://www.jianshu.com/p/70e1c396c320>)

- 避免数据在内核缓冲区和用户缓冲区之间的拷贝，操作效率高，称为零拷贝

