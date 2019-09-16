# VSCode自定义代码段

- Ctrl + Shift + P
- vue.json

```json
{
	// Place your snippets for vue here. Each snippet is defined under a snippet name and has a prefix, body and 
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the 
	// same ids are connected.
	// Example:
	"vue scaffold": {
		"prefix": "vscaffold",
		"body": [
			"<template>",
			"  <div class=\"$1\">",
			"",
			"  </div>",
			"</template>",
			"",
			"<script lang=\"ts\">",
			"import { Vue, Component } from 'vue-property-decorator'",
			"@Component",
			"export default class $2 extends Vue {$0}",
			"</script>",
			"",
			"<style lang=\"scss\">",
			"</style>"
		]
	},
	"vue typescript": {
		"prefix": "vtypescript",
		"body": [
			"<script lang=\"ts\">",
			"import { Vue } from 'vue-property-decorator'",
			"export default class $1 extends Vue {$0}",
			"</script>"
		],
		"description": "Log output to console"
	}
}
```

