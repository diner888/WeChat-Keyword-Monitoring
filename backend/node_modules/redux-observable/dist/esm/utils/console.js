var deprecationsSeen = {};
export var resetDeprecationsSeen = function () {
    deprecationsSeen = {};
};
var consoleWarn = (typeof console === 'object' && typeof console.warn === 'function')
    ? function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.warn.apply(console, args);
    }
    : function () { };
export var deprecate = function (msg) {
    if (!deprecationsSeen[msg]) {
        deprecationsSeen[msg] = true;
        consoleWarn("redux-observable | DEPRECATION: " + msg);
    }
};
export var warn = function (msg) {
    consoleWarn("redux-observable | WARNING: " + msg);
};
