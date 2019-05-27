---
title: '图片大小优化'
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

## 安装webp-converter-cli

`npm i -g web-converter-cli`

### 常用操作

#### 转换当前目录及子目录文件

`webpc -r`

#### 转换单文件

`webpc -f assets/img.jpg`

