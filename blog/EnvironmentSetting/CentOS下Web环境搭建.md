---
sidebar: auto
title: 'CentOS下Web环境搭建'
---

## ssh免密码登陆

`ssh-keygen -t rsa -P "password"`

`scp -p ~/.ssh/id_rsa.pub root@<server ip>:/root/.ssh/authorized_keys`



## 安装git

`yum info git`

`yum install -y git`



## 安装Nginx

见[CentOS 7 yum 安装 Nginx](<https://blog.csdn.net/u012486840/article/details/52610320>)

### 添加Nginx的yum源

`rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm`

### 安装Nginx

`yum install -y nginx`

### 运行Nginx

`nginx`

### Nginx的配置文件目录

`/etc/nginx/conf.d/`



## 安装Node

见[CentOS如何安装Node](<https://blog.csdn.net/lu_embedded/article/details/79138650>)

`yum install epel-release`

`yum install nodejs`

此时的node版本较低，需要更新，否则会出现koa-static中间件使用了ES7新语法等报错信息，见[koa-static报错信息](<https://stackoverflow.com/questions/46029209/koa-static-async-function-isnt-supported-by-old-node-js>)。

### 升级

见[Node升级到最新版本](<https://segmentfault.com/a/1190000015302680>)

#### 安装n

n是nodejs版本管理工具

`npm install -g n`

#### 安装最新版node

`n latest`

#### 切换node版本

输入`n`，会出现版本选择，选择最新版，再次查看node版本，可能仍然是旧版本。

#### 解决失效为问题

详情见上面链接

`vim ~/.bash_profile`

添加

```
export N_PREFIX=/usr/local #node实际安装位置
export PATH=$N_PREFIX/bin:$PATH
```

生效

`source ~/.bash_profile`

### 更换淘宝源

`npm install -g cnpm --registry=https://registry.npm.taobao.org`



## Mysql安装

### 添加mysql yum源

`wget 'https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm'`

`rpm -Uvh mysql57-community-release-el7-11.noarch.rpm`

`yum repolist all | grep mysql`

###yum安装mysql

`yum install mysql-community-server`

### 启动

`service mysqld start`

### 登录

`mysql -u root -p`

### 查看默认密码

`cat /var/log/mysqld.log | grep passwod`

### 修改默认密码

`SET PASSWORD FOR ['root'@'localhost'](mailto:'root'@'localhost') = PASSWORD('newpass');`

### 修改密码安全性限制

`set global validate_password_policy=0;`



##Docker安装

删除旧版本

```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```

安装必要工具

```
yum install -y yum-utils device-mapper-persistent-data lvm2
```

添加软件源信息

```
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

更新 yum 缓存

```
yum makecache fast
```

安装 Docker-ce

```
yum -y install docker-ce
```

启动 Docker 后台服务

```
systemctl start docker
```

使用镜像加速器

[Docker镜像加速器](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)