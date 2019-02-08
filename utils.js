'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.unescapeHtmlEntities = unescapeHtmlEntities;
exports.pause = pause;
exports.splitArray = splitArray;
exports.abridge = abridge;
exports.getCacheableImage = getCacheableImage;
exports.findContentImage = findContentImage;
exports.getImagelessHTML = getImagelessHTML;
exports.getContentImage = getContentImage;
exports.jsonCopy = jsonCopy;
exports.isEmptyObject = isEmptyObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jQuery = window.jQuery;

function unescapeHtmlEntities(text) {
    if (typeof text !== 'string') throw new Error('Argument should be a string');

    var temp = document.createElement('div');
    temp.innerHTML = text.replace(/<|&lt;/gi, '‹').replace(/>|&gt;/gi, '›');
    return temp.innerText || temp.textContent;
}

function pause() {
    var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (typeof ms !== 'number') throw new Error('Expected parameter to be a number');
    if (ms < 0) throw new Error("We can't do time travel :) Please input a positive number or 0");
    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

function splitArray(array, chunksNumber) {
    if (!(array instanceof Array)) throw new Error('1st argument should be an array');
    if (typeof chunksNumber !== 'number') throw new Error('1st argument should be an array');
    if (chunksNumber <= 0) return [];
    if (chunksNumber === 1) return array;

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

function abridge(text) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 160;


    if (typeof text !== 'string') {
        throw new Error('"abridge" 1st argument must be a string (' + (typeof text === 'undefined' ? 'undefined' : (0, _typeof3.default)(text)) + ' given)');
    }

    //if it's less than limit - just return it
    if (text.length <= length) return text;

    var newText = text.slice(0, length);

    // if the next symbol is not a whitespace and not a punctuation - remove last word
    if (!text[length].match(/\s|\.|,|:|;|!|\?/)) {

        var words = newText.split(' ');

        //remove last word (cause it can be broken, or too long in case of a link)
        if (words.length > 1) {
            words = words.slice(0, words.length - 1);
        }

        newText = words.join(' ');
    }

    // remove commas and dots from a last word
    newText = newText.replace(/(\.|,|;|:)$/, '');

    return newText + '...';
}

function getCacheableImage(initialImageURL) {
    var imageWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    var thumbnail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


    //return initialImageURL
    if (!initialImageURL) return initialImageURL;

    var jiveStorageResult = initialImageURL.match(/(.+)servlet\/JiveServlet\/(downloadImage|previewBody)\/([\d-]+)\/(.+)/i);

    //console.log('jiveStorageResult', jiveStorageResult)

    if (!jiveStorageResult || !jiveStorageResult[3]) return initialImageURL;

    //get jive image ID from URL
    var imageNumberChunks = jiveStorageResult[3].split('-');
    var imageID = imageNumberChunks[imageNumberChunks.length - 1];

    switch (jiveStorageResult[2]) {
        case 'downloadImage':
            return jiveStorageResult[1] + 'api/core/v3/images/' + imageID + '?width=' + imageWidth + (thumbnail ? '&thumbnail=true' : '');
        case 'previewBody':
            return jiveStorageResult[1] + 'servlet/JiveServlet?bodyImage=true&contentType=image&maxWidth=500&maxHeight=300' + '&binaryBodyID=' + imageID;
    }
}

function findContentImage(contentItem) {
    var defaultImageURL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'regexp';
    var fallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;


    if (!contentItem || !contentItem.content || !contentItem.content.text) return null;

    var image = void 0;

    function getFromApi() {
        if (contentItem.contentImages && contentItem.contentImages.length) {
            return contentItem.contentImages[0].ref;
        } else if (contentItem.thumbnailURL) {
            return contentItem.thumbnailURL;
        }
        return false;
    }

    switch (mode) {
        case 'api':
            // version 1: take from API. Downside: API images list never updates after content creation
            image = getFromApi();
            break;
        case 'jquery':
            //version 2: find image links with jQuery. Downside: it requests all the images content item has
            image = jQuery ? $(contentItem.content.text).find('img').attr('src') : false;
            break;
        case 'regexp':
            //version 3: Find image URLs by regExp
            var images = contentItem.content.text.match(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/im);
            image = images && images[1] ? images[1] : false;
            break;
    }

    if (!image && mode !== 'api' && fallback) {
        image = getFromApi();
    }

    if (!image) image = defaultImageURL;

    return image;
}

function getImagelessHTML(htmlText) {
    return htmlText.replace(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/gim, '');
}

function getContentImage(contentItem) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var defaultOptions = {
        imageWidth: 500,
        defaultImageURL: '',
        mode: 'regexp',
        thumbnail: false
    };

    options = (0, _extends3.default)({}, defaultOptions, options);

    var _options = options,
        imageWidth = _options.imageWidth,
        defaultImageURL = _options.defaultImageURL,
        mode = _options.mode,
        thumbnail = _options.thumbnail;


    return getCacheableImage(findContentImage(contentItem, defaultImageURL, mode), imageWidth, thumbnail);
}

function jsonCopy(obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') return null;
    try {
        return JSON.parse((0, _stringify2.default)(obj));
    } catch (error) {
        console.error('Warning! Argument is not a valid JSON. Details:', error);
    }
}

function isEmptyObject(obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') return null;
    return (0, _keys2.default)(obj).length === 0;
}

var utils = {
    pause: pause,
    unescapeHtmlEntities: unescapeHtmlEntities,
    splitArray: splitArray,
    abridge: abridge,
    getCacheableImage: getCacheableImage,
    findContentImage: findContentImage,
    getContentImage: getContentImage,
    getImagelessHTML: getImagelessHTML,
    jsonCopy: jsonCopy,
    isEmptyObject: isEmptyObject
};

exports.default = utils;
//# sourceMappingURL=utils.js.map