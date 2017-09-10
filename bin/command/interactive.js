const inquirer = require('inquirer');
const Log = require('../util/log');
const { APP_ROOT_DIR } = require('../util/constant.js');

// private common
// const configData = {};

class SmartInquire{
	constructor(config) {
		this._configData = Object.assign({}, config); 
	}

	getRootQuestions(config) {
		const questions = {
			type: 'list',
			name: this._rootQuestionName,
			message: 'What do you want to do?',
			choices: []
		};

		let name;

		for (let key in config) {
			name = config[key].active_name;
			questions.choices.push({
				name,
				value: config[key].name || key
			});
		}

		return [questions];
	}

	parseAnswer(answers) {
		let { namesKey, nameValue, childrenData, precomandArg } = this._recordAction;
		let value = answers[namesKey];
		let childConfig = !nameValue ? this._configData[value][this._childQuestionIdentifier] : childrenData;
		let _precomandArg = '';

		if (childConfig && childConfig.precomand) {
			_precomandArg = value + ',';
			value = childConfig.precomand;
		}

		this.setRecord({nameValue: value});
		let info;

		if (childConfig) {
			this.setRecord({prevCommand: value, prevArg: childConfig.arg, precomandArg: _precomandArg, namesKey: childConfig.name, childrenData: childConfig[this._childQuestionIdentifier]});
			return this.setQuerstions(childConfig);
		} else {
			info = this.getInfo(precomandArg + value);
			// Log.info('ending...', info);
		}

		return new Promise((resolve, reject) => {
			if (info) resolve(info);
		});
	}

	getInfo(value) {
		const { prevCommand, prevArg } = this._recordAction;
		if (prevCommand && prevArg) {
			return {name: prevCommand, args: value.split(',').map(v => v.trim()).filter(v => v!== ''), options: []};
		} else {
			return {name: value, args: [] , options: []};
		}
	}

	setRecord(option) {
		this._recordAction = Object.assign(this._recordAction, option);
	}

	setQuerstions(questions) {
		const validate = questions.validate;
		if (validate) {
			questions.validate = (value) => {
				if (!value.split(',').filter(v => v.trim() !== '').length) {
					Log.error('\nValue is not empty.');
					return false;
				}
				return true;
			}
		}

		return inquirer
			.prompt(questions)
			.then(this.parseAnswer.bind(this));
	}

	init() {
		this._rootQuestionName = 'Select Action';
		this._childQuestionIdentifier = 'interactive';
		this._recordAction = {namesKey: this._rootQuestionName, nameValue: null, childrenData: null, prevCommand: null};
	}

	create(test) {
		this.init();
		return this.setQuerstions(this.getRootQuestions(this._configData));
	}
}

module.exports = {
	SmartInquire,
	/**
	 * @params
	 * test {boolean} if false return Promise instance, otherwise return self.
	 */
	smartInquire: (config, test = false) => {
		const inquire = new SmartInquire(config);
		return inquire.create(test);
	}
};
