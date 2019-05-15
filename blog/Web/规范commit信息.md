---
title: '规范commit信息'
---

`cnpm i -D commitizen cz-conventional-changelog`

```json
// package.json
...
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
}
...
```

`cnpm i -D @commitlint/cli @commitlint/config-conventional husky`

```js
// husky.config.js
module.exports = {
	hooks: {
		'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
	}
}
```

```json
// package.json
...
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
},
"commitlint": {
  "extends": [
    "@commitlint/config-conventional"
  ]
}
...
```

