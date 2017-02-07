'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parent = exports.tileUrl = exports.tilePath = exports.tileId = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _url = require('url');

var _jive = require('jive');

var _jive2 = _interopRequireDefault(_jive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urlParemeters = void 0;

if (gala != undefined && (typeof gala === 'undefined' ? 'undefined' : _typeof(gala)) === 'object') {
    urlParemeters = {
        parent: _jive2.default.tile.getJiveURL(),
        url: _jive2.default.tile.getAppURL()
    };
} else {
    var gadgets = require('jive/gadgets');
    urlParemeters = gadgets.util.getUrlParameters();
}

// parent: url of a root jive instance (e.g. mysite.com instead of domain-protected apps.mysite.com)
var _urlParemeters = urlParemeters,
    parent = _urlParemeters.parent;

// full tile url prsed as jive object

var tileUrl = (0, _url.parse)(urlParemeters.url, true);

// if called from tile - return tile id
var tileId = void 0;
if (tileUrl.query && tileUrl.query.syn_app) {
    var syn_app = tileUrl.query.syn_app;

    exports.tileId = tileId = tileUrl.query['ref_' + syn_app].split(':')[1];
}

//path that helps address images and other assets
var pathChunks = tileUrl.pathname.split('/');
pathChunks.pop();
var tilePath = pathChunks.join('/');

exports.tileId = tileId;
exports.tilePath = tilePath;
exports.tileUrl = tileUrl;
exports.parent = parent;

var tileProps = { tileId: tileId, tilePath: tilePath, tileUrl: tileUrl, parent: parent };
exports.default = tileProps;
//# sourceMappingURL=tileProps.js.map