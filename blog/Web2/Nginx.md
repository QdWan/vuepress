## Nginx

#### 配置Nginx服务器运行用户(组)

如果希望所有用户都可以启动Nginx进程，有两种办法，一是把指令注释掉：

```nginx
# user [user] [group];
```

二是将用户（和用户组）设置成nobody：

```nginx
# user nobody nobody;
```

此指令只能在全局块中配置。



#### 配置允许生成的worker process数

```nginx
worker_processes number | auto;
```

此指令只能在全局块中配置。



#### 配置Nginx进程PID存放路径

```nginx
pid file | filepath;
```

默认文件存放在Nginx安装目录下的logs中，名字为nginx.pid。path可以是绝对路径或者相对路径。指定path时一定要包括文件名。

此指令只能在全局块中配置。



#### 配置错误日志的存放路径

```nginx
error_log file | stderr [debug | info | notice | warn | error | crit | alert | emerg];
```

日志级别由低到高，设置某一级别后，比这一级别高的日志也会被记录。指定文件对于Nginx进程的用户需要由写权限，否则启动时会报permission deny的错误。

此指令可以在全局块、http块、server块以及location块中配置。



#### 配置文件的引入

```nginx
include file;

include /etc/nginx/conf.d/*.conf; # 引入某文件夹下所有配置文件
```

file支持相对路径。同样要求写权限。

此指令可以放在配置文件任意地方。



#### 设置网络连接的序列化

```nginx
accept_mutex on | off;
```

默认为on。该指令会对多个Nginx进程接受连接进行序列化，防止多个进程对连接进行争抢，引发惊群问题（某一时刻只有一个网络连接，但是多个睡眠进程被唤醒）。

此指令只能在events块中配置。



#### 设置是否允许同时接受多个网络连接

```nginx
multi_accpet on | off;
```

默认为off。on时每个worker process可以同时接受多个到达的网络连接。

此指令只能在events块中配置。



#### 事件驱动模型的选择

```nginx
use select | poll | kqueue | epoll | rtsig | /dev/poll | eventport;
```

此指令只能在events块中配置。



#### 配置最大连接数

```nginx
worker_connections number;
```

默认为512。设置允许每一个worker process同时开启的最大连接数。这里的number不仅仅包括和前端建立的连接数，而是所有可能的连接数。number的值不能大于操作系统支持打开的最大文件句柄数。

此指令只能在events块中配置。



#### 定义MIME-Type

```nginx
include mime.types;
default_type  application/octet-stream;
```

用于识别前端请求的资源类型。如果不指定default_type，默认值为text/plain。

此指令可以在http、server或者location中配置。