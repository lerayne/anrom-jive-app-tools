'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.promiseBatch = exports.promiseRestGet = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var promiseBatch = exports.promiseBatch = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(entries, createBatchEntry) {
        var batchObjectToArray, promiseSingleBatch, entryArrays, results, response, i;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        promiseSingleBatch = function promiseSingleBatch(entries, createBatchEntry) {
                            return new _promise2.default(function (resolve, reject) {

                                var batch = _osapi2.default.newBatch();

                                entries.forEach(function (entry, i) {
                                    var _createBatchEntry = createBatchEntry(entry, i),
                                        id = _createBatchEntry.id,
                                        request = _createBatchEntry.request;

                                    batch.add(id, request);
                                });

                                batch.execute(function (response) {
                                    if (response.error) {
                                        reject(response);
                                    } else {
                                        resolve(response);
                                    }
                                });
                            });
                        };

                        batchObjectToArray = function batchObjectToArray(batchResponseObject) {
                            return (0, _keys2.default)(batchResponseObject).map(function (id) {
                                return { id: id, content: batchResponseObject[id] };
                            });
                        };

                        if (!(entries.length <= 30)) {
                            _context.next = 10;
                            break;
                        }

                        _context.t0 = batchObjectToArray;
                        _context.next = 6;
                        return promiseSingleBatch(entries, createBatchEntry);

                    case 6:
                        _context.t1 = _context.sent;
                        return _context.abrupt('return', (0, _context.t0)(_context.t1));

                    case 10:
                        entryArrays = splitArray(entries, Math.ceil(entries.length / 30));
                        results = [];
                        response = false;
                        i = 0;

                    case 14:
                        if (!(i < entryArrays.length)) {
                            _context.next = 24;
                            break;
                        }

                        _context.next = 17;
                        return promiseSingleBatch(entryArrays[i], createBatchEntry);

                    case 17:
                        response = _context.sent;


                        results = results.concat(batchObjectToArray(response));

                        _context.next = 21;
                        return pause((i + 1) % 4 === 0 ? 11000 : 1000);

                    case 21:
                        i++;
                        _context.next = 14;
                        break;

                    case 24:
                        return _context.abrupt('return', results);

                    case 25:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function promiseBatch(_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

exports.promiseOsapiRequest = promiseOsapiRequest;
exports.promiseOsapiPollingRequest = promiseOsapiPollingRequest;
exports.promiseHttpGet = promiseHttpGet;
exports.promiseHttpPost = promiseHttpPost;
exports.promiseRestRequest = promiseRestRequest;
exports.promiseRestPost = promiseRestPost;
exports.promiseRestDelete = promiseRestDelete;
exports.promiseRestPut = promiseRestPut;

var _osapi = require('jive/osapi');

var _osapi2 = _interopRequireDefault(_osapi);

require('core-js/fn/object/keys');

require('core-js/fn/array/concat');

require('core-js/fn/array/map');

require('core-js/fn/array/for-each');

require('regenerator-runtime/runtime');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by M. Yegorov on 2016-12-27.
 */

function pause(delay) {
    return new _promise2.default(function (resolve) {
        setTimeout(resolve, delay);
    });
}

function splitArray(array, chunksNumber) {
    var newArray = [];

    for (var i = 0; i < chunksNumber; i++) {
        newArray.push([]);
    }

    if (array !== undefined && array.length) {
        var chunkLength = Math.ceil(array.length / chunksNumber);

        array.forEach(function (item, i) {
            var chunkNumber = Math.floor(i / chunkLength);
            newArray[chunkNumber].push(item);
        });
    }

    return newArray;
}

function promiseOsapiRequest(osapiRequestFunc) {
    return new _promise2.default(function (resolve, reject) {

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
 * todo: нормальная реализация, если надо сделать загрузку один раз, но будет плохо работать если нужна догрузка:
 * возвращает не запрошенное количество, а больший кусок. Нужно придумать вариант, при котором вместо родного
 * getNextPage используется собственный promiseNextPage, в котором содержатся рекурсия на сам promiseOsapiPollingRequest
 * и остаток списка
 */

function promiseOsapiPollingRequest(osapiRequestFunc, filterFunction, targetNumber) {
    var maxIterationCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    return new _promise2.default(function (resolve, reject) {

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

function promiseHttpGet() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return new _promise2.default(function (resolve, reject) {
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

    return new _promise2.default(function (resolve, reject) {
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

function promiseRestRequest(href) {
    return new _promise2.default(function (resolve, reject) {
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

var promiseRestGet = exports.promiseRestGet = promiseRestRequest;

function promiseRestPost(href) {
    return new _promise2.default(function (resolve, reject) {
        _osapi2.default.jive.core.post({
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

function promiseRestDelete(href) {
    return new _promise2.default(function (resolve, reject) {
        _osapi2.default.jive.core.delete({
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

function promiseRestPut(href) {
    return new _promise2.default(function (resolve, reject) {
        _osapi2.default.jive.core.put({
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

var fetchPromise = {
    promiseHttpGet: promiseHttpGet,
    promiseHttpPost: promiseHttpPost,
    promiseOsapiRequest: promiseOsapiRequest,
    promiseRestGet: promiseRestGet,
    promiseRestPost: promiseRestPost,
    promiseRestPut: promiseRestPut,
    promiseRestDelete: promiseRestDelete,
    promiseRestRequest: promiseRestRequest,
    promiseOsapiPollingRequest: promiseOsapiPollingRequest,
    promiseBatch: promiseBatch
};

exports.default = fetchPromise;
//# sourceMappingURL=fetchPromise.js.map