#!/usr/bin/env node --harmony

const smartConfig = require('./utils/smart-config.js');
const commander = require('./utils/commander.js');
const task = require('./utils/task.js');
const interActive = require('./utils/interactive.js');

const interAactiveHelpDelegate = function(answers){
	console.log(JSON.stringify(answers,null,' '));
	task(smartConfig)[answers.task]();
};

commander(smartConfig,function(commandObj){

	const name = commandObj.name;
	if(commandObj.commanderLength === 0){
		interActive.help(interAactiveHelpDelegate);
		return;
	}
	task(smartConfig)[name]();
});