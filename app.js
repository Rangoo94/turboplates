var Turboplates = require('./src/turboplates');
var Bundler = require('./src/turboplates/bundler');
var fs = require('fs');

var tpl = new Turboplates(fs.readFileSync('./test/cases/basic-condition-with-expression.html', 'utf8'));

var bundler = new Bundler({
    'basic': tpl
}, 'baseBundler');

console.log(bundler.toFunction().toString());
