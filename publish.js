'use strict';
var fs = require('fs');

var execSync = require('child_process').execSync;
var packageInfo = require('./package.json');

var version = process.argv.slice(2)[0];

if (!version || version === packageInfo.version) {
    console.log('请输入正确的新的version')
    return;
}
packageInfo.version = version;

fs.writeFileSync('./package.json', JSON.stringify(packageInfo));

let command = `git add package.json && git commit -m \'update package.json version to ${version}\' && git push`;
execSync(command); 
execSync('git tag ' + version);
execSync('git push origin --tag');
execSync('npm publish');
