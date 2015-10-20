var Turboplates = require('../src/turboplates');
var fs = require('fs');
var path = require('path');
var time = require('../src/utils').time;

function benchmark(label, clbk, times) {
    times = times || 1;
    var d = time();

    for (var i = 0; i < times; i++) {
        clbk();
    }

    console.log(label + ': ' + ((time() - d) / times) + 'ms');
}

var cases = path.join(__dirname, 'cases/');

fs.readdirSync(cases).forEach(function(file) {
    benchmark(file, function() {
        new Turboplates(fs.readFileSync(cases + file, 'utf8'));
    }, 100);
});
