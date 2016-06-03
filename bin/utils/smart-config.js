const config = {

	NAME: 'boy-smart',

	SMART_VERSION: '0.0.1',
	ROOT_PATH: process.cwd(),
	PORT: '8080',
	HOST: '127.0.0.1',

	ESLINT: true,

  STATIC: { 										//CDN domain, or just leave it blank if not using

  	START: '',									// here use relative path							
  	DEV: '',										// here use CDN domain
  	RELEASE: ''									// same as above
  },

  API: {												// API ENTRY

  	START: '',									// local api
  	DEV: '', 										// dev api
  	RELEASE: ''									// online api 
  },

	PROJECT_STRUCTURE: {

		BUILD_DIR: 'build',					// production 
		
		SRC_DIR: {									// development
			
			NAME: 'src',							// directory name of src

			ASSETS_DIR: {							// 静态资源目录 js | css | images | fonts 

				NAME: 'assets',

				IMAGES_DIR: 'images',

				FONTS_DIR: 'fonts',

				JS_DIR: 'js',						// 公共 js 模块

				SASS_DIR: 'sass',				// 公共 css 模块
			},

			PAGES_DIR: 'pages',				// 页面
			
			COMPONENTS_DIR: 'components'  // 组件目录
		}
	}
};

module.exports = config;

/*

	├── /build/                              # 代码打包目录
    ├── /node_modules/                      # node依赖包
    ├── /src/                               # 源码目录
    │   ├── /pages/                         # 页面
    │   ├── /components/                    # 公用组件
    │   ├── /assets/                        # 图片、字体资源
    │   ├── /scss/                          # 公用样式    
    │   └── /js/                         		# 公用JS模块
    ├── pepper.config.js                    # pepper的配置文件
    ├── index.template.html                 # 首页HTML模版, 可选
    └── package.json

*/