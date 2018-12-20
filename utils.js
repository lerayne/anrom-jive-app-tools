'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.unescapeHtmlEntities = unescapeHtmlEntities;
exports.pause = pause;
exports.splitArray = splitArray;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unescapeHtmlEntities(text) {
    var temp = document.createElement('div');
    temp.innerHTML = text;
    return temp.innerText || temp.textContent;
}

function pause(ms) {
    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

function splitArray(array, chunksNumber) {
    var newArray = [];

    for (var i = 0; i < chunksNumber; i++) {
        newArray.push([]);
    }

    if (array !== undefined && array.length) {
        var chunkLength = Math.ceil(array.length / chunksNumber);

        array.forEach(function (item, i) {
            var chunkNumber = Math.floor(i / chunkLength);
            newArray[chunkNumber].push(item);
        });
    }

    return newArray;
}

var utils = {
    pause: pause,
    unescapeHtmlEntities: unescapeHtmlEntities,
    splitArray: splitArray
};

exports.default = utils;
//# sourceMappingURL=utils.js.map