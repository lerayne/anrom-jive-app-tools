'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.promiseOsapiPollingRequest = promiseOsapiPollingRequest;

var _fetchPromise = require('./fetchPromise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function promiseOsapiPollingRequest(osapiRequestFunc, filterFunction, targetNumber) {
    var maxIterationCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    console.warn('Use of promiseOsapiPollingRequest is deprecated. Please use ContinuousLoadJiveOSAPI class instead.');

    return new _promise2.default(function (resolve, reject) {

        var list = [];
        var iteration = 0;

        function getNextChunk(executable) {

            iteration++;

            (0, _fetchPromise.promiseOsapiRequest)(executable).then(function (response) {

                var getNextPage = response.getNextPage || false;

                if (!response.list.length) {

                    resolve({ list: list, reason: 'no results' });
                } else {

                    list = [].concat((0, _toConsumableArray3.default)(list), (0, _toConsumableArray3.default)(response.list.filter(filterFunction)));

                    if (list.length >= targetNumber) {

                        resolve({ list: list, getNextPage: getNextPage, reason: 'target number reached (on iteration ' + iteration + ')' });
                    } else {

                        if (maxIterationCount === 0 || iteration <= maxIterationCount) {

                            if (getNextPage) {

                                // recursion here
                                getNextChunk(getNextPage);
                            } else {
                                resolve({ list: list, reason: 'list end reached' });
                            }
                        } else {
                            resolve({ list: list, getNextPage: getNextPage, reason: 'maximum iteration count reached' });
                        }
                    }
                }
            }).catch(reject);
        }

        getNextChunk(osapiRequestFunc);
    });
}
//# sourceMappingURL=deprecated.js.map