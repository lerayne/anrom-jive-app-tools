'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostFilteringLoaderOSAPI = exports.PostFilteringLoaderREST = exports.PostFilteringLoader = undefined;

var _ContinuousLoader = require('./ContinuousLoader');

exports.PostFilteringLoader = _ContinuousLoader.ContinuousLoader;
exports.PostFilteringLoaderREST = _ContinuousLoader.ContinuousLoadJiveREST;
exports.PostFilteringLoaderOSAPI = _ContinuousLoader.ContinuousLoadJiveOSAPI;


var exp = {
  PostFilteringLoader: _ContinuousLoader.ContinuousLoader,
  PostFilteringLoaderREST: _ContinuousLoader.ContinuousLoadJiveREST,
  PostFilteringLoaderOSAPI: _ContinuousLoader.ContinuousLoadJiveOSAPI
};

exports.default = exp;
//# sourceMappingURL=PostFilteringLoader.js.map