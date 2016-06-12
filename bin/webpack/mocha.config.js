const path = require('path');
const webpack  =require('webpack');

const smartConfig = require('../utils/smart-config.js');

const STRUCTURE = smartConfig.PROJECT_STRUCTURE;

const ROOT_PATH = smartConfig.ROOT_PATH;
const ENTRY_PATH = path.join(ROOT_PATH,STRUCTURE.SRC_DIR.NAME);
const BUILD_PATH  = path.join(ROOT_PATH,STRUCTURE.BUILD_DIR);

const mocha = path.join(__dirname, '..', '..' ,'node_modules', '.bin', 'mocha');

module.exports = {
	target: 'node',
	entry:  mocha + '!' + ENTRY_PATH + '/add.test.js',
	output: {
		path: BUILD_PATH,
		filename: 'bundle.test.js'
	}
};