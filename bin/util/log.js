const colors = require('colors/safe');

// set theme 
colors.setTheme({
  magenta: 'magenta',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'magenta',
  debug: 'blue',
  error: 'red'
});

const transColor = (arguments, type) => arguments.map(str => colors[type](typeof str === 'string' ? str : JSON.stringify(str)));

const Log = {
	error: (...arguments) => {
		console.log(...transColor(arguments, type='error'));
	},

	warn: (...arguments) => {
		console.log(...transColor(arguments, type='warn'));
	},

	log: (...arguments) => console.log(arguments),

	info: (...arguments) => {
		console.log(...transColor(arguments, type='info'));
	},

	process: (...arguments) => {
		console.log(...transColor(arguments, type='magenta'));
	},
};

module.exports = Log;
