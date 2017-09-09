const { writeFile, readFileSync } = require('fs');
const Log = require('../util/log.js');
const { APP_ROOT_DIR, RECORD_LOG_PATH, UNKNOW_MODE } = require('../util/constant.js');

// private: storing Smart Project infomation.
const recordData = {};

class SmartRecord {
	constructor() {
		this.getRecordData();
	}

	get recordKeys() { return Object.keys(recordData); }

	getRecordData() {
		const data = readFileSync(RECORD_LOG_PATH, 'utf8');
		if (!data || Object.keys(data).length === 0) return;
		Object.assign(recordData, JSON.parse(data));
	}

	getRecordItem(basePath) {
		const projectItem = recordData[basePath];
		if (!projectItem) { return; }
		return Object.assign({}, projectItem);
	}

	addRecordItem(basePath = '', data = {project_name: null, mode: UNKNOW_MODE, action: 'unknow'}) {
		if (typeof basePath !== 'string' || basePath.trim() === '') return false;
		if (!data.project_name) data.project_name = basePath.split('/').pop();
		const item = Object.assign({}, {status: 'unknow'}, data);
		recordData[basePath] = item;
		this.record();
		return item;
	}

	modifyRecordItem(item, basePath = APP_ROOT_DIR) {
		const projectItem = recordData[basePath];
		if (!projectItem) { return; }
		Object.assign(recordData, {[basePath]: Object.assign({} ,projectItem, item)});
		this.record();
	}

	deleteRecordItem(basePath) {
		if (!basePath || !recordData[basePath]) { return; }
		// Object.assign(recordData, {[basePath]: Object.assign({} ,recordData[basePath], {status: 'deleted'})});
		delete recordData[basePath];
		this.record();
		return true;
	}

	// save data
	record() {
		this.writeFile(RECORD_LOG_PATH, recordData, null);
	};

	writeFile(path, data) {
		writeFile(path, JSON.stringify(data, null, 2), (err) => {Log.error});
	}
}

module.exports = {
	SmartRecord,
	smartRecord: () => new SmartRecord()
};
