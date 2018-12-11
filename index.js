'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.continuousLoader = exports.fetchPromise = exports.tileProps = undefined;

var _tileProps = require('./tileProps');

var _tileProps2 = _interopRequireDefault(_tileProps);

var _fetchPromise = require('./fetchPromise');

var _fetchPromise2 = _interopRequireDefault(_fetchPromise);

var _ContinuousLoader = require('./ContinuousLoader');

var _ContinuousLoader2 = _interopRequireDefault(_ContinuousLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tools = { tileProps: _tileProps2.default, fetchPromise: _fetchPromise2.default, continuousLoader: _ContinuousLoader2.default }; /**
                                                                                                                                     * Created by M. Yegorov on 2016-12-27.
                                                                                                                                     */

exports.tileProps = _tileProps2.default;
exports.fetchPromise = _fetchPromise2.default;
exports.continuousLoader = _ContinuousLoader2.default;
exports.default = tools;
//# sourceMappingURL=index.js.map