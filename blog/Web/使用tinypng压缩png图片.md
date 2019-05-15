---
sidebar: auto
title: '使用tinypng压缩png图片'
---

## 安装TinyPNG CLI

`npm i -g tinypng-cli`

### 常用操作

#### 压缩单文件

`tinypng demo.png -k your app key`

#### 压缩当前目录

`tinypng -k your app key` or `tinypng . -k your app key`

#### 压缩当前目录及其子目录

`tinypng -r -k your app key`

