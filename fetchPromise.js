'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CurrentPlace = exports.promiseOsapiBatch = exports.promiseRestBatch = exports.promiseRestRequest = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var singleRestBatch = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(items, createBatchEntry) {
        var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var batch, response;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        batch = items.map(function (item, i) {
                            return createBatchEntry(item, i, j);
                        });
                        _context.next = 3;
                        return promiseRestPost('/executeBatch', {
                            type: "application/json",
                            body: batch
                        });

                    case 3:
                        response = _context.sent;
                        return _context.abrupt('return', extractContent(response));

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function singleRestBatch(_x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * promiseOsapiBatch
 *
 * @param entries - any array based on which you want to build a batch
 * @param createBatchEntry - a func that takes a single entry and its index from the array above
 * and returns an object with the fields "id" and "request". "id" should be a unique id of the
 * request and "request" should be an OSAPI executable
 * @returns {Promise<Array>}
 */


var promiseBatch = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'rest';
        var entries = arguments[1];
        var createBatchEntry = arguments[2];
        var optionsArgument = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var defaultOptions, options, maxEntriesPerBatch, entryArrays, results, response, i;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        defaultOptions = {
                            maxEntries: 25
                        };
                        options = (0, _extends3.default)({}, defaultOptions, optionsArgument);

                        //console.time('batch')

                        //no more than 25! Jive hard limit

                        maxEntriesPerBatch = options.maxEntries < 25 ? options.maxEntries : 25;

                        if (!(entries.length <= maxEntriesPerBatch)) {
                            _context2.next = 16;
                            break;
                        }

                        if (!(type === 'osapi')) {
                            _context2.next = 10;
                            break;
                        }

                        _context2.t0 = batchObjectToArray;
                        _context2.next = 8;
                        return singleOsapiBatch(entries, createBatchEntry);

                    case 8:
                        _context2.t1 = _context2.sent;
                        return _context2.abrupt('return', (0, _context2.t0)(_context2.t1));

                    case 10:
                        if (!(type === 'rest')) {
                            _context2.next = 14;
                            break;
                        }

                        _context2.next = 13;
                        return singleRestBatch(entries, createBatchEntry);

                    case 13:
                        return _context2.abrupt('return', _context2.sent);

                    case 14:
                        _context2.next = 38;
                        break;

                    case 16:
                        entryArrays = (0, _utils.splitArray)(entries, Math.ceil(entries.length / maxEntriesPerBatch));
                        results = [];
                        response = false;
                        i = 0;

                    case 20:
                        if (!(i < entryArrays.length)) {
                            _context2.next = 37;
                            break;
                        }

                        if (!(type === 'osapi')) {
                            _context2.next = 26;
                            break;
                        }

                        _context2.next = 24;
                        return singleOsapiBatch(entryArrays[i], createBatchEntry, i);

                    case 24:
                        response = _context2.sent;

                        results = results.concat(batchObjectToArray(response));

                    case 26:
                        if (!(type === 'rest')) {
                            _context2.next = 31;
                            break;
                        }

                        _context2.next = 29;
                        return singleRestBatch(entryArrays[i], createBatchEntry, i);

                    case 29:
                        response = _context2.sent;

                        results = results.concat(response);

                    case 31:
                        if (!(i < entryArrays.length - 1)) {
                            _context2.next = 34;
                            break;
                        }

                        _context2.next = 34;
                        return (0, _utils.pause)((i + 1) % 4 === 0 ? 11000 : 1000);

                    case 34:
                        i++;
                        _context2.next = 20;
                        break;

                    case 37:
                        return _context2.abrupt('return', results);

                    case 38:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function promiseBatch() {
        return _ref2.apply(this, arguments);
    };
}();

var promiseRestBatch = exports.promiseRestBatch = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(entries, createBatchEntry) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return promiseBatch('rest', entries, createBatchEntry, options);

                    case 2:
                        return _context3.abrupt('return', _context3.sent);

                    case 3:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function promiseRestBatch(_x8, _x9) {
        return _ref3.apply(this, arguments);
    };
}();

var promiseOsapiBatch = exports.promiseOsapiBatch = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(entries, createBatchEntry) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return promiseBatch('osapi', entries, createBatchEntry, options);

                    case 2:
                        return _context4.abrupt('return', _context4.sent);

                    case 3:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function promiseOsapiBatch(_x11, _x12) {
        return _ref4.apply(this, arguments);
    };
}();

exports.extractContent = extractContent;
exports.promiseOsapiRequest = promiseOsapiRequest;
exports.promiseHttpGet = promiseHttpGet;
exports.promiseHttpPost = promiseHttpPost;
exports.promiseRestGet = promiseRestGet;
exports.promiseRestPost = promiseRestPost;
exports.promiseRestDelete = promiseRestDelete;
exports.promiseRestPut = promiseRestPut;

require('core-js/fn/object/keys');

require('core-js/fn/array/concat');

require('core-js/fn/array/map');

require('core-js/fn/array/for-each');

var _deprecated = require('./deprecated');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by M. Yegorov on 2016-12-27.
 */

var jive = window.jive;
var osapi = window.osapi;

function extractContent(response) {

    if (!response.content) return response;

    if (response.content.id !== undefined) return response.content;
    if (response.content instanceof Array) return response.content;
    if (response.content.list) return response.content;

    return response;
}

function promiseOsapiRequest(osapiRequestFunc) {
    return new _promise2.default(function (resolve, reject) {

        var request = typeof osapiRequestFunc === 'function' ? osapiRequestFunc(osapi.jive.corev3) : osapiRequestFunc;

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

        (_osapi$http = osapi.http).get.apply(_osapi$http, args).execute(function (response) {
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

        (_osapi$http2 = osapi.http).post.apply(_osapi$http2, args).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function promiseRestGet(href) {

    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1];
    }

    return new _promise2.default(function (resolve, reject) {
        osapi.jive.core.get({
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

/**
 *
 * @param href
 * @param options - body, type, etc
 * @returns {Promise<any>}
 */
function promiseRestPost(href) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1];
    }

    return new _promise2.default(function (resolve, reject) {
        osapi.jive.core.post((0, _extends3.default)({
            v: 'v3',
            href: href
        }, options)).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function promiseRestDelete(href) {

    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1];
    }

    return new _promise2.default(function (resolve, reject) {
        osapi.jive.core.delete({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function promiseRestPut(href) {

    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1];
    }

    return new _promise2.default(function (resolve, reject) {
        osapi.jive.core.put({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function singleOsapiBatch(entries, createBatchEntry) {
    var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return new _promise2.default(function (resolve, reject) {

        var batch = osapi.newBatch();

        entries.forEach(function (entry, i) {
            var _createBatchEntry = createBatchEntry(entry, i, j),
                _createBatchEntry2 = (0, _slicedToArray3.default)(_createBatchEntry, 2),
                id = _createBatchEntry2[0],
                executable = _createBatchEntry2[1];

            batch.add(id, executable);
        });

        batch.execute(function (response) {
            if (response.error) reject(response);else resolve(response);
        });
    });
}

function batchObjectToArray(batchResponse) {
    //console.log('batchObjectToArray', batchResponse)

    return (0, _keys2.default)(batchResponse).map(function (key) {

        var returnObject = {
            id: key,
            status: typeof batchResponse[key].status === "number" ? batchResponse[key].status : 200
        };

        if (batchResponse[key].error) {
            returnObject.error = batchResponse[key].error;
        } else {
            returnObject.data = extractContent(batchResponse[key]);
        }

        return returnObject;
    });
}

var CurrentPlace = exports.CurrentPlace = function () {
    function CurrentPlace() {
        var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._filter;
        (0, _classCallCheck3.default)(this, CurrentPlace);
        this.place = false;

        this.filter = filter;
    }

    (0, _createClass3.default)(CurrentPlace, [{
        key: '_filter',
        value: function _filter(rawPlace) {
            return {
                id: rawPlace.placeID,
                uri: rawPlace.resources.self.ref,
                html: rawPlace.resources.html.ref,
                name: (0, _utils.unescapeHtmlEntities)(rawPlace.name),
                type: 'place'
            };
        }
    }, {
        key: 'fetch',
        value: function fetch() {
            var _this = this;

            return new _promise2.default(function (resolve) {

                if (_this.place) {
                    resolve(_this.place);
                    return null;
                }

                jive.tile.getContainer(function (place) {
                    _this.place = _this.filter(place);
                    resolve(_this.place);
                });
            });
        }
    }]);
    return CurrentPlace;
}();

//export const currentPlace = new CurrentPlace()

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
    promiseOsapiBatch: promiseOsapiBatch,
    promiseRestBatch: promiseRestBatch,
    CurrentPlace: CurrentPlace,
    extractContent: extractContent
    //currentPlace,
};

exports.default = fetchPromise;
//# sourceMappingURL=fetchPromise.js.map