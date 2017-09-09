const YAML = require('yamljs');
const { existsSync, readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const { exec, execSync } = require('child_process');
const Log = require('../util/log.js');
const constant = require('../util/constant.js');
const { ROOT_DIR, CONFIG_DIR, CHECK_INSTALL_FILES, PROJECT_TEMPLATE_DIR, UNKNOW_MODE } = constant;
const { installPackage, page, component }  = require(`${PROJECT_TEMPLATE_DIR}`);

const getDirectories = p => readdirSync(p).filter(f => statSync(`${p}/${f}`).isDirectory());

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

		exec(`touch ${basePath}/${structureData.components}/index.js`);

		switch(this._record.mode) {
			case 'normal':
				// exec(`cp -r ${tempDir}/pages ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/index.js ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/app.js ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/style.scss ${basePath}/${structureData.pages}`);
				exec(`cp ${PROJECT_TEMPLATE_DIR}/index.template.html ${basePath}/${structureData.pages}`);
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
				exec(`cp ${tempDir}/pages/common.style.scss ${basePath}/${structureData.pages}`);
				exec(`cp ${tempDir}/pages/router.config.js ${basePath}/${structureData.pages}`);
				exec(`cp ${PROJECT_TEMPLATE_DIR}/index.template.html ${basePath}/${structureData.pages}`);
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

				exec(`cp ${PROJECT_TEMPLATE_DIR}/index.template.html ${basePath}/${structureData.pages}`);
				break;
		}
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

	checkNormalExterTemplate(projectConfig, identifier = 'page') {
		const hasExterTemplate = this.test(this._appRootPath + '/templates');
		const hasPageTemplate = hasExterTemplate && this.test( `${this._appRootPath}/templates/${identifier}`);
		const hasIndexJs = hasPageTemplate && (this.test( `${this._appRootPath}/templates/${identifier}/index.js`) || this.test( `${this._appRootPath}/templates/${identifier}/index.jsx`));
		const isEnabledExterTemplate = projectConfig.enabled_external_template;
		// const isNextAction = hasExterTemplate && isEnabledExterTemplate && hasPageTemplate;
		if (hasPageTemplate && !hasIndexJs) {
			Log.error('Eerror: Not fount index.js or index.jsx file in templates/page folder.');
			return false;
		}
		return hasExterTemplate && isEnabledExterTemplate && hasPageTemplate;
	}

	normalPage(mode, pages, structureData, projectConfig) {
		const isNextAction = this.checkNormalExterTemplate(projectConfig);

		const pageRootPath = this._appRootPath + `/${structureData.base}/${structureData.pages}`;
		const pageExportRootPath = pageRootPath + `/index.js`;

		const createTemplate = (name, basePath) => {
			if (isNextAction) {
				exec(`cp -r ${this._appRootPath}/templates/page ${pageRootPath}`);
				exec(`mv ${pageRootPath}/page  ${basePath}`);
			} else {
				execSync(`mkdir ${basePath}`);
				exec(`touch ${basePath}/index.js ${basePath}/style.css`);
			}
		};

		pages.map(pageName => {
			const name = pageName.toLocaleLowerCase();
			const firstLetter = name.substr(0, 1);
			const uName = name.replace(firstLetter, firstLetter.toLocaleUpperCase());

			const basePath = `${pageRootPath}/${name}`;
			
			if (this.test(basePath)) {
				Log.error(`Error: '${name}' folder exist. not need to create the page.`);
				return;
			}
			createTemplate(name, basePath);
		});
	}

	reactPage(mode, pages, structureData) {
		// react page
		const pageModes = [];
		const routerPath = this._appRootPath + `/${structureData.base}/${structureData.pages}/router.config.js`;
		const routerLines = readFileSync(routerPath).toString().split('\n');
		const coptyRouterLines = [...routerLines];
		const reducerPath = this._appRootPath + `/${structureData.base}/${structureData.app.base}/${structureData.app.reducers}/index.js`;
		const reducerLines = readFileSync(reducerPath).toString().split('\n');
		const copyReducerLines = [...reducerLines];

		const addReducer = (importStr, reducerStr) => {
			let importEnd = false;
			let isAddImport = false;
			let importLinesCount = 0;
			copyReducerLines.map((line, index) => {
				if (importEnd && !isAddImport) {
					reducerLines.splice(index, 0, ...importStr);
					isAddImport = true;
					importLinesCount = pages.length;
				} else if (line.indexOf('const') > -1 && line.indexOf('rootReducer') > -1) {
					reducerLines.splice(index + importLinesCount + 1, 0, ...reducerStr);
				} 

				importEnd = !importEnd ? line.indexOf('import') < 0 : true;
			});

			writeFileSync(reducerPath, reducerLines.join('\n'));
		};

		const addRouter = (importStr, routerStr) => {
			let defaultHasImport = false;
			let importEnd = false;
			let isAddImport = false;
			let importLinesCount = 0;
			coptyRouterLines.map((line, index) => {
				if (!defaultHasImport && line.indexOf('import') > -1) defaultHasImport = true;
				if (defaultHasImport && importEnd && !isAddImport) {
					routerLines.splice(index, 0, ...importStr);
					isAddImport = true;
					importLinesCount = pages.length;
				} else if (line.indexOf('};') > -1) {
					routerLines.splice(index + importLinesCount, 0, ...routerStr);
				} 

				importEnd = !importEnd ? line.indexOf('import') < 0 : true;
			});

			// need to fix for the first adding data
			if (!defaultHasImport) {
				routerLines.unshift(...importStr, '\n');
			}

			writeFileSync(routerPath, routerLines.join('\n'));
		};

		let importStr = [], reducerStr = [];
		let importRouterStr = [], routerStr = [];
		pages.map(pageName => {
			const name = pageName.toLocaleLowerCase();
			const firstLetter = name.substr(0, 1);
			const uName = name.replace(firstLetter, firstLetter.toLocaleUpperCase());

			const basePath = `${this._appRootPath}/${structureData.base}/${structureData.pages}/${name}`;
			const reduxPath = `${basePath}/redux`;

			// checking exist folder
			// ...
			if (this.test(basePath)) {
				Log.error(`Error: '${name}' folder exist. not need to create the page.`);
				return;
			}

			execSync(`mkdir ${basePath} ${reduxPath}`);
			execSync(`touch ${basePath}/index.js ${basePath}/style.scss ${reduxPath}/actions.js ${reduxPath}/selector.js ${reduxPath}/reducer.js`);

			// for reducer
			importStr.push(`import ${name} from '../../${structureData.pages}/${name}/redux/reducer.js';`);
			reducerStr.push(`\t${name},`);

			// for router
			// importRouterStr.push(`import ${uName}Page from 'async-loader?name=${name}!./${name}';`);
			importRouterStr.push(`import ${uName}Page from './${name}';`);
			routerStr.push(`\t${name}: {`, `\t\tpath: '/${name === 'home' ? '' : name}',`, `\t\tcomponent: ${uName}Page,`, '\t},');
			pageModes.push({basePath, modes: page[mode]({name, uName})});
			// console.log(pageName, name, uName);
		});

		pageModes.map(obj => {
			// update contect
			writeFileSync(obj.basePath + '/index.js', obj.modes.index);
			writeFileSync(obj.basePath + '/redux/selector.js', obj.modes.selector);
			writeFileSync(obj.basePath + '/redux/reducer.js', obj.modes.reducer);
			writeFileSync(obj.basePath + '/redux/actions.js', obj.modes.actions);
		});

		// add reducer
		addReducer(importStr, reducerStr);

		// add router
		addRouter(importRouterStr, routerStr);
	}

	vuePage(mode, pages, structureData) {
		const pageModes = [];
		const routerPath = this._appRootPath + `/${structureData.base}/${structureData.pages}/router.config.js`;
		const routerLines = readFileSync(routerPath).toString().split('\n');
		const coptyRouterLines = [...routerLines];
		const privateModulePath = this._appRootPath + `/${structureData.base}/${structureData.app}/modules/private.modules.js`;
		const privateModuleLines = readFileSync(privateModulePath).toString().split('\n');

		const addPrivateModultToStore = (importStr) => {
			writeFileSync(privateModulePath, privateModuleLines.join('\n'));
		};

		const addRouter = (importStr, routerStr) => {
			let defaultHasImport = false;
			let importEnd = false;
			let isAddImport = false;
			let importLinesCount = 0;
			coptyRouterLines.map((line, index) => {
				if (!defaultHasImport && line.indexOf('import') > -1) defaultHasImport = true;
				if (defaultHasImport && importEnd && !isAddImport) {
					routerLines.splice(index - 1, 0, ...importStr);
					isAddImport = true;
					importLinesCount = pages.length;
				} else if (line.indexOf('];') > -1) {
					routerLines.splice(index + importLinesCount, 0, ...routerStr);
				} 

				importEnd = !importEnd ? line.indexOf('import') < 0 : true;
			});

			// need to fix for the first adding data
			if (!defaultHasImport) {
				routerLines.unshift(...importStr, '\n');
			}

			writeFileSync(routerPath, routerLines.join('\n'));
		};

		let importRouterStr = [], routerStr = [];
		pages.map(pageName => {
			const name = pageName.toLocaleLowerCase();
			const firstLetter = name.substr(0, 1);
			const uName = name.replace(firstLetter, firstLetter.toLocaleUpperCase());

			const basePath = `${this._appRootPath}/${structureData.base}/${structureData.pages}/${name}`;
			const vuexPath = `${basePath}/vuex`;

			// checking exist folder
			// ...
			if (this.test(basePath)) {
				Log.error(`Error: '${name}' folder exist. not need to create the page.`);
				return;
			}

			execSync(`mkdir ${basePath} ${vuexPath}`);
			execSync(`touch ${vuexPath}/module.js`);

			// for module export ModuleHome from 'pages/home/vuex/module';
			privateModuleLines.push(`export Module${uName} from '../../${structureData.pages}/${name}/vuex/module.js';`);

			// // for router
			importRouterStr.push(`const ${uName}Page = () => import('./${name}');`);
			// importRouterStr.push(`import ${uName}Page from './${name}';`);
			routerStr.push(`\t{`, `\t\tpath: '/${name === 'home' ? '' : name}',`, `\t\tname: '${name}',`, `\t\tcomponent: ${uName}Page,`, '\t},');
			pageModes.push({basePath, modes: page[mode]({name, uName})});
		});

		pageModes.map(obj => {
			// update contect
			writeFileSync(obj.basePath + '/index.vue', obj.modes.index);
			writeFileSync(obj.basePath + '/vuex/module.js', obj.modes.localModule);
		});

		// add router
		addRouter(importRouterStr, routerStr);

		// add module
		addPrivateModultToStore();
	}

	createPage(option, projectConfig) {
		const { mode, pages } = option;

		Log.process('Starting to create page...');
		this[mode + 'Page'](mode, pages, projectConfig.dev_structure_dir, projectConfig);
		Log.process('Creating page is completed.');
	}

	normalComponent(mode, components, structureData) {

	}

	reactComponent(mode, components, structureData) {
		const componentRootPath = this._appRootPath + `/${structureData.base}/${structureData.components}`;
		const componentExportRootPath = componentRootPath + `/index.js`;

		const createTemplate = (obj) => {
			execSync(`mkdir ${obj.basePath}`);
			writeFileSync(obj.basePath + '/index.js', obj.modes.index);
			writeFileSync(obj.basePath + '/style.scss', obj.modes.style);
		}

		components.map(componentName => {
			const name = componentName.toLocaleLowerCase();
			const firstLetter = name.substr(0, 1);
			const uName = name.replace(firstLetter, firstLetter.toLocaleUpperCase());

			const basePath = `${componentRootPath}/${name}`;
			
			if (this.test(basePath)) {
				Log.error(`Error: '${name}' folder exist. not need to create the component.`);
				return;
			}
			createTemplate({basePath, modes: component[mode]({name, uName})});
		});
		
		const dirs = getDirectories(componentRootPath);
		const refModes = dirs.map(name => {
			const firstLetter = name.substr(0, 1);
			const uName = name.replace(firstLetter, firstLetter.toLocaleUpperCase());
			return `export ${uName} from './${name}';`;
		}).join('\n');

		writeFileSync(componentExportRootPath, refModes);
	}

	vueComponent(mode, components, structureData) {
		const componentRootPath = this._appRootPath + `/${structureData.base}/${structureData.components}`;
		const componentExportRootPath = componentRootPath + `/index.js`;
		const componentExportLines = readFileSync(componentExportRootPath).toString().split('\n');

		components.map(componentName => {
			const name = componentName.toLocaleLowerCase();
			const firstLetter = name.substr(0, 1);
			const uName = name.replace(firstLetter, firstLetter.toLocaleUpperCase());

			const basePath = `${componentRootPath}/${name}`;
			
			if (this.test(basePath)) {
				Log.error(`Error: '${name}' folder exist. not need to create the component.`);
				return;
			}

			execSync(`mkdir ${basePath}`);
			writeFileSync(basePath + '/index.vue', component[mode]({name, uName}).index);
			componentExportLines.push(`export ${uName} from './${name}';`);			
		});

		writeFileSync(componentExportRootPath, componentExportLines.join('\n'));
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
