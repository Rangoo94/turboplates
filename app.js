var Turboplates = require('./src/turboplates');
var fs = require('fs');

var tpl = new Turboplates(fs.readFileSync('./test/cases/basic-condition.html', 'utf8'));

console.log(tpl.toFunction().toString());
