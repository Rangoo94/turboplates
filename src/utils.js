module.exports = {
    defaults: function(obj, defaults) {
        Object.keys(defaults).forEach(function(id) {
            if (obj[id] === void 0) {
                obj[id] = defaults[id];
            }
        });

        return obj;
    },

    time: function() {
        var t = process.hrtime();
        return (t[0] * 1e6 + t[1] / 1e4) / 1e3;
    },

    generateId: function() {
        return '$.' + this.time() + '.' + (Math.random() * 10);
    }
};
