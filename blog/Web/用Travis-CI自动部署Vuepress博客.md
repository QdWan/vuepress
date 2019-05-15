---
title: '用Travis CI自动部署Vuepress博客'
---

# 用Travis CI自动部署Vuepress博客

## Gihub中生成personal access token

![](./assets/travis-vuepress1.png)

## 准备Travis命令行工具

- `ruby -v`检查是否有ruby环境
- `gem install travis`
- `travis login`，输入你的github用户吗和密码。

- `travis encrypt -r <github name>/<github repo> GH_Token=XXX`，其中GH_Token为刚刚在github生成的token。

加密之后终端会生成加密的信息，将其复制粘贴进`.travis.yml`中：

```
env:
 global:
   - GIT_PAGE_REF: github.com/Limsanity/Limsanity.github.io.git
   - secure: "<第4步生成的加密key>"
```

## 完整的配置文件

```
language: node_js
node_js: stable

cache:
  directories:
    - node_modules

install:
  - npm install

script:
  - npx vuepress build blog

after_script:
  - cd blog/.vuepress/dist
  - git init
  - git add -A
  - git commit -m 'deploy'
  - git push --force --quiet "https://$GH_Token@${GIT_PAGE_REF}" master:master

env:
  global:
    - GIT_PAGE_REF: github.com/Limsanity/Limsanity.github.io.git
```

