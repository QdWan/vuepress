---
sidebar: auto
title: VuePress搭建
---

## 全局安装VuePress

`npm i -g vuepress`

## 创建项目文件

`mkdir vuepress`

`cd vuepress`

`mkdir blog`

## 初始化项目文件

`cd blog`

`vuepress build`

## 在vuepress文件夹下创建package.json

```json
// package.json
{
  "scripts": {
    "blog:dev": "vuepress dev blog",
    "blog:build": "vuepress build blog"
  }
}
```

## 进入.vuepress文件夹并创建config.js

```js
// config.js
module.exports = {
	title: 'Lim\'s Page',
	description: 'Just playing around',
	themeConfig: {
		nav: [
			{ text: '主页', link: '/' },
			{ text: '博文',
				items: [
					{ text: 'Web', link: '/Web/' },
					{ text: '环境配置', link: '/环境配置/' }
				] 
			},
			{ text: 'Github', link: 'https://www.github.com/codeteenager' },
		],
		sidebar: 
			{
				'/Web/': [
					{
						title: 'Web',
						collapsable: false,
					},
					'服务端渲染'
				],
				'/环境配置/': [
					{
						title: '环境配置',
						collapsable: false,
					}
				]
			}
		,
		sidebarDepth: 3,
		lastUpdated: 'Last Updated', 
	}
}
```

- themeConfig配置相关主题内容
- nav是导航栏内容，link的根路径是blog文件夹，/Web/则指的是blog文件夹中的Web文件夹，注意每个文件夹都需要一个README.md文件
- sidebar是侧边栏内容，'/Web/'值得是Web文件夹中的侧边栏内容，数组中的每一个元素代表一个条目，元素可以是一个对象，也可以是字符串。如果是对象，则可以配置相应的一些选项，例如title、collapsable，collapsable指定是否可以折叠。数组第一个元素是README.md文件，其他的元素是自己新建的md文件，对应文件名称。
- sidebarDepth是侧边栏可显示的深度

## 部署

在github中创建两个仓库，一个为limsanity.github.io（用于显示页面），一个为vuepress（用于保存文件）。

### 使用travis CI持续集成

- 首先在github的setting---developer setting---personal access token一栏点击generate new token， 这下面的选项全选，然后就会生成一个token，复制这个token。

- 进入travis CI网站，勾选vuepress这个仓库，进入travis后台，在环境变量（Environment Variables）里设置键值对，比如access_token <把复制的token黏贴在这>
- 在本地vuepress文件中创建一个.travis.yml文件

```js
// .travis.yml
language: node_js
sudo: required
node_js:
  - 8.11.1
install:
  - npm install -g vuepress
cache:
  directories:
    - node_modules
script:
    - ./deploy.sh
branch: master
```

- 同时创建一个deploy.sh文件

```js
// deploy.sh
npm run blog:build
cd blog/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f https://${access_token}@github.com/Limsanity/Limsanity.github.io.git master
cd -
```

- 在deploy.sh所在路径下执行`git update-index --chmod=+x deploy.sh`以获取权限
- 将本地vuepress内容推送到远程仓库vuepress中，可以在travis后台查看是否完成。成功后可以看见limsanity.github.io仓库中有了一些内容，这个时候访问https://limsanity.github.io就可以看见vuepress搭建的博客