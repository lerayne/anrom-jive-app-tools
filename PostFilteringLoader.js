"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PostFilteringLoader", {
  enumerable: true,
  get: function get() {
    return _ContinuousLoader.ContinuousLoader;
  }
});
Object.defineProperty(exports, "PostFilteringLoaderOSAPI", {
  enumerable: true,
  get: function get() {
    return _ContinuousLoader.ContinuousLoadJiveOSAPI;
  }
});
Object.defineProperty(exports, "PostFilteringLoaderREST", {
  enumerable: true,
  get: function get() {
    return _ContinuousLoader.ContinuousLoadJiveREST;
  }
});
exports["default"] = void 0;

var _ContinuousLoader = require("./ContinuousLoader");

var exp = {
  PostFilteringLoader: _ContinuousLoader.ContinuousLoader,
  PostFilteringLoaderREST: _ContinuousLoader.ContinuousLoadJiveREST,
  PostFilteringLoaderOSAPI: _ContinuousLoader.ContinuousLoadJiveOSAPI
};
var _default = exp;
exports["default"] = _default;
//# sourceMappingURL=PostFilteringLoader.js.map
