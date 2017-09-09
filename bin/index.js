#! /usr/bin/env node

const { smartTask } = require('./task');
const { smartCli } = require('./command');
const { smartInquire } = require('./command/interactive.js');
const { CONFIG_DIR, APP_ROOT_DIR } = require('./util/constant.js');
const { loadConfigFiles, parseCliData, record } = require('./util');

loadConfigFiles([/*`${CONFIG_DIR}/smart.config.yml`, */`${APP_ROOT_DIR}/smart.config.yml`, `${CONFIG_DIR}/cli.yml`])
.then(data => {
	const cliConfig = parseCliData(data[1]); //parseCliData(data[2]); // data[2];
	const smartConfig = data[0]; //Object.assign({}, data[0], data[1]);
	const task = smartTask(smartConfig, record);
	smartCli(cliConfig).then(info => info ? task.action(info, smartConfig)
	:
	smartInquire(cliConfig.Commands).then(info => task.action(info, smartConfig)));
});

// Error: Reference "project" does not exist.
// TypeError: path must be a string or Buffer
