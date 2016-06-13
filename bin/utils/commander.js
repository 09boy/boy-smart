const program = require('commander');

const commandLines = [{name: 'start',description: 'Start local server. development env'},
											{name: 'test',description: 'Start local server. test code with mocha and chai'},
											{name: 'release <devel-or-public-or-production>',description: 'deplory'},
											{name: 'page <page-name>',description: 'create html-page'},
											{name: 'component <component-name>',description: 'create React-component'},
										 ];

const getOption = function(name){
	return {name:name,commanderLength: program.args.length,port:program.port,host:program.host};
};

const createCommanders = function(data,callback){

	data.forEach(function(obj){
		program
			.command(obj.name)
			.description(obj.description)
			.action(function(){

				const argsLen = program.args.length;
				var name = null;
				if(argsLen > 1){
					
					const testFind = program.args[1];
					if( testFind && typeof testFind.name === 'function' && (testFind.name() !== 'start' || testFind.name() !== 'test')){ name = testFind.name(); }else{
						console.log('not support parse multiple commander lines.');
						return;
					}
				}
				callback(getOption(name || program.args[0].name()));
			});
	});
};

const programObject = function(projectConfig,callback){

	const port = projectConfig.PORT;
	const host = projectConfig.HOST;

	program
		.version(projectConfig.SMART_VERSION)
		.option('-P --port <port>','set sever port. default is ' + port,Number,port)
		.option('-H --host <host>', 'set sever host. default is ' + host,host);

	createCommanders(commandLines,callback);
	program.parse(process.argv);
	if(program.args.length === 0){ callback(getOption());}
};

module.exports = programObject;