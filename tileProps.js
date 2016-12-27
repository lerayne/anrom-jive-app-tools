'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parent = exports.tileUrl = exports.tilePath = exports.tileId = undefined;

var _url = require('url');

var _gadgets = require('jive/gadgets');

var _gadgets2 = _interopRequireDefault(_gadgets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urlParemeters = _gadgets2.default.util.getUrlParameters();

// parent: url of a root jive instance (e.g. mysite.com instead of domain-protected apps.mysite.com)
var parent = urlParemeters.parent;

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
//# sourceMappingURL=tileProps.js.map