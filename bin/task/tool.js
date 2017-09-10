const YAML = require('yamljs');
const { existsSync, readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const { exec, execSync } = require('child_process');
const Log = require('../util/log.js');
const constant = require('../util/constant.js');
const { ROOT_DIR, CONFIG_DIR, CHECK_INSTALL_FILES, PROJECT_TEMPLATE_DIR, UNKNOW_MODE } = constant;
const { installPackage, page, component }  = require(`${PROJECT_TEMPLATE_DIR}`);

const reactProject = require('./react.js');
const vueProject = require('./vue.js');
const normalProject = require('./normal.js');

// const getDirectories = p => readdirSync(p).filter(f => statSync(`${p}/${f}`).isDirectory());

const togglePageFolderNames = pageName => {
	const lName = pageName.toLocaleLowerCase();
	const firstLetter = pageName.substr(0, 1);
	const uName = pageName.replace(firstLetter, firstLetter.toLocaleUpperCase());
	return {lName, uName};
};

class Tool {
	constructor(stRecord, constantConfig = constant) {
		this._appRootPath = constantConfig.APP_ROOT_DIR
		this._smartRecord = stRecord;
		this._record = this._smartRecord.getRecordItem(this._appRootPath);
	}

	test(path) { return existsSync(path.indexOf('/') > -1 ? path : this._appRootPath + '/' + path); }

	get record() { return this._record; }

	get isSmartFrameworkDir() { return ROOT_DIR == this._appRootPath || this._appRootPath.indexOf(ROOT_DIR) > -1; }

	get isExistModules() { return this.test(`${this._appRootPath}/node_modules`); }

	get isExistInstallFile() { return CHECK_INSTALL_FILES.every(file => this.test(`${this._appRootPath}/${file}`)); }

	get isInstalled() { return (this._record || false ) && this.isExistInstallFile && this.isExistModules; }

	get isInChildAppDir() { return (this._record || false) && this._smartRecord.recordKeys.some(p => p !== this._appRootPath && this._appRootPath.indexOf(p) > -1); }

	get isExistSmartProject() { return this.isSmartFrameworkDir || this.isInChildAppDir || this.isExistInstallFile; }

	parseCliData(cliData) {
		const { name, args } = cliData;
		const projectName = args[0];
		const modeName = name.split('-')[1] || UNKNOW_MODE;
		const projectBasePath = `${this._appRootPath}/${projectName}`;
		return {projectName, modeName, projectBasePath, action: name};
	}

	initApp(argv) {
		this.createInstallationFiles(argv);
		this.initRecord(argv);
	}

	install(structureData, projectBasePath) {
		Log.process('Starting to install packages...');
		this.createStructure(structureData);
		if (projectBasePath) {
			exec(`cd ${projectBasePath} && npm install`, () => { Log.process('It is installed successfully.'); });
			if (!this.isExistModules) exec(`mkdir ${projectBasePath}/node_modules`);
		} else {
			exec('npm install', () => { Log.process('It is installed successfully.'); });
			if (!this.isExistModules) exec('mkdir node_modules');
		}
	}

	createInstallationFiles(option) {
		const { mode, project_name } = option;
		if (this.test(`${this._appRootPath}/${project_name}`) || this.isExistSmartProject) {
			Log.warn(`Error: ${project_name} folder exist.`);
			return false;
		}

		const modeData = installPackage[mode];
		if (!modeData) {
			Log.error('TypeError: Not found correct installation package.');
			return false;
		}

		Log.process(`Starting to create installation files in ${project_name} folder...`);

		const projectBasePath = `${this._appRootPath}/${project_name}`;
		const packageData = modeData({name: `smart-project-${project_name}`});
		exec(`mkdir ${projectBasePath}`);
		exec(`cp ${CONFIG_DIR}/${mode}.config.yml ${projectBasePath}`);
		exec(`mv ${projectBasePath}/${mode}.config.yml ${projectBasePath}/smart.config.yml`);
		exec(`touch ${projectBasePath}/package.json`);
		exec(`cp ${PROJECT_TEMPLATE_DIR}/mock.js ${projectBasePath}`);
		this._smartRecord.writeFile(`${projectBasePath}/package.json`, packageData);
		Log.process(`Creating installation files is completed.`);
	}

	createStructure(structureData) {
		if (!structureData || !structureData.base || !this._record || !this._record.project_name) {
			Log.error('TypeError: Argument should be an object.');
			return false;
		}

		const basePath =  this.isExistInstallFile ? this._appRootPath + '/' + structureData.base : this._appRootPath + '/' +  this._record.project_name + '/' + structureData.base;
		if (this.test(basePath)) {
			Log.warn(`Error: ${structureData.base} folder exist.` );
			return false;
		}

		let dirs = basePath;
		for (let key in structureData) {
			if (key !== 'base' &&  key !== 'app') {
				dirs += ` ${basePath}/${structureData[key]}`;
			} else if (this._record.mode === 'react' && key === 'app') {
				const reactDirs = structureData[key];
				const reactBaseDir = `${basePath}/${reactDirs.base}`;
				dirs += ` ${reactBaseDir}`;
				for ( let reKey in reactDirs) {
					if (reKey !== 'base') dirs += ` ${reactBaseDir}/${reactDirs[reKey]}`;
				}
			}
		}

		const tempDir = `${PROJECT_TEMPLATE_DIR}/${this._record.mode}`;
		exec(`mkdir ${dirs}`);

		switch(this._record.mode) {
			case 'normal':
				exec(`cp ${tempDir}/index.js ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/app.js ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/style.scss ${basePath}/${structureData.pages}`);
				exec(`cp -r ${tempDir}/templates ${this._appRootPath}/${this._record.project_name}`);
				break;
			case 'react' :
				const reducerDir = structureData.app.reducers;
				exec(`cp ${tempDir}/reducer.js ${basePath}/app/${reducerDir}`);
				exec(`mv ${basePath}/app/${reducerDir}/reducer.js ${basePath}/app/${reducerDir}/index.js`);
				exec(`cp ${tempDir}/configureStore.js ${basePath}/app/${structureData.app.store}`);
				exec(`cp ${tempDir}/common.actions.js ${basePath}/app/${structureData.app.actions}`);
				exec(`mv ${basePath}/app/${structureData.app.actions}/common.actions.js ${basePath}/app/${structureData.app.actions}/index.js`);
				exec(`cp -r ${tempDir}/demo ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/pages/index.js ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/pages/App.js ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/pages/style.scss ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/pages/router.config.js ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/connect.js ${basePath}/${structureData.utils}`);
				break;
			case 'vue':
				exec(`rm -r ${basePath}/${structureData.pages}`);
				exec(`cp -R ${tempDir}/pages ${basePath}`);

				if (structureData.pages !== 'pages') {
					exec(`mv -r ${basePath}/pages ${basePath}/${structureData.pages}`);
				}

				exec(`rm -r ${basePath}/${structureData.app}`);
				exec(`cp -r ${tempDir}/app ${basePath}`);
				
				if (structureData.app !== 'app') {
					exec(`mv -r ${basePath}/app ${basePath}/${structureData.app}`);
				}
				break;
		}

		exec(`touch ${basePath}/${structureData.components}/index.js`);
		exec(`cp ${PROJECT_TEMPLATE_DIR}/index.template.html ${basePath}/${structureData.pages}`);
	}

	initRecord(item = {}) {
		if (this.isExistInstallFile) {
			Log.warn('Error: Installation files exist. it is not to record info about this time.');
			return false;
		}
		const projectBasePath = this._appRootPath + '/' + item.project_name;
		this._smartRecord.addRecordItem(projectBasePath, item);
		this._record = this._smartRecord.getRecordItem(projectBasePath);
	}

	createProject(cliData, projectConfig) {
		const { projectName, modeName, projectBasePath, action } = this.parseCliData(cliData);
		const recordOption = {project_name: projectName, mode: modeName, action};

		const actionFun = () => {
			const structureData = projectConfig.dev_structure_dir;
			this.initApp(recordOption);
			this.install(structureData, `./${projectName}`);
		};

		if (!projectConfig) {
			YAML.load(`${CONFIG_DIR}/${modeName}.config.yml`, (data) => {
				projectConfig = data;
				actionFun();
			});
			return;
		}

		actionFun();
		// 4. start server
		// return new Promise((resolve, reject) => { console.log('rinima::', this._installStatus)
		// 	if (this._installStatus) resolve(this._installStatus);
		// });
	}

	normalPage(mode, pages, structureData, projectConfig, parentFolder) {
		normalProject.page(this._appRootPath, mode, pages, structureData, projectConfig, page, Log, togglePageFolderNames, parentFolder);
	}

	reactPage(mode, pages, structureData, projectConfig, parentFolder) {
		reactProject.page(this._appRootPath, mode, pages, structureData, page, Log, togglePageFolderNames, parentFolder);
	}

	vuePage(mode, pages, structureData, projectConfig, parentFolder) {
		vueProject.page(this._appRootPath, mode, pages, structureData, page, Log, togglePageFolderNames, parentFolder);
	}

	createPage(option, projectConfig) {
		const { mode, pages } = option;
		Log.process('Starting to create page...');
		this[mode + 'Page'](mode, pages, projectConfig.dev_structure_dir, projectConfig);
		Log.process('Creating page is completed.');
	}

	createChildPage(option, projectConfig) {
		const { mode, pages, parentFolder } = option;
		const parentFolderNames = togglePageFolderNames(parentFolder);
		const structureData = projectConfig.dev_structure_dir;
		const basePath = `${this._appRootPath}/${structureData.base}/${structureData.pages}/${parentFolderNames.lName}`;
		if (!this.test(basePath)) {
			Log.error(`Error: parent folder that name is '${parentFolder}' not exist. create failed!`);
			return;
		}

		Log.process('Starting to create child page...');
		this[mode + 'Page'](mode, pages, projectConfig.dev_structure_dir, projectConfig, parentFolder);
		Log.process('Creating child page is completed.');
	}

	normalComponent(mode, components, structureData, projectConfig) {
		normalProject.component(this._appRootPath, mode, components, structureData, projectConfig, component, Log, togglePageFolderNames);
	}

	reactComponent(mode, components, structureData, projectConfig) {
		reactProject.component(this._appRootPath, mode, components, structureData, component, Log, togglePageFolderNames);
	}

	vueComponent(mode, components, structureData, projectConfig) {
		vueProject.component(this._appRootPath, mode, components, structureData, component, Log, togglePageFolderNames);
	}

	createComponent(option, projectConfig) {
		const { mode, components } = option;

		Log.process('Starting to create component...');
		this[mode + 'Component'](mode, components, projectConfig.dev_structure_dir, projectConfig);
		Log.process('Creating component is completed.');
	}
}

module.exports = {
	Tool,
	smartTool: (stRecord, constantConfig) => new Tool(stRecord, constantConfig),
}
