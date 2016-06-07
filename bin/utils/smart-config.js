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

  	START: '',									// local api  [ develop.example.com ]
  	DEV: '', 										// dev api    [ dev.example.com ]
  	RELEASE: ''									// online api [ example.com ]
  },

	PROJECT_STRUCTURE: {

		BUILD_DIR: 'build',					// production 
		
		SRC_DIR: {									// development
			
			NAME: 'src',							// directory name of src

			ASSETS_DIR: {							// 静态资源目录 js | css | images | fonts 

				NAME: 'assets',

				IMAGES_DIR: 'images',

				FONTS_DIR: 'fonts',

				JS_DIR: 'js',								// 公共 js 模块

				SASS_DIR: 'sass',						// 公共 css 模块
			},

			PAGES_DIR: 'pages',						// 页面目录
			
			COMPONENTS_DIR: 'components', // 组件目录

			TEST_DIR: 'test'              // 单元测试目录
		}
	}
};

module.exports = config;