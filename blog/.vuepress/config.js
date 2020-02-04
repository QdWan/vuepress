const { getFiles } = require('vuepress-file-complete')

module.exports = {
	title: 'Lim\'s Page',
	description: 'something about front-end',
	plugins: ['@vuepress/pwa'],
	plugins: {
		'@vuepress/pwa': {
			serviceWorker: true,
			updatePopup: {
				message: "New content is available.",
				buttonText: "Refresh"
			}
		}
	},
	themeConfig: {
		nav: [
			{ text: '主页', link: '/' },
			{ text: '博文',
				items: [
					{ text: 'Web', link: '/Web/' },
					{ text: 'Web2', link: '/Web2/' },
					{ text: 'Environment Setting', link: '/EnvironmentSetting/' },
					{ text: 'Kubernetes', link: '/Kubernetes/' },
					{ text: 'Docker', link: '/Docker/' },
					{ text: 'Linux', link: '/Linux/' },
					{ text: 'Nginx', link: '/Nginx/' }
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
					children: getFiles('blog/EnvironmentSetting')
				}
			],
			'/Kubernetes/': [
				{
					title: 'Kubernetes',
					collapsable: false,
					children: getFiles('blog/Kubernetes')
				}
			],
			'/Docker/': [
				{
					title: 'Docker',
					collapsable: false,
					children: getFiles('blog/Docker')
				}
			],
			'/Linux/': [
				{
					title: 'Linux',
					collapsable: false,
					children: getFiles('blog/Linux')
				}
			],
			'/Nginx/': [
				{
					title: 'Nginx',
					collapsable: false,
					children: getFiles('blog/Nginx')
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
		['link', { rel: 'apple-touch-icon', href: '/zelda.png' }],
		['link', { rel: 'apple-touch-icon', sizes: '152x152', href: '/zelda.png' }],
		['link', { rel: 'apple-touch-icon', sizes: '167x167', href: '/zelda.png' }],
		['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/zelda.png' }],
		['link', { rel: 'apple-touch-icon', sizes: '256x256', href: '/zelda.png' }],
		['link', { rel: 'apple-touch-icon', sizes: '512x512', href: '/zelda.png' }]
	],
	serviceWorker: true,
	ga: 'UA-139863230-2'
}