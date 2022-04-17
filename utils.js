"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

require("core-js/modules/es.object.define-properties.js");

require("core-js/modules/es.object.define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abridge = abridge;
exports["default"] = void 0;
exports.findContentImage = findContentImage;
exports.getCacheableImage = getCacheableImage;
exports.getContentImage = getContentImage;
exports.getImagelessHTML = getImagelessHTML;
exports.isEmptyObject = isEmptyObject;
exports.jsonCopy = jsonCopy;
exports.pause = pause;
exports.sliceArray = sliceArray;
exports.splitArray = splitArray;
exports.unescapeHtmlEntities = unescapeHtmlEntities;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.splice.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.array.find.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.object.keys.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var jQuery = window.jQuery;

function unescapeHtmlEntities(text) {
  if (typeof text !== 'string') throw new Error('Argument should be a string');
  var temp = document.createElement('div');
  temp.innerHTML = text; //.replace(/<|&lt;/gi, '‹').replace(/>|&gt;/gi, '›')

  return temp.innerText || temp.textContent;
}

function pause() {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  if (typeof ms !== 'number') throw new Error('Expected parameter to be a number');
  if (ms < 0) throw new Error('We can\'t do time travel :) Please input a positive number or 0');
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function splitArray(array, chunksNumber) {
  if (!(array instanceof Array)) throw new Error('1st argument should be an array');
  if (typeof chunksNumber !== 'number') throw new Error('2nd argument should be a number');
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

function sliceArray(array, sliceSize) {
  if (!(array instanceof Array)) throw new Error('1st argument should be an array');
  if (typeof sliceSize !== 'number') throw new Error('2nd argument should be a number');
  if (sliceSize <= 0) throw new Error('2nd argument should 1 or more');
  if (sliceSize >= array.length) return [array];
  var sourceArray = (0, _toConsumableArray2["default"])(array);
  var targetArrayOfArrays = [];

  while (sourceArray.length) {
    targetArrayOfArrays.push(sourceArray.splice(0, sliceSize));
  }

  return targetArrayOfArrays;
}

function abridge(text) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 160;

  if (typeof text !== 'string') {
    throw new Error("\"abridge\" 1st argument must be a string (".concat((0, _typeof2["default"])(text), " given)"));
  } //if it's less than limit - just return it


  if (text.length <= length) return text;
  var newText = text.slice(0, length); // if the next symbol is not a whitespace and not a punctuation - remove last word

  if (!text[length].match(/\s|\.|,|:|;|!|\?/)) {
    var words = newText.split(' '); //remove last word (cause it can be broken, or too long in case of a link)

    if (words.length > 1) {
      words = words.slice(0, words.length - 1);
    }

    newText = words.join(' ');
  } // remove commas and dots from a last word


  newText = newText.replace(/(\.|,|;|:)$/, '');
  return newText + '...';
}

function getCacheableImage(initialImageURL) {
  var imageWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  var thumbnail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  //return initialImageURL
  if (!initialImageURL) return initialImageURL;

  if (typeof initialImageURL !== 'string') {
    throw new Error('1st argument should be falsy value or string');
  }

  if (typeof imageWidth !== 'undefined' && typeof imageWidth !== 'number') {
    throw new Error('2nd argument should be a number if defined');
  }

  var jiveStorageResult = initialImageURL.match(/(.+)servlet\/JiveServlet\/(downloadImage|previewBody)\/([\d-]+)\/(.+)/i); //console.log('jiveStorageResult', jiveStorageResult)

  if (!jiveStorageResult || !jiveStorageResult[3]) return initialImageURL; //get jive image ID from URL

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
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'regexp';
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (!contentItem || !contentItem.content || !contentItem.content.text) return null;

  if (typeof mode !== 'undefined' && !['regexp', 'api', 'jquery'].includes(mode)) {
    throw new Error('2nd argument should be "regexp"|"api"|"jquery"');
  }

  var image;

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
      image = jQuery ? jQuery(contentItem.content.text).find('img').attr('src') : false;
      break;

    case 'regexp':
      //version 3: Find image URLs by regExp
      //regexp: <img[^>]*src=["']?([^>"']+)["']?[^>]*>
      var regexp = RegExp('<img[^>]*src=["\']?([^>"\']+)["\']?[^>]*>', 'gim');
      var matches;
      var imagesArray = [];

      while ((matches = regexp.exec(contentItem.content.text)) !== null) {
        if (!matches[0].match(/class=["'][^"']*emoticon-inline/im)) {
          imagesArray.push(matches[1]);
        }
      }

      image = imagesArray.length ? imagesArray[0] : false;
      break;
  }

  if (!image && mode !== 'api' && fallback) {
    image = getFromApi();
  }

  return image;
}

function getImagelessHTML(htmlText) {
  return htmlText.replace(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/gim, '');
}

function getContentImage(contentItem) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaultOptions = {
    imageWidth: 500,
    mode: 'regexp',
    thumbnail: false,
    fallback: true
  };
  options = _objectSpread(_objectSpread({}, defaultOptions), options);
  var _options = options,
      imageWidth = _options.imageWidth,
      mode = _options.mode,
      thumbnail = _options.thumbnail,
      fallback = _options.fallback;
  return getCacheableImage(findContentImage(contentItem, mode, fallback), imageWidth, thumbnail);
}

function jsonCopy(obj) {
  if ((0, _typeof2["default"])(obj) !== 'object') return null;

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Warning! Argument is not a valid JSON. Details:', error);
  }
}

function isEmptyObject(obj) {
  if ((0, _typeof2["default"])(obj) !== 'object') return null;
  return Object.keys(obj).length === 0;
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
var _default = utils;
exports["default"] = _default;
//# sourceMappingURL=utils.js.map
