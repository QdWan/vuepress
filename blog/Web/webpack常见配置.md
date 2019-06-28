## webpack常见配置

通过vue cli创建出来的项目以及有事先设定好的一些webpack配置，可以通过vue提供的命令`vue inspect`进行查看，详见[vue cli官网]([https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F](https://cli.vuejs.org/zh/guide/webpack.html#简单的配置方式))。在这里简要分析一下一些常见loader、plugin的作用，帮助大家日后能够了解如何取扩展和配置webpack环境。为了有更加直观的了解，请看我的基于webpack 3配置搭建的[项目](https://github.com/Limsanity/Clash-Royale-PWA/blob/master/build/)



## Loader

- eslint-loader：检测代码规范，要在babel-loader前启用，添加`enforce: 'pre'`即可，其检查的规范配置文件是项目中的`.eslintrc.js`。
- babel-loader：转译js代码，使得一些低版本的浏览器也能运行开发者写的高级特性的js代码，配置文件是项目中的`.babelrc`，建议换成`babel.config.js`（参考Vue CLI），babel配置文件相关的有preset(预设)，plugins(plugin-transform-runtime)，对于babel的了解，可以参考[babel入门教程](http://www.ruanyifeng.com/blog/2016/01/babel.html)。注意babel-loader不要作用于node_modules模块，因为它的转译很慢，参考webpack配置和vue cli，可以配合cache-loader对转译的结果进行缓存。
- vue-loader：解析.vue文件，支持开发者进行单文件组件的开发模式，其中的vue-style-loader能够将css样式内联进html模版中，同时它在SSR服务端渲染方面也有很大的作用。
- css-loader：处理import的css文件，处理的结果为字符串，vue-style-loader或style-laoder可以将其内联进html中。
- MiniCssExtractPlugin.loader：提取css到单独的css文件中，通常在生产环境下才进行css提取，提取css到单独的文件可以更好的利用缓存机制。
- stylus-loader：处理stylus类型的css预处理器，类似的还有其他的css与处理器loader

## Plugins

- HtmlWebpackPlugin：可以为其指定一个html模版，每次webpack打包完成都会将处理完的资源插入到该html模版中，该插件用处非常棒，例如现代模式构建处理Safari重复下载资源的bug时，就是通过一个plugin配合HtmlWebpackPlugin进行html字符串处理。
- CopyWebpackPlugin：将指定文件复制到webpack指定的输出路径下
- webpack.ProvidePlugin：全局注入变量，对于一些vuex的mapState等方法在很多页面都会使用到，通过全局注入变量，无需在每个页面进行import。为了解决eslint带来的未定义变量的使用的错误提示，要在`.eslintrc`文件中添加一些规则限制，请见项目中的`.eslintrc`
- AutoDllPlugin：生成DLL库，将一些不常见的第三方库单独打包至一个文件中，无需每次构建都打包一次，从而提升打包构建的速度，该配置请看另一个[项目](https://github.com/earnsparemoney/frontend)中的vue.config.js文件。
- AddAssetHtmlPlugin：将指定的资源插入到html文件中，解决一些未被webpack处理的资源无法自动内联到html中的问题。
- workboxPlugin：一个用于快速开发PWA应用的库，详见[workbox](https://developers.google.com/web/tools/workbox/guides/get-started)。
- CleanWebpackPlugin：在构建前将删除指定文件夹，用于每次build的时候，即生产环境。
- MiniCssExtractPlugin：可以指明提取出来的css的文件名称，还有更多其他配置。
- DefinePlugin：定义一些运行时变量，例如process.env。
- vue-server-render plugin：vue服务端渲染相关插件。



## 其他配置

- webpack dev server：用于开发环境下的服务器，能够将webpack处理后的资源用该服务器进行响应，提升开发效率，其还提供了热更新、代理等有用的配置
- optimization：`runtimeChunk: 'single'`将webpack运行时代码提取到一个文件中，optimization常用于提取node_modules下的库。



