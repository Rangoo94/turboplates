var Node = require('./turboplates/node');
var utils = require('./utils');

function Turboplates(str, templateName) {
    this.templateName = templateName || 'Template';
    this.rootNode = Node.build(str);
}

Turboplates.prototype.toFunction = function() {
    var str = '';

    return (new Function('return function ' + this.templateName + '(vars) {' + str + '}'))();
};

module.exports = Turboplates;
