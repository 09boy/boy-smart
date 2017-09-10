const { existsSync, readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

module.exports = {
	page: (appRootPath, mode, pages, structureData, page, Log, togglePageFolderNames, parentFolder) =>{
		const pageModes = [];
		const rootPagePath = parentFolder ? '/' + parentFolder: '';
		const relativePagePath = `${structureData.base}/${structureData.pages}${rootPagePath}`;
		const pageRootPath = `${appRootPath}/${relativePagePath}`;
		const routerPath = `${appRootPath}/${structureData.base}/${structureData.pages}/router.config.js`;
		const routerLines = readFileSync(routerPath).toString().split('\n');
		const coptyRouterLines = [...routerLines];
		const reducerPath = `${appRootPath}/${structureData.base}/${structureData.app.base}/${structureData.app.reducers}/index.js`;
		const reducerLines = readFileSync(reducerPath).toString().split('\n');
		const copyReducerLines = [...reducerLines];

		const addReducer = (importStr, reducerStr) => {
			let importEnd = false;
			let isAddImport = false;
			let importLinesCount = 0;
			copyReducerLines.map((line, index) => {
				if (importEnd && !isAddImport) {
					reducerLines.splice(index - 1, 0, ...importStr);
					isAddImport = true;
					importLinesCount = pages.length;
				} else if (!parentFolder && line.indexOf('];') > -1) {
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

		let importStr = [], reducerStr = [];
		let importRouterStr = [], routerStr = [];
		pages.map(pageName => {
			const { lName, uName } = togglePageFolderNames(pageName);

			const basePath = `${pageRootPath}/${lName}`;
			const reduxPath = `${basePath}/redux`;

			// checking exist folder
			// ...
			if (existsSync(basePath)) {
				Log.error(`Error: '${lName}' folder exist. create failed!`);
				return;
			}

			execSync(`mkdir ${basePath} ${reduxPath}`);
			execSync(`touch ${basePath}/index.js ${basePath}/style.scss ${reduxPath}/actions.js ${reduxPath}/selector.js ${reduxPath}/reducer.js`);

			// for reducer
			importStr.push(`import ${lName} from '../../${relativePagePath}/${lName}/redux/reducer.js';`);
			reducerStr.push(`\t${lName},`);

			// for router
			// importRouterStr.push(`import ${uName}Page from 'async-loader?name=${lName}!./${lName}';`);
			importRouterStr.push(`import ${uName}Page from '.${rootPagePath}/${lName}';`);
			if (!parentFolder) {
				routerStr.push(`\t{`, `\t\tpath: '/${lName === 'home' ? '' : lName}',`, `\t\tname: '${lName}',`, `\t\tcomponent: ${uName}Page,`, '\t},');
			}
			pageModes.push({basePath, modes: page[mode]({lName, uName})});
			// console.log(pageName, lName, uName);
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
	},

	component: (appRootPath, mode, components, structureData, component, Log, togglePageFolderNames) => {
		const componentRootPath = `${appRootPath}/${structureData.base}/${structureData.components}`;
		const componentExportRootPath = componentRootPath + `/index.js`;
		const componentExportLines = readFileSync(componentExportRootPath).toString().split('\n');

		const createTemplate = (obj) => {
			execSync(`mkdir ${obj.basePath}`);
			writeFileSync(obj.basePath + '/index.js', obj.modes.index);
			writeFileSync(obj.basePath + '/style.scss', obj.modes.style);
			componentExportLines.push(`export ${obj.uName} from './${obj.lName}';`);
		}

		components.map(componentName => {
			const { lName, uName } = togglePageFolderNames(componentName);

			const basePath = `${componentRootPath}/${lName}`;
			
			if (existsSync(basePath)) {
				Log.error(`Error: '${lName}' folder exist. create failed!`);
				return;
			}

			createTemplate({basePath, modes: component[mode]({lName, uName}), lName, uName});			
		});

		writeFileSync(componentExportRootPath, componentExportLines.join('\n'));
	}
};