---
sidebar: auto
---

# Nginx Cookbook

## High-Performance Load Balancing

### HTTP Load Balancing

```nginx
upstream backend {
  server 10.10.12.45:80      weight=1;
  server app.example.com:80  weight=2;
}

server {
  location / {
    proxy_pass http://backend;
  }
}
```

HTTP upstream模块控制着HTTP的负载均衡，该模块可以定义一些目标地址，目标地址可以是Unix套接字，IP地址，DNS记录。



### TCP Load Balancing

```nginx
stream {
  upstream mysql_read {
    server read1.example.com:3306  weight=5;
    server read2.example.com:3306;
    server 10.10.12.34:3306        backup;
  }
  
  server {
    listen 3306;
    proxy_pass mysql_read;
  }
}
```

使用Nginx的stream模块进行TCP负载均衡。该配置不应该放在`conf.d`文件夹下，`conf.d`文件夹下应当放置和http块相关的配置。可以新建一个`stream.confg.d`放置tcp相关的配置，然后在`nginx.conf`文件中新建stream块，include新的stream配置文件。

该负载均衡配置和http相似，目标地址可以是Unix套接字、IP和DNS记录，以及可以配置服务器权重、最大连接数、DNS解析器和backup。

### UDP Load Balancing

```nginx
stream {
  upstream ntp {
    server ntp1.example.com:123  weight=2;
    server ntp2.example.com:123;
  }
  
  server {
    listen 123 udp;
    proxy_pass ntp;
  }
}
```

UDP负载均衡和TCP一样在stream块中配置，server块中指定监听UDP即可。

```nginx
stream {
  server {
    listen 1195 udp reuseport;
    proxy_pass 127.0.0.1:1194;
  }
}
```

如果需要在客户端和服务器间负载均衡多个包，可以指定`reuseport`提高效率，例如：OpenVPN、VoIP、DTLS等服务。



### Load-Balancing Methods

```nginx
upstream backend {
  least_conn;
  server backend.example.com;
  server backend1.example.com;
}
```

Nginx提供了以下几种负载均衡的方法：

Round robin

- 轮询。默认负载均衡的方法。可以为不同机器设置权重。

Least connections

- 最少连接数量。也可以为不同机器设置权重，选取connections/weight最小的服务器。启用指令为`least_conn`。

Least time

- 最低时延。只有Nginx Plus中可用。最少连接数量并不意味着最小响应时间。时延计算和`header`或者`last_byte`有关。如果指定为`header`，时延为接收到相应头部的时间；如果指定为`last_byte`，时延为收到整个响应的时间。启用指令为`least_time `。示例：`least_time header`。

Generic hash

- 一般哈希。允许用户自定义哈希函数的输入。注意，当一个上游服务器实例被删除时，所有请求将会被重新映射，可以使用`consistent`通过ketama算法减少重新分配的影响。启用指令`hash`。示例：`hash $redirect_uri consistent`。

Random

- 随机。会考虑权重。可以指定参数`two`，Nginx将随机选取两个服务器，然后根据制定算法进行选择，默认为`least_conn`。启用指令`random`。示例：`random two least_time=last_byte`。

IP hash

- IP哈希。该方法只会作用于HTTP。使用客户端IP作为哈希输入。使用IPv4前3个字节或者整个IPv6作为输入。同样会考虑权重。可以为其中一个暂时无法服务的服务器标记`down`，将原本该请求至此的新请求被重新计算并转发到新的服务器实例上。启用指令为`ip_hash`。



### Sticky Cookie（Nginx Plus）

```nginx
upstream backend {
  server backend1.example.com;
  server backend2.example.com;
  sticky cookie
    		 affinity
         expires=1h
         domain=.example.com
         httponly
         secure
         path=/;
}
```

Nginx Plus可以在客户端和服务器第一个请求中设置这个cookie，随后追踪这个cookie，确保接下来的请求都导向相同的服务器中。



### Sticky Learn（Nginx Plus）

```nginx
upstream backend {
  server backend1.example.com:8080;
  server backend2.example.com:8081;
  
  sticky learn
         create=$upstream_cookie_cookiename
         lookup=$cookie_cookiename
         zone=client_session:2m;
}
```

该示例告诉Nginx从相应头中查找和追踪名字为COOKIENAME的cookie，并且查找cookie相对应的session，该session存储与2MB大小的共享内存中。

create告诉Nginx如何创建会话。

lookup告诉Nginx如何搜索绘画。

zone指定存储共享内存的名字和大小。

上述变量都在HTTP模块中指定。



### Sticky Routing（Nginx Plus）

```nginx
map $cookie_jsessionid $route_cookie {
  ~.+\.(?P<route>\w+)$ $route;
}

map $request_uri $route_uri {
  ~jsessionid=.+\.(?P<route>\w+)$ $route;
}

upstream backend {
  server backend1.example.com route=a;
  server backend2.example.com route=b;
  
  sticky route $route_cookie $route_uri;
}
```

sticky route可以传递多个参数，第一个非空的参数作为路由依据。例如如果$route_cookie为空，$route_uri非空，则路由至backend2.example.com。



### Connection Draining（Nginx Plus）

可以通过Nginx Plus API控制Nginx不再向某个服务器发送新的连接。

在删除session时，需要保证与该session有关的旧的为断开的连接还能正常进行，但是不在接受新的连接。



### Passive Health Checks

