var Turboplates = require('./src/turboplates');
var fs = require('fs');

var tpl = new Turboplates(fs.readFileSync('./test/cases/basic-condition-with-expression.html', 'utf8'));

console.log(tpl.toFunction().toString());
