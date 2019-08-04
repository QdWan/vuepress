const { getFiles } = require('vuepress-file-complete')

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
					{ text: 'Web2', link: '/Web2/' },
					{ text: 'Environment Setting', link: '/EnvironmentSetting/' },
					{ text: 'System Analysis', link: '/SystemAnalysis/' }
				] 
			},
			{ text: 'Github', link: 'https://github.com/Limsanity' },
		],
		sidebar: {
			'/Web/': [
				{
					title: 'Web',
					collapsable: false,
					children: getFiles('blog/Web')
				}
			],
			'/Web2/': [
				{
					title: 'Web2',
					collapsable: false,
					children: getFiles('blog/Web2')
				}
			],
			'/EnvironmentSetting/': [
				{
					title: '环境配置',
					collapsable: false,
					children: [
						'VuePress搭建',
						'CentOS下Web环境搭建'
					]
				}
			],
			'/SystemAnalysis/': [
				{
					title: '系统分析',
					collapsable: false,
					children: [
						'homework1',
						'homework2',
						'homework3',
						'homework4',
						'homework5',
						'homework6'
					]
				}
			],
			'/': [
				{
					title: '主页',
					collapsable: false
				}
			]
		}
	},
	head: [
		['link', { rel: 'manifest', href: '/manifest.json' }],
		['link', { rel: 'apple-touch-icon', href: '/zelda.png' }]
	],
	serviceWorker: true,
	ga: 'UA-139863230-2'
}