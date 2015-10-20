var Turboplates = require('./src/turboplates');
var fs = require('fs');

var tpl = new Turboplates(fs.readFileSync('./test/cases/plain-html.html'));
