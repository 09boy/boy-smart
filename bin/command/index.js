const program = require('commander');
const Log = require('../util/log.js');
const { isObject } = require('../util');

// callback for options
const range = val => val.split('..').map(Number);

const list = val => val.split(',');

const collect = (val, memo) => {
	memo.push(val);
  return memo;
};

const increaseVerbosity = val => (total + 1);
const transformCallbacks = {'parseInt': parseInt};

// private
const configData = {};
let resultValue;

class SmartCommand {
	constructor(config) {
		Object.assign(configData, config); 
		this.program = program;
	}

	get info() { return resultValue; }

	unknowCommand() {
		this.program.action(value => {
			Log.warn('Warning: Unknow Command 😢');
			// program.help();
			process.exit(1);
		});
	}

	parseCommand(data, testArgv = null /* for unit test */) {
		const {name, valueRange, optionKeys} = data;
		const argv = testArgv || process.argv, options = {}, args = [];

		let startArg;
		argv.map((value, index) => {
			startArg = value == name ? true : value.charAt(0) === '-'/*value.indexOf('-') > -1*/ ? false : startArg;
			if (startArg && value !== name) {
				args.push(value);
			} else if (Array.isArray(optionKeys)) {
				optionKeys.map(obj => {
					if (Object.values(obj).indexOf(value) > -1) { options[obj.fName] = argv[index + 1]; }
				});
			}
		});

		// check in args
		if (valueRange && args.some(value => valueRange.indexOf(value) < 0)) {
			Log.error(`Error: The ${name} command argument value is among the [${valueRange}].`);
			Log.log(`You can do it like this: 'smart ${name} ${valueRange[0]}'`);
			process.exit(1);
		}

		// name is a commander-name;
		resultValue = {name, args, options};
		Log.info('result: ', resultValue, valueRange)
	}

	option(config, target) {
		const {name, des, callback} = config;
		target.option(name, des, transformCallbacks[callback]);
	}

	setCommand(config) {
		let optionKeys;
		const {des, name, args, valueRange, options} = isObject(config) ? config : {};
		const pro = this.program.command(`${name} ${args}`).description(des);
		if (Array.isArray(options)) { optionKeys = this.initOptionData(options, pro); }
		
		const argData = {name, valueRange, optionKeys};
		pro.action(() => { this.parseCommand(argData); });
	}

	initOptionData(options, target = program) {
		if (!Array.isArray(options)) return false;
		const optionKeys = [];
		options.forEach(item => {
			const name = item.name;
			const sValue = name.match(/\-(.*?)\,/i)[1];
			const fValues = name.match(/\--(.*?)\ /i);
			this.option(item, target);
			optionKeys.push({s: `-${sValue}`, sName: sValue, f: fValues[0].trim(), fName: fValues[1]});
		});

		return optionKeys;
	}

	initCommandData(Commands) {
		if (!isObject(Commands)) return false;
		for (let name in Commands) {
			const children = Commands[name].children;
			if (Array.isArray(children)) {
				children.map(childCommand => this.setCommand(childCommand));
				continue;
			}
			this.setCommand(Commands[name]);
		}
	}

	init() {
		const { Version, Options, Commands } = configData;
		this.program.version(Version);
		this.initOptionData(Options);
		this.initCommandData(Commands);
		this.unknowCommand();
		this.program.parse(process.argv);
		// mocha test erro if no checking
		// if (process.argv[1].indexOf('/_mocha') < 0 && process.argv.indexOf('--watch') < 0) this.program.parse(process.argv);
	}

	create(test) {
		this.init();
		return !test ? new Promise((resolve, reject) => {
			resolve(resultValue)
		}) : this;
	}
}

module.exports = {
	SmartCommand,
	/**
	 * @params
	 * test {boolean} if false return Promise instance, otherwise return self.
	 */
	smartCli: (config, test = false) => {
		const cli = new SmartCommand(config);
		return cli.create(test);
	}
};
