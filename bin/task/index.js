const Log = require('../util/log.js');
const constant = require('../util/constant');
const server = require('../server');
const { smartTool } = require('./tool.js');
const { webpack,  nodemon, ROOT_DIR, APP_ROOT_DIR, IGNORE_ACTIONS, CONFIG_DIR } = constant;

require('shelljs/global');

let beginTime;

class Task {
	constructor(smartConfig, record) {
		this.__httpServer = null;
		this.__smartConfig = smartConfig;
		this.record = record;
		this.tool = smartTool(this.record);
		this.shutdown = this.shutdown.bind(this);
		process.on('SIGINT', this.shutdown).on('beforeExit', this.shutdown);
	}

	shutdown() {
		if (beginTime) {
			Log.info(`**** It is taken your ${new Date().getTime() - beginTime}ms to build code. ****`);
		}
		// Add shutdown logic here;
	  Log.info('Received SIGINT.  Press Control-C to exit.');
	  if (this.__httpServer) this.__httpServer.close();
	  this.record.modifyRecordItem({status: 'Press Control-C to exit | BeforeExit.'});
	  process.exitCode = 1;
	  setTimeout(process.exit, 100);
	}

	init(cliData) {
		this.tool.initApp({project_name: cliData.args[0], mode: cliData.options.mode || 'normal', action: cliData.name});
	}

	install(cliData, projectConfig) {
		this.tool.install(projectConfig.dev_structure_dir);
	}

	server(cliData, projectConfig) {
		this.__httpServer = server.start(projectConfig, Object.assign({}, cliData.options, {mode: this.tool.record.mode}));
	}

	create(cliData, projectConfig) {
		this.tool.createProject(cliData, projectConfig);
	}

	start(cliData, projectConfig) {
		process.env.MODE = 'start';
		process.env.NODE_ENV = 'development';
		if (!this.tool.isInstalled) this.tool.install(projectConfig.dev_structure_dir);
		this.__httpServer = server.start(projectConfig, Object.assign({}, cliData.options, {mode: this.tool.record.mode}), false);
	}

	build(cliData, projectConfig) {
		process.env.NODE_ENV = 'production';
		process.env.MODE = cliData.args[0];
		this.record.modifyRecordItem({smartConfig: this.__smartConfig});
		setTimeout(() => {
			beginTime = new Date().getTime();
			exec(`${webpack} --config ${ROOT_DIR}/bin/webpack/config.js --env=prod --hide-modules=true`); // --progress --profile --colors
		}, 10); // fix bug:  for same time to read File
	}

	page(cliData, projectConfig) {
		this.tool.createPage({pages: cliData.args, mode: cliData.options.mode || this.tool.record.mode || 'normal'}, projectConfig);
	}

	component(cliData, projectConfig) {
		this.tool.createComponent({components: cliData.args, mode: cliData.options.mode || this.tool.record.mode || 'normal'}, projectConfig);
	}

	del(cliData) {
		const dirname = cliData.args[0];
		exec(`rm -R ${dirname}`);
		this.record.deleteRecordItem(`${APP_ROOT_DIR}/${dirname}`);
		Log.process(`'${dirname}' folder is deleted.`);
	}

	upgrade() {
		exec(`cd ${ROOT_DIR} && git pull origin master`);
	}

	action(cliData, projectConfig) {
		// check in commander
		let action = cliData.name;

		if (/*action.indexOf('.') > -1*/action.indexOf('-') > -1) {
			const atypes = action.split('-');//action.split('.');
			action = atypes[0];
			cliData.actionType = atypes[1];
		}
		
		const targetRecordItem = this.record.getRecordItem(APP_ROOT_DIR);
		if (targetRecordItem && targetRecordItem.status !== action) {
			Log.error('Modify record');
			this.record.modifyRecordItem({status: action, action: action});
		}/* else if (this.tool.isExistInstallFile && !targetRecordItem) {
			Log.error('Error: Installation files is invalid. 😄. you can use CLI to create, rather than to copy.');
			return;
		}*/

		console.log('action:: ', action)
		this[action](cliData, projectConfig);
	}
}

module.exports = {
	Task,
	smartTask: (smartConfig, record) => new Task(smartConfig, record)
};
