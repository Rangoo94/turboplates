var path = require('path');
var fs = require('fs');

var Turboplates = require(path.join(__dirname, '../../src/turboplates'));
var Bundler = require(path.join(__dirname, '../../src/turboplates/bundler'));

var tpl = new Turboplates(fs.readFileSync(path.join(__dirname, 'partials/article.html'), 'utf8'));

var bundler = new Bundler({
    article: tpl
}, 'baseBundler');

fs.writeFileSync(path.join(__dirname, 'templates.js'), 'window.bundler = new ' + bundler.toFunction().toString() + '();');
