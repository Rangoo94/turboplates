var Node = require('./turboplates/node');

var BlockElement = require('./turboplates/elements/block');
var ConditionElement = require('./turboplates/elements/condition');
var ExtendsElement = require('./turboplates/elements/extends');
var ExpressionElement = require('./turboplates/elements/expression');

var utils = require('./utils');

var BLOCK_REGEXP = /(\{%[\t\r\n ]+(end)?([^\t\r\n ]+)([\t\r\n ]*[^\t\r\n ]+)?[\t\r\n ]+%})|((((\{\{[\t\r\n ]*([^\t\r\n ]+)[\t\r\n ]*}}))))/;

function prepareReplacements(str) {
    var arr = str.split(BLOCK_REGEXP);

    var parsed = [];

    parsed.push(arr.shift());

    while (arr.length) {
        if (arr[0] === void 0) {
            arr.shift();
            continue;
        }

        parsed.push(arr.shift());

        if (BLOCK_REGEXP.test(parsed[parsed.length - 1])) {
            // Remove unneeded matches
            arr.splice(0, 4);
        }
    }

    var parsedString = '',
        openedBlocks = [],
        blocks = {},
        currentString = '',
        closingBlock,
        block;

    while (parsed.length) {
        if (openedBlocks.length) {
            currentString += parsed.shift();
        } else {
            parsedString += parsed.shift();
        }

        if (parsed.length) {
            block = parsed.shift().match(BLOCK_REGEXP);

            if (block[0].substr(0, 2) === '{{') {
                // Parse expression
                block = {
                    end: false,
                    name: 'expression',
                    argument: block[9]
                };
            } else {
                block = {
                    end: !!block[2],
                    name: block[3],
                    argument: typeof block[4] === 'string' ? block[4].trim() : block[4],
                    text: ''
                };
            }

            block.id = utils.generateId();

            if (this.elements[block.name] && this.elements[block.name].noClosing) {
                if (openedBlocks.length) {
                    openedBlocks[0].text += currentString + '{' + block.id + '}';
                } else {
                    parsedString += currentString + '{' + block.id + '}';
                }

                currentString = '';
                blocks[block.id] = block;
            } else if (block.end) {
                if (openedBlocks[0].name !== block.name) {
                    throw new Error('Closing `' + block.name + '` when `' + openedBlocks[0].name + '` is still opened');
                }

                closingBlock = openedBlocks.shift();
                closingBlock.text += currentString;

                if (openedBlocks.length) {
                    openedBlocks[0].text += '{' + closingBlock.id + '}';
                } else {
                    parsedString += '{' + closingBlock.id + '}';
                }

                currentString = '';
            } else {
                blocks[block.id] = block;

                openedBlocks.unshift(block);
            }
        }
    }

    if (openedBlocks.length) {
        throw new Error('`' + openedBlocks[0].name + '` is not closed');
    }

    parsedString += currentString;

    var _this = this;
    Object.keys(blocks).forEach(function(id) {
        _this.replacements[id] = blocks[id];

        if (blocks[id].text !== void 0) {
            blocks[id].rootNode = Node.build(blocks[id].text);
        } else {
            blocks[id].rootNode = new Node(null);
        }

        delete blocks[id].text;
    });

    console.log(JSON.stringify(Object.keys(blocks).map(function(b) {
        b = blocks[b];
        return {
            id: b.id,
            name: b.name,
            argument: b.argument,
            rootNode: !!b.rootNode
        };
    }), null, 2));

    console.log('\n\n');

    console.log(parsedString);

    return parsedString;
}

function Turboplates(str, templateName, elements) {
    this.elements = utils.defaults(elements || {}, {
        'if': ConditionElement,
        'block': BlockElement,
        'extends': ExtendsElement,
        'expression': ExpressionElement
    });

    this.replacements = {};
    this.templateName = templateName || 'Template';

    str = prepareReplacements.call(this, str);
    this.rootNode = Node.build(str);
}

Turboplates.prototype.toFunction = function() {
    var str = '';

    return (new Function('return function ' + this.templateName + '(vars) {' + str + '}'))();
};

module.exports = Turboplates;
