const { existsSync, readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

const checkNormalExterTemplate = (appRootPath, projectConfig, identifier = 'page') => {
	const hasExterTemplate = existsSync(`${appRootPath}/templates`);
	const hasPageTemplate = hasExterTemplate && existsSync( `${appRootPath}/templates/${identifier}`);
	const hasIndexJs = hasPageTemplate && (existsSync( `${appRootPath}/templates/${identifier}/index.js`) || existsSync( `${appRootPath}/templates/${identifier}/index.jsx`));
	const isEnabledExterTemplate = projectConfig.enabled_external_template;
	// const isNextAction = hasExterTemplate && isEnabledExterTemplate && hasPageTemplate;
	if (hasPageTemplate && !hasIndexJs) {
		Log.error('Eerror: Not fount index.js or index.jsx file in templates/page folder.');
		return false;
	}
	return hasExterTemplate && isEnabledExterTemplate && hasPageTemplate;
}

module.exports = {
	page: (appRootPath, mode, pages, structureData, projectConfig, page, Log, togglePageFolderNames, parentFolder) =>{
		const isNextAction = checkNormalExterTemplate(appRootPath, projectConfig);

		const pageRootPath = !parentFolder ? `${appRootPath}/${structureData.base}/${structureData.pages}` : `${appRootPath}/${structureData.base}/${structureData.pages}/${parentFolder}`;
		const pageExportRootPath = pageRootPath + `/index.js`;

		const createTemplate = (name, basePath) => {
			if (isNextAction) {
				exec(`cp -r ${appRootPath}/templates/page ${pageRootPath}`);
				exec(`mv ${pageRootPath}/page  ${basePath}`);
			} else {
				execSync(`mkdir ${basePath}`);
				exec(`touch ${basePath}/index.js ${basePath}/style.css`);
			}
		};

		pages.map(pageName => {
			const { lName, uName } = togglePageFolderNames(pageName);
			const basePath = `${pageRootPath}/${lName}`;
			
			if (existsSync(basePath)) {
				Log.error(`Error: '${lName}' folder exist. create failed!`);
				return;
			}
			createTemplate(lName, basePath);
		});
	},

	component: (appRootPath, mode, components, structureData, projectConfig, component, Log, togglePageFolderNames) => {
		const isNextAction = checkNormalExterTemplate(appRootPath, projectConfig, component);
		const componentRootPath = `${appRootPath}/${structureData.base}/${structureData.components}`;

		const createTemplate = (name, basePath) => {
			if (isNextAction) {
				exec(`cp -r ${appRootPath}/templates/component ${componentRootPath}`);
				exec(`mv ${componentRootPath}/component  ${basePath}`);
			} else {
				execSync(`mkdir ${basePath}`);
				exec(`touch ${basePath}/index.js ${basePath}/style.css`);
			}
		};

		components.map(pageName => {
			const { lName, uName } = togglePageFolderNames(pageName);
			const basePath = `${componentRootPath}/${lName}`;
			
			if (existsSync(basePath)) {
				Log.error(`Error: '${lName}' folder exist. create failed!`);
				return;
			}
			createTemplate(lName, basePath);
		});
	}
};