"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tileUrl = exports.tilePath = exports.tileId = exports.parent = exports.getContainerAsync = exports["default"] = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

var _url = require("url");

var jive = window.jive;
var gadgets = window.gadgets;
var getUrlParemeters = gadgets.util.getUrlParameters;
var cache = {}; // full tile url prsed as jive object

var tileUrl = function tileUrl() {
  if (!cache.tileUrl) {
    cache.tileUrl = (0, _url.parse)(getUrlParemeters().url, true);
  }

  return cache.tileUrl;
}; //path that helps address images and other assets


exports.tileUrl = tileUrl;

var tilePath = function tilePath() {
  if (!cache.tilePath) {
    var _tileUrl = tileUrl();

    var pathChunks = _tileUrl.pathname ? _tileUrl.pathname.split('/') : [];
    pathChunks.pop();
    cache.tilePath = pathChunks.join('/');
  }

  return cache.tilePath;
}; // if called from tile - return tile id


exports.tilePath = tilePath;

var tileId = function tileId() {
  if (!cache.tileId) {
    var _tileUrl = tileUrl();

    var _tileId = false;

    if (_tileUrl.query && _tileUrl.query.syn_app) {
      var syn_app = _tileUrl.query.syn_app;
      _tileId = _tileUrl.query['ref_' + syn_app].split(':')[1];
    }

    cache.tileId = _tileId;
  }

  return cache.tileId;
}; // parent: url of a root jive instance (e.g. mysite.com instead of domain-protected apps.mysite.com)


exports.tileId = tileId;

var parent = function parent() {
  if (!cache.parent) {
    cache.parent = getUrlParemeters().parent;
  }

  return cache.parent;
};

exports.parent = parent;

var getContainerAsync = function getContainerAsync() {
  return new Promise(function (resolve, reject) {
    if (cache.place) {
      resolve(cache.place);
    } else {
      jive.tile.getContainer(function (place) {
        cache.place = place;
        resolve(place);
      });
    }
  });
};

exports.getContainerAsync = getContainerAsync;
var tileProps = {
  tileId: tileId,
  tilePath: tilePath,
  tileUrl: tileUrl,
  parent: parent,
  getContainerAsync: getContainerAsync
};
var _default = tileProps;
exports["default"] = _default;
//# sourceMappingURL=tileProps.js.map
