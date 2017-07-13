'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.promiseOsapiRequest = promiseOsapiRequest;
exports.promiseOsapiPollingRequest = promiseOsapiPollingRequest;
exports.promiseRestRequest = promiseRestRequest;
exports.promiseHttpGet = promiseHttpGet;
exports.promiseHttpPost = promiseHttpPost;

var _osapi = require('jive/osapi');

var _osapi2 = _interopRequireDefault(_osapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Created by M. Yegorov on 2016-12-27.
                                                                                                                                                                                                     */

function promiseOsapiRequest(osapiRequestFunc) {
    return new Promise(function (resolve, reject) {

        var request = typeof osapiRequestFunc === 'function' ? osapiRequestFunc(_osapi2.default.jive.corev3) : osapiRequestFunc;

        request.execute(function (response) {
            if (response.error) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

/**
 * todo: нормальная реализация, если надо сделать загрузку один раз, но будте плохо работать если нужна догрузка:
 * возвращает не запрошенное количество, а больший кусок. Нужно придумать вариант, при котором вместо родного
 * getNextPage используется собственный promiseNextPage, в котором содержатся рекурсия на сам promiseOsapiPollingRequest
 * и остаток списка
 */

function promiseOsapiPollingRequest(osapiRequestFunc, filterFunction, targetNumber) {
    var maxIterationCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    return new Promise(function (resolve, reject) {

        var list = [];
        var iteration = 0;

        function getNextChunk(executable) {

            iteration++;

            promiseOsapiRequest(executable).then(function (response) {

                var getNextPage = response.getNextPage || false;

                //todo: собственно начало работы над промисом остатка
                /*const promiseNextPage = function(){
                 return new Promise((resolve2, reject2) => {
                 if (list.length >= targetNumber) {
                   }
                 })
                 }*/

                if (!response.list.length) {

                    resolve({ list: list, reason: 'no results' });
                } else {

                    list = [].concat(_toConsumableArray(list), _toConsumableArray(response.list.filter(filterFunction)));

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

function promiseRestRequest(href) {
    return new Promise(function (resolve, reject) {
        _osapi2.default.jive.core.get({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (response.error) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

function promiseHttpGet() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
        var _osapi$http;

        (_osapi$http = _osapi2.default.http).get.apply(_osapi$http, args).execute(function (response) {
            if (response.error) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

function promiseHttpPost() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    return new Promise(function (resolve, reject) {
        var _osapi$http2;

        (_osapi$http2 = _osapi2.default.http).post.apply(_osapi$http2, args).execute(function (response) {
            if (response.error) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

var fetchPromise = {
    promiseHttpGet: promiseHttpGet,
    promiseHttpPost: promiseHttpPost,
    promiseOsapiRequest: promiseOsapiRequest,
    promiseRestRequest: promiseRestRequest,
    promiseOsapiPollingRequest: promiseOsapiPollingRequest
};

exports.default = fetchPromise;
//# sourceMappingURL=fetchPromise.js.map