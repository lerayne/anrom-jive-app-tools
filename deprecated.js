"use strict";

require("core-js/modules/es.object.define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promiseOsapiPollingRequest = promiseOsapiPollingRequest;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.filter.js");

var _fetchPromise = require("./fetchPromise");

function promiseOsapiPollingRequest(osapiRequestFunc, filterFunction, targetNumber) {
  var maxIterationCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  console.warn('Use of promiseOsapiPollingRequest is deprecated. Please use ContinuousLoadJiveOSAPI class instead.');
  return new Promise(function (resolve, reject) {
    var list = [];
    var iteration = 0;

    function getNextChunk(executable) {
      iteration++;
      (0, _fetchPromise.promiseOsapiRequest)(executable).then(function (response) {
        var getNextPage = response.getNextPage || false;

        if (!response.list.length) {
          resolve({
            list: list,
            reason: 'no results'
          });
        } else {
          list = [].concat((0, _toConsumableArray2["default"])(list), (0, _toConsumableArray2["default"])(response.list.filter(filterFunction)));

          if (list.length >= targetNumber) {
            resolve({
              list: list,
              getNextPage: getNextPage,
              reason: "target number reached (on iteration ".concat(iteration, ")")
            });
          } else {
            if (maxIterationCount === 0 || iteration <= maxIterationCount) {
              if (getNextPage) {
                // recursion here
                getNextChunk(getNextPage);
              } else {
                resolve({
                  list: list,
                  reason: 'list end reached'
                });
              }
            } else {
              resolve({
                list: list,
                getNextPage: getNextPage,
                reason: 'maximum iteration count reached'
              });
            }
          }
        }
      })["catch"](reject);
    }

    getNextChunk(osapiRequestFunc);
  });
}
//# sourceMappingURL=deprecated.js.map
