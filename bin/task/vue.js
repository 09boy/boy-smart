const { existsSync, readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

module.exports = {
	page: (appRootPath, mode, pages, structureData, page, Log, togglePageFolderNames, parentFolder) =>{
		//  __dirname + `/../store/logs/${appRootPath.replace(/[\/]/g, '.').substr(1)}.json`;
		// let routeLogJsonData = readFileSync(__dirname + '/../store/logs/router.json', 'utf8');
		// if (routeLogJsonData == '') { routeLogJsonData = {}; };
		// routeLogJsonData[appRootPath] = routeLogJsonData[appRootPath] || {};
		
		const pageModes = [];
		const rootPagePath = parentFolder ? '/' + parentFolder: '';
		const relativePagePath = `${structureData.base}/${structureData.pages}${rootPagePath}`;
		const pageRootPath = `${appRootPath}/${relativePagePath}`;
		const routerPath = `${appRootPath}/${structureData.base}/${structureData.pages}/router.config.js`;
		const routerLines = readFileSync(routerPath).toString().split('\n');
		const coptyRouterLines = [...routerLines];
		const privateModulePath = `${appRootPath}/${structureData.base}/${structureData.app}/modules/private.modules.js`;
		const privateModuleLines = readFileSync(privateModulePath).toString().split('\n');

		const addPrivateModultToStore = (importStr) => {
			writeFileSync(privateModulePath, privateModuleLines.join('\n'));
		};

		const addRouter = (importStr, routerStr) => {
			let defaultHasImport = false;
			let importEnd = false;
			let isAddImport = false;
			let importLinesCount = 0;
			// let parentRoutBlockStartLines = false;
			// let parentRoutBlockEndLines = false;
			coptyRouterLines.map((line, index) => {
				if (!defaultHasImport && line.indexOf('import') > -1) defaultHasImport = true;
				// if (childPath !== '' && !parentRoutBlockStartLines && line.indexOf(`name: '${parentFolder}'`) > -1) parentRoutBlockStartLines = true;
				// if (parentRoutBlockStartLines && !parentRoutBlockEndLines && line.indexOf(`component`) > -1) parentRoutBlockEndLines = true;

				if (defaultHasImport && importEnd && !isAddImport) {
					routerLines.splice(index - 1, 0, ...importStr);
					isAddImport = true;
					importLinesCount = pages.length;
				} else if (!parentFolder && line.indexOf('];') > -1 && !!routerStr.length) {
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
			const { lName, uName } = togglePageFolderNames(pageName);

			const basePath = `${pageRootPath}/${lName}`;
			const vuexPath = `${basePath}/vuex`;

			// checking exist folder
			// ...
			if (existsSync(basePath)) {
				Log.error(`Error: '${lName}' folder exist. create failed!`);
				return;
			}

			execSync(`mkdir ${basePath} ${vuexPath}`);
			execSync(`touch ${vuexPath}/module.js`);

			privateModuleLines.push(`export Module${uName} from '../../${structureData.pages}${rootPagePath}/${lName}/vuex/module.js';`);

			// for router
			importRouterStr.push(`const ${uName}Page = () => import('.${rootPagePath}/${lName}');`);
			if (!parentFolder) {
				routerStr.push(`\t{`, `\t\tpath: '/${lName === 'home' ? '' : lName}',`, `\t\tname: '${lName}',`, `\t\tcomponent: ${uName}Page,`, '\t},');
			} /*else {
				routerStr.push(`\t\t\t{`, `\t\t\t\tpath: '${lName}',`, `\t\t\t\tname: '${lName}',`, `\t\t\t\tcomponent: ${uName}Page,`, '\t\t\t},');
			}*/
			
			pageModes.push({basePath, modes: page[mode]({lName, uName})});


			// if (!parentFolder) {
			// 	routeLogJsonData[appRootPath][lName] = {
			// 		import: `./${childPath}${lName}`,
			// 		path: lName === 'home' ? '/' : `/${lName}`,
			// 		name: lName,
			// 		component: `${uName}Page`,
			// 		children: []
			// 	};
			// } else {
			// 	routeLogJsonData[appRootPath][parentFolder].children.push({
			// 		import: `./${childPath}${lName}`,
			// 		path: lName,
			// 		name: lName,
			// 		component: `${uName}Page`,
			// 		children: []
			// 	});
			// }
			
		});

		// console.log(routeLogJsonData)

		pageModes.map(obj => {
			// update contect
			writeFileSync(obj.basePath + '/index.vue', obj.modes.index);
			writeFileSync(obj.basePath + '/vuex/module.js', obj.modes.localModule);
		});

		// // add router
		addRouter(importRouterStr, routerStr);

		// // add module
		addPrivateModultToStore();
	},

	component: (appRootPath, mode, components, structureData, component, Log, togglePageFolderNames) => {
		const componentRootPath = `${appRootPath}/${structureData.base}/${structureData.components}`;
		const componentExportRootPath = componentRootPath + `/index.js`;
		const componentExportLines = readFileSync(componentExportRootPath).toString().split('\n');

		components.map(componentName => {
			const { lName, uName } = togglePageFolderNames(componentName);
			const basePath = `${componentRootPath}/${lName}`;
			
			if (existsSync(basePath)) {
				Log.error(`Error: '${lName}' folder exist. create failed!`);
				return;
			}

			execSync(`mkdir ${basePath}`);
			writeFileSync(basePath + '/index.vue', component[mode]({lName, uName}).index);
			componentExportLines.push(`export ${uName} from './${lName}';`);			
		});

		writeFileSync(componentExportRootPath, componentExportLines.join('\n'));
	}
};