const { resolve, join } = require('path');

const UNKNOW_MODE = 'normal';
// messages

//
const webpack = resolve(__dirname, '..', '..' ,'node_modules', '.bin', 'webpack');
const nodemon = resolve(__dirname, '..', '..' ,'node_modules', '.bin', 'nodemon');

// paths
const APP_ROOT_DIR = process.cwd();
const ROOT_DIR = resolve(__dirname, '..', '..');

const CONFIG_DIR = resolve(__dirname, '..', 'config');
const PROJECT_TEMPLATE_DIR = resolve(__dirname, '..', 'template');

const RECORD_LOG_PATH = `${ROOT_DIR}/bin/store/log.json`;

const IGNORE_ACTIONS = ['upgrade', 'create', 'init'];
const CHECK_INSTALL_FILES = ['package.json', 'smart.config.yml'];


module.exports = {
	webpack,
	nodemon,

	ROOT_DIR,
	CONFIG_DIR,
	PROJECT_TEMPLATE_DIR,

	RECORD_LOG_PATH,

	APP_ROOT_DIR,

	IGNORE_ACTIONS,
	CHECK_INSTALL_FILES,
	UNKNOW_MODE,
};
