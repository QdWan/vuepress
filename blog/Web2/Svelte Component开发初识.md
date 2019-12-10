# Svelte Component开发初识

[svelte](<https://svelte.dev/>)框架的优点在于编译生成的代码是与框架无关的，这意味着如果使用svelte开发出来的组件可以在Vue、React等场景共用。同时svelte框架也是响应式的，简化了开发效率。

## 项目搭建

使用[svelte app webpack template](<https://github.com/sveltejs/template-webpack>)可以快速创建一个基于webpack打包工具的项目，该模板已经完成了[svelte loader](<https://github.com/sveltejs/svelte-loader>)以及css相关配置。

### 模板配置的修改

#### css提取

```js
{
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: !prod
        }
      },
      'css-loader'
    ]
  }
```

原模版注释中提到miniCssExtractPlugin不支持热更新，但是其CHANGELOG中0.6.0版本已经增加了该功能。通常情况下开发环境无需配置css提取，也可以继续在开发环境使用style-loader，这样就要把项目中public/index.html中引入bundle.css的一行代码去除，否则会报`MIME type`不正确的错误，因为此时内存中根本没有生成css文件，而是生成在js中，动态内联到style标签。

#### 分离svelte-loader配置

项目根目录新建`svelte.config.js`：

```js
// svelte.config.js
// 改配置文件目的有两个：
// 一是将 svelte-loader的options配置单独放在这里
// 二是解决vscode语法解析报错的问题
module.exports = {
  // customElement: true,
  generate: 'dom',
  emitCss: true,
  hotReload: true,
  preprocess: require('svelte-preprocess')({
    scss: {
      includePaths: [
        'node_modules/bemify/sass'
      ]
    }
  })
}
```

该配置文件中：

- `customElement`：可以指定打包的代码执行生成Web Component。
- `generate`：可以指定打包生成的代码执行生成Dom节点。
- `preprocess`：预处理工作，例如：scss、typescript、postcss等都可以在这里配置，详见[svelte-preprocess](<https://www.npmjs.com/package/svelte-preprocess>)。在这个配置文件中配置了scss，并且制定了bemify库的引用路径，这样只需`@import '_bemify.scss'`即可。

#### webpack打包输出格式

```js
// webpack.config.js
...
module.exports = {
  ...
  output: {
    libraryTarget: 'commonjs2'
    ...
  }
  ...
}
```

将输出格式指定为`commonjs2`，在Vue等项目中就能直接import引入，例如：

```vue
// MyComponent.vue
<tempate>
	<div class="svelte-component"></div>
</tempate>

<script>
import SvelteComponent from 'path/bundle.js'; // bundle.js为svelte项目打包生成的代码
export default {
  mounted() {
    new SvelteComponent({
      target: document.querySelector('.svelte-component')
    })
  }
}
</script>
```

#### 更改main.js

```js
// main.js
import App from './App.svelte';
export default App;
```

### 编写并使用简单的svelte component

```vue
/!-- <svelte:options tag="svelte-component" /> 如果是web component要指定tag -->

<div>
  hello world
</div>
```

按照上述步骤完成之后，执行`npm run build`，public文件夹中将会生成bundle.js和bundle.css，你可以通过npm link的方式，也可以复制到vue项目中，然后按上述`MyComponent.vue`的例子引用，将会看到页面生成hello world节点。