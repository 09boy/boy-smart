const fs = require('fs');
const path = require('path');
const child = require('child_process');

var ROOT_PATH;
var smartName;
var smartConfig;

const copyFile = function(source, target, cb){

  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", done);

  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled && typeof cb === 'function'){
      cb(err);
      cbCalled = true;
    }
  }
};

const checkDirectory = function(dirpath,refRoot){
  refRoot = refRoot || ROOT_PATH;
  try{ fs.statSync(path.join(refRoot,dirpath));}catch(e){ return false;}
  return true;
};

const checkFile = function(filepath){
  try{ fs.readFileSync(path.join(ROOT_PATH,filepath));}catch(e){ return false;}
  return true;
};

const cpObject = function(obj, target){

  for(var k in target){
    if(!obj[k]){
      obj[k] = target[k];
    }
  }
};

const installSmartPackage = function(callback){

  console.log('install boy-smart package....');
  // execSync
  child.exec('npm install --save-dev ' + smartName,function(){
    // done
    console.log('install boy-smart done.');
    createPackageFile(callback);
  });
};

const createPackageFile = function(callback){

  const templatePackagePath = path.join(ROOT_PATH,'node_modules/' + smartName + '/bin/smart-install/package.json');
  const hasPackageFile = checkFile('package.json');

  if(!hasPackageFile){
    console.log('create package file...');
    copyFile(templatePackagePath,path.join(ROOT_PATH,'package.json'));
  }else{
    const smartPackage = require(templatePackagePath);
    const dfPackageFile = require(path.join(ROOT_PATH,'package.json'));
    if(dfPackageFile.isInit){ 
      callback();
      return;
    }
    console.log('merge package.json...');
    cpObject(dfPackageFile.devDependencies, smartPackage.devDependencies);
    cpObject(dfPackageFile.dependencies, smartPackage.dependencies);

    dfPackageFile.isInit = "true";
    //console.log(JSON.stringify(dfPackageFile,null, '  '));
    fs.writeFileSync(path.join(ROOT_PATH,'package.json'),JSON.stringify(dfPackageFile,null, '  '));
  }
  
  console.log('installing dependencies packages...');
  child.exec('npm install',function(){
    console.log('install done.');
    callback();
  });
};

const Smart = {

  initialize: function(_smartConfig,callback){

    callback = callback || function(){};
    smartConfig = _smartConfig;
    ROOT_PATH = smartConfig.ROOT_PATH;
    smartName = smartConfig.NAME;

    // first check package.json file
    // normal, first create package.json then install modules
    // if you created package.json file before installed modules
    const hasPackageFile = checkFile('package.json');

    // 检测 开发目录
    const hasNodeModulesDir = checkDirectory('node_modules');
    //const hasSmartPackage = hasNodeModulesDir ? checkDirectory('node_modules/' + smartName) : false;

    console.log('hasNodeModulesDir  ', hasNodeModulesDir);

    callback();
   // console.log('hasSmartPackage  ', hasSmartPackage);
    
    // if(!hasNodeModulesDir || !hasSmartPackage){ installSmartPackage(callback);}
    // else{ createPackageFile(callback);}
  }
};

module.exports = Smart;