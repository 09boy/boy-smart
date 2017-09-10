const YAML = require('yamljs');
const { smartRecord } = require('../store/record.js');

const record = smartRecord();

const loadConfigFiles = (paths) => {
	return Promise.all(
		(
			() => {
				return paths.map(path => {
					return new Promise((resolve, reject) => {
						 YAML.load(path, resolve);
					});
				});
			}
		)()
	)
	.then(resp => Promise.all(resp))
};

const parseCliData = (configData) => {
	let data;
	const { init, install, create, server, start, build, page, component, upgrade, del } = configData.Commands;
	const recordItem = record.getRecordItem(process.cwd());
	if (!recordItem) { // new app
		data = {init, create, del, upgrade};
	} else if (recordItem.action === 'init') { //get last action name
		data = {install, start, upgrade};
	} else {
		data = {start, build, server, page, 'page-child': configData.Commands['page-child'], component, upgrade};
	}
	return Object.assign({}, configData, {Commands: data});
};

const S = Object.prototype.toString;
const isObject = param => S.call(param) === '[object Object]';

module.exports = { loadConfigFiles, isObject, parseCliData, record };
