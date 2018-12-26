'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
exports.getContentImage = getContentImage;

var _jquery = require('jive/jquery');

var _jquery2 = _interopRequireDefault(_jquery);

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

function abridge(text) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 160;


    if (typeof text !== 'string') {
        throw new Error('"abridge" 1st argument must be a string (' + (typeof text === 'undefined' ? 'undefined' : (0, _typeof3.default)(text)) + ' given)');
    }

    //if it's less than limit - just return it
    if (text.length <= length) return text;

    //cut text
    text = text.slice(0, length);

    var words = text.split(' ');

    //remove last word (cause it can be broken, or too long in case of a link)
    if (words.length > 1) {
        words = words.slice(0, words.length - 1);
    }

    // remove commas and dots from a last word
    words[words.length - 1] = words[words.length - 1].replace(/\.|,/gi, '');

    return words.join(' ') + '...';
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

function findContentImage(contentItem, defaultImageURL) {
    var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'regexp';


    switch (mode) {
        case 'api':
            // version 1: take from API. Downside: API images list never updates after content creation
            if (contentItem.contentImages && contentItem.contentImages.length) {
                return contentItem.contentImages[0].ref;
            }
            return defaultImageURL;
        case 'jquery':
            //version 2: find image links with jQuery. Downside: it requests all the images content item has
            return _jquery2.default ? $(contentItem.content.text).find('img').attr('src') || defaultImageURL : defaultImageURL;
        case 'regexp':
            //version 3: Find image URLs by regExp
            var images = contentItem.content.text.match(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/im);
            return images && images[1] ? images[1] : defaultImageURL;
        default:
            return defaultImageURL;
    }
}

function getContentImage(contentItem, options) {

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

var utils = {
    pause: pause,
    unescapeHtmlEntities: unescapeHtmlEntities,
    splitArray: splitArray,
    abridge: abridge,
    getCacheableImage: getCacheableImage,
    findContentImage: findContentImage,
    getContentImage: getContentImage
};

exports.default = utils;
//# sourceMappingURL=utils.js.map