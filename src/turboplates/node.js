var utils = require('../utils');

var WHITESPACE_REGEXP = /[\r\t\n ]/;

function isWhitespace(char) {
    return WHITESPACE_REGEXP.test(char);
}

function Node(tag, textContent, parentNode) {
    this.id = utils.generateId();
    this.tag = typeof tag === 'string' ? tag.trim().toLowerCase() : tag;
    this.children = [];
    this.textContent = typeof textContent === 'string' ? textContent.trim() : textContent;
    this.attributes = {};
    this.parentNode = parentNode;
}

Node.prototype.addAttribute = function(name, value) {
    this.attributes[name.trim()] = value;
};

Node.prototype.addNode = function(node) {
    if ((node.tag !== null && node.tag !== '') || node.textContent !== '') {
        this.children.push(node);
    }
};

Node.build = function(str) {
    var root = new Node(null);

    var text = '',
        isLastWhitespace = false,
        attributeQuote = false,
        isNode = false,
        isTagName = false,
        currentNode = root,
        attributeName = '',
        tmpNode;

    for (var i = 0; i < str.length; i++) {
        if (!isTagName && !attributeQuote && !isNode && isWhitespace(str[i])) {
            if (!isLastWhitespace) {
                text += ' ';
                isLastWhitespace = true;
            }
            continue;
        }

        isLastWhitespace = false;

        // @TODO: Add more debug things
        if (isNode) {
            if (isTagName) {
                if (text === '' && str[i] === '/') { // @TODO: detect incorrect tagName
                    i = str.indexOf('>', i);
                    isNode = false;
                    isTagName = false;
                    currentNode = currentNode.parentNode;
                } else if (isWhitespace(str[i])) {
                    tmpNode = new Node(text, void 0, currentNode);
                    currentNode.addNode(tmpNode);
                    currentNode = tmpNode;
                    isTagName = false;
                    text = '';
                } else if (str[i] === '>') {
                    if (str[i - 1] === '/') {
                        text = text.substr(0, text.length - 1);
                        currentNode.addNode(new Node(text, null, currentNode));
                    } else {
                        tmpNode = new Node(text, void 0, currentNode);
                        currentNode.addNode(tmpNode);
                        currentNode = tmpNode;
                    }

                    isTagName = false;
                    isNode = false;
                    text = '';
                } else {
                    text += str[i];
                }
            } else if (attributeQuote !== false) {
                if ((attributeQuote === null && isWhitespace(str[i])) || (attributeQuote !== null && str[i] === attributeQuote)) {
                    currentNode.addAttribute(attributeName, text);
                    attributeQuote = false;
                    attributeName = '';
                    text = '';
                } else if (attributeName && str[i] === '>') {
                    currentNode.addAttribute(attributeName, text);
                    text = '';
                    isNode = false;
                    attributeQuote = false;
                    attributeName = '';
                } else {
                    text += str[i];
                }
            } else if (str[i] === '>') {
                if (str[i - 1] === '/') {
                    text = text.substr(0, text.length - 1);
                }

                if (text.length) {
                    currentNode.addAttribute(text, null);
                    text = '';
                }

                if (str[i - 1] === '/') {
                    currentNode = currentNode.parentNode;
                }

                isNode = false;
            } else if (str[i] === '=') {
                attributeName = text;

                if (str[i + 1] === '\'' || str[i + 1] === '\"') {
                    attributeQuote = str[i + 1];
                    i++;
                } else {
                    attributeQuote = null;
                }

                text = '';
            } else if (isWhitespace(str[i])) {
                if (text.length) {
                    currentNode.addAttribute(text, null);
                    text = '';
                }
            } else {
                text += str[i];
            }
        } else if (str[i] === '<') {
            isTagName = true;
            isNode = true;

            if (text.length) {
                currentNode.addNode(new Node(null, text, currentNode));
            }

            text = '';

        } else {
            text += str[i];
        }
    }

    if (text.length) {
        currentNode.addNode(new Node(null, text, currentNode));
    }

    return root;
};

Node.prototype.toObject = function() {
    return {
        tag: this.tag,
        textContent: this.textContent,
        attributes: this.attributes,
        children: this.children.map(function(child) {
            return child.toObject();
        })
    };
};

module.exports = Node;
