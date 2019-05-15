module.exports = {
	title: 'Lim\'s Page',
	description: 'something about front-end',
	themeConfig: {
		serviceWorker: {
	    updatePopup: { 
	       message: "New content is available.", 
	       buttonText: "Refresh" 
	    }
	  },
		nav: [
			{ text: '主页', link: '/' },
			{ text: '博文',
				items: [
					{ text: 'Web', link: '/Web/' },
					{ text: 'Environment Setting', link: '/EnvironmentSetting/' },
					{ text: 'System Analysis', link: '/SystemAnalysis/' }
				] 
			},
			{ text: 'Github', link: 'https://github.com/Limsanity' },
		],
		sidebar: 
			{
				'/Web/': [
					{
						title: 'Web',
						collapsable: false
					},
					'服务端渲染',
					'项目部署',
					'不使用vue-cli搭建项目',
					'ES6学习笔记',
					'css学习笔记',
					'网站性能优化',
					'HTTP缓存',
					'跨域',
					'闭包',
					'函数柯里化',
					'JS实现轮播图',
					'js内存泄漏',
					'JS继承的几种方式',
					'this的指向',
					'CSRF和XSS',
					'HTTP-HTTPS-HTTP2.0', 
					'Vue中的diff算法',
					'async原理',
					'HTML学习笔记',
					'fetch的用法',
					'待学习',
					'认识url',
					'BOM对象',
					'vue源码学习',
					'vuex原理',
					'HTTP状态码',
					'关于css放顶部和js放底部的一些理解',
					'浏览器多进程和js线程',
					'JS数组遍历和性能比较',
					'单点登录',
					'高性能JS',
					'使用chrome进行真机调试',
					'PWA学习',
					'常用命令',
					'Nginx学习笔记',
					'使用tinypng压缩png图片',
					'工具库',
					'规范commit信息',
					'用Travis CI自动部署Vuepress博客',
					'项目中碰到的问题'
				],
				'/EnvironmentSetting/': [
					{
						title: '环境配置',
						collapsable: false
					},
					'VuePress搭建',
					'CentOS下Web环境搭建'
				],
				'/SystemAnalysis/': [
					{
						title: '系统分析',
						collapsable: false
					},
					'homework1',
					'homework2',
					'homework3',
					'homework4',
					'homework5',
					'homework6'
				],
				'/': [
					{
						title: '主页',
						collapsable: false
					}
				],
			}
		,
		sidebarDepth: 3,
		lastUpdated: 'Last Updated', 
	},
	head: [
		
    //增加manifest.json
		['link', { rel: 'manifest', href: '/manifest.json' }],
		['link', { rel: 'apple-touch-icon', href: '/zelda.png' }]
	],
	serviceWorker: true
}