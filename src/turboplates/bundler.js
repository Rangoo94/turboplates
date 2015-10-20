function TurboplatesBundler(templates, bundlerName) {
    this.templates = templates || {};
    this.bundlerName = bundlerName || '';
}

TurboplatesBundler.prototype.toFunction = function() {
    var _this = this,
        str;

    str = 'var templates = {\n';

    var ids = Object.keys(this.templates);

    ids.forEach(function(id) {
        str += JSON.stringify(id) + ':' + _this.templates[id].toFunction().toString() + ',\n';
    });

    if (ids.length) {
        str = str.substr(0, str.length - 2);
    }

    str += '\n};\n';

    str += 'this.create = function(name) {\n' +
           'return new templates[name]();\n' +
           '}\n';

    return (new Function(
        'return function ' + this.bundlerName + '(vars) {\n' +
            str +
        '}'
    ))();
};

module.exports = TurboplatesBundler;
