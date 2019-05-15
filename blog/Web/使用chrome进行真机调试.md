---
sidebar: auto
title: '使用chrome进行真机调试'
---

- 使用usb连接手机和电脑

- 手机打开开发者模式
- 打开chrome的开发者工具
- 从开发者工具的设置中选中more tools的remote devices选项
- 此时会有一个remote devices的设置版面，勾选Port forwarding，并点击Add rule，假设电脑本地启的服务是localhost:8080，那么第一个输入框（Device port）输入8080，第二个输入框输入localhost:8080
- 此时手机打开chrome浏览器，输入localhost:8080，即可看见页面
- 在chrome中可以点击Inspect，对手机的页面进行调试