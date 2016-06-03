const program = require('commander');

const commandLines = [{name: 'start',description: 'initialize the project'},
											{name: 'test',description: 'initialize the project'},
											{name: 'dev',description: 'initialize the project'},
											{name: 'release',description: 'initialize the project'},
											{name: 'page <page-name>',description: 'initialize the project'},
											{name: 'component <component-name>',description: 'initialize the project'},
										 ];

const getOption = function(name){
	return {name:name,commanderLength: program.args.length,prot:program.port,host:program.host};
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
					if( testFind && typeof testFind.name === 'function' && (testFind.name() === 'page' || testFind.name() === 'component')){ name = testFind.name(); }else{
						console.log('not support parse multiple commander lines.');
						return;
					}
				}
				callback(getOption(name || program.args[0].name()));
			});
	});
};

const programObject = function(projectConfig,callback){

	const prot = projectConfig.PORT;
	const host = projectConfig.HOST;

	program
		.version(projectConfig.SMART_VERSION)
		.option('-P --port <prot>','set sever port. default is ' + prot,Number,prot)
		.option('-H --host <host>', 'set sever host. default is ' + host,host);

	createCommanders(commandLines,callback);
	program.parse(process.argv);
	if(program.args.length === 0){ callback(getOption());}
};

module.exports = programObject;