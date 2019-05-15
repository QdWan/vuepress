---
title: '使用gitHook规范commit信息和lint代码'
---

## 使用commitizen

npm init -y

npm i -g commitizen

commitizen init cz-conventional-changelog --save-dev --save-exact

在package.json中会多出以下字段：

```js
"config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
}
```

cz-conventional-changelog是一种commit的adapter，有了这个adapter后git cz可以更加方便。你也可以使用其他changelog，例如：[cz-conventional-commit](https://github.com/pvdlg/cz-conventional-comit)，可以配置一些你所需要的commit格式以及添加emoji。至此就可以使用git cz代替git commit了。

## 添加husky触发git的钩子函数

### 检验commit信息

npm i husky --save-dev

npm i -D @commitlint/cli @commitlint/config-conventional

新建husky.config.js:

```js
module.exports = {
	hooks: {
		'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
	}
}
```

新建commitlint.config.js:

```js
module.exports = {
	extends: [
		"@commitlint/config-conventional"
	],
	rules: {
		"subject-case": [0]
	}
}
```

上面代码就是触发commit-msg钩子，然后使用commitlint进行commit信息的校验。config-conventional规定了commit信息的格式。

### lint代码

npm i -D lint-staged

修改husky.config.js:

```js
module.exports = {
	hooks: {
		'pre-commit': 'lint-staged'
		'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
	}
}
```

新建