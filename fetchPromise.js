'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.promiseBatch = exports.promiseRestRequest = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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
                                    if (response.error) reject(response);else resolve(response);
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

    return function promiseBatch(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

exports.promiseOsapiRequest = promiseOsapiRequest;
exports.promiseHttpGet = promiseHttpGet;
exports.promiseHttpPost = promiseHttpPost;
exports.promiseRestGet = promiseRestGet;
exports.promiseRestPost = promiseRestPost;
exports.promiseRestDelete = promiseRestDelete;
exports.promiseRestPut = promiseRestPut;

var _osapi = require('jive/osapi');

var _osapi2 = _interopRequireDefault(_osapi);

require('core-js/fn/object/keys');

require('core-js/fn/array/concat');

require('core-js/fn/array/map');

require('core-js/fn/array/for-each');

var _deprecated = require('./deprecated');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by M. Yegorov on 2016-12-27.
 */

function pause(delay) {
    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, delay);
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
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function promiseHttpGet() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return new _promise2.default(function (resolve, reject) {
        var _osapi$http;

        (_osapi$http = _osapi2.default.http).get.apply(_osapi$http, args).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
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
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function promiseRestGet(href) {
    return new _promise2.default(function (resolve, reject) {
        _osapi2.default.jive.core.get({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

var promiseRestRequest = exports.promiseRestRequest = function promiseRestRequest(href) {
    console.warn('Use of promiseRestRequest is deprecated, use promiseRestGet instead');
    return promiseRestGet(href);
};

function promiseRestPost(href) {
    return new _promise2.default(function (resolve, reject) {
        _osapi2.default.jive.core.post({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function promiseRestDelete(href) {
    return new _promise2.default(function (resolve, reject) {
        _osapi2.default.jive.core.delete({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function promiseRestPut(href) {
    return new _promise2.default(function (resolve, reject) {
        _osapi2.default.jive.core.put({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
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
    promiseOsapiPollingRequest: _deprecated.promiseOsapiPollingRequest,
    promiseBatch: promiseBatch
};

exports.default = fetchPromise;
//# sourceMappingURL=fetchPromise.js.map