'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getContainerAsync = exports.parent = exports.tileUrl = exports.tilePath = exports.tileId = undefined;

var _url = require('url');

var _jive = require('jive');

var _jive2 = _interopRequireDefault(_jive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUrlParemeters = void 0;

if (typeof window.gala != 'undefined') {
    getUrlParemeters = function getUrlParemeters() {
        return {
            parent: _jive2.default.tile.getJiveURL() || '',
            url: _jive2.default.tile.getAppURL() || ''
        };
    };
} else {
    var gadgets = require('jive/gadgets');
    getUrlParemeters = gadgets.util.getUrlParameters;
}

var cache = {};

// full tile url prsed as jive object
var tileUrl = function tileUrl() {
    if (!cache.tileUrl) {
        cache.tileUrl = (0, _url.parse)(getUrlParemeters().url, true);
    }

    return cache.tileUrl;
};

//path that helps address images and other assets
var tilePath = function tilePath() {
    if (!cache.tilePath) {

        var _tileUrl = tileUrl();

        var pathChunks = _tileUrl.pathname ? _tileUrl.pathname.split('/') : [];
        pathChunks.pop();
        cache.tilePath = pathChunks.join('/');
    }

    return cache.tilePath;
};

// if called from tile - return tile id
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
};

// parent: url of a root jive instance (e.g. mysite.com instead of domain-protected apps.mysite.com)
var parent = function parent() {
    if (!cache.parent) {
        cache.parent = getUrlParemeters().parent;
    }

    return cache.parent;
};

var getContainerAsync = function getContainerAsync() {
    return new Promise(function (resolve, reject) {

        if (cache.place) {
            resolve(cache.place);
        } else {
            _jive2.default.tile.getContainer(function (place) {
                cache.place = place;
                resolve(place);
            });
        }
    });
};

exports.tileId = tileId;
exports.tilePath = tilePath;
exports.tileUrl = tileUrl;
exports.parent = parent;
exports.getContainerAsync = getContainerAsync;

var tileProps = { tileId: tileId, tilePath: tilePath, tileUrl: tileUrl, parent: parent, getContainerAsync: getContainerAsync };
exports.default = tileProps;
//# sourceMappingURL=tileProps.js.map