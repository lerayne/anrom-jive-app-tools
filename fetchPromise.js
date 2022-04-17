"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

require("core-js/modules/es.object.define-properties.js");

require("core-js/modules/es.object.define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CurrentPlace = void 0;
exports.extractContent = extractContent;
exports.promiseHttpGet = promiseHttpGet;
exports.promiseHttpPost = promiseHttpPost;
exports.promiseOsapiBatch = promiseOsapiBatch;
exports.promiseOsapiRequest = promiseOsapiRequest;
exports.promiseRestBatch = promiseRestBatch;
exports.promiseRestDelete = promiseRestDelete;
exports.promiseRestGet = promiseRestGet;
exports.promiseRestPost = promiseRestPost;
exports.promiseRestPut = promiseRestPut;
exports.promiseRestRequest = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.concat.js");

var _deprecated = require("./deprecated");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
  return new Promise(function (resolve, reject) {
    var request = typeof osapiRequestFunc === 'function' ? osapiRequestFunc(osapi.jive.corev3) : osapiRequestFunc;
    request.execute(function (response) {
      if (response.error) reject(response);else resolve(response);
    });
  });
}

function promiseHttpGet() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var _osapi$http;

    (_osapi$http = osapi.http).get.apply(_osapi$http, args).execute(function (response) {
      if (response.error) reject(response);else resolve(response);
    });
  });
}

function promiseHttpPost() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new Promise(function (resolve, reject) {
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

  return new Promise(function (resolve, reject) {
    osapi.jive.core.get({
      v: 'v3',
      href: href
    }).execute(function (response) {
      if (response.error) reject(response);else resolve(response);
    });
  });
}

var promiseRestRequest = function promiseRestRequest(href) {
  console.warn('Use of promiseRestRequest is deprecated, use promiseRestGet instead');
  return promiseRestGet(href);
};
/**
 *
 * @param href
 * @param options - body, type, etc
 * @returns {Promise<any>}
 */


exports.promiseRestRequest = promiseRestRequest;

function promiseRestPost(href) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (href.includes("/api/core/v3/")) {
    href = href.split("/api/core/v3")[1];
  }

  return new Promise(function (resolve, reject) {
    osapi.jive.core.post(_objectSpread({
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

  return new Promise(function (resolve, reject) {
    osapi.jive.core["delete"]({
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

  return new Promise(function (resolve, reject) {
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
  return new Promise(function (resolve, reject) {
    var batch = osapi.newBatch();
    entries.forEach(function (entry, i) {
      var _createBatchEntry = createBatchEntry(entry, i, j),
          _createBatchEntry2 = (0, _slicedToArray2["default"])(_createBatchEntry, 2),
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
  return Object.keys(batchResponse).map(function (key) {
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

function singleRestBatch(_x, _x2) {
  return _singleRestBatch.apply(this, arguments);
}
/**
 * promiseOsapiBatch
 *
 * @param entries - any array based on which you want to build a batch
 * @param createBatchEntry - a func that takes a single entry and its index from the array above
 * and returns an object with the fields "id" and "request". "id" should be a unique id of the
 * request and "request" should be an OSAPI executable
 * @returns {Promise<Array>}
 */


function _singleRestBatch() {
  _singleRestBatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(items, createBatchEntry) {
    var j,
        batch,
        response,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            j = _args.length > 2 && _args[2] !== undefined ? _args[2] : 0;
            batch = items.map(function (item, i) {
              return createBatchEntry(item, i, j);
            });
            _context.next = 4;
            return promiseRestPost('/executeBatch', {
              type: "application/json",
              body: batch
            });

          case 4:
            response = _context.sent;
            return _context.abrupt("return", extractContent(response));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _singleRestBatch.apply(this, arguments);
}

function promiseBatch() {
  return _promiseBatch.apply(this, arguments);
}

function _promiseBatch() {
  _promiseBatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var type,
        entries,
        createBatchEntry,
        optionsArgument,
        defaultOptions,
        options,
        maxEntriesPerBatch,
        entryArrays,
        results,
        responseArray,
        i,
        response,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            type = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 'rest';
            entries = _args2.length > 1 ? _args2[1] : undefined;
            createBatchEntry = _args2.length > 2 ? _args2[2] : undefined;
            optionsArgument = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            defaultOptions = {
              maxEntries: 25,
              shouldBatchContinue: null,
              singleRestBatchFunc: singleRestBatch
            };
            options = _objectSpread(_objectSpread({}, defaultOptions), optionsArgument); //console.time('batch')
            //no more than 25! Jive hard limit

            maxEntriesPerBatch = options.maxEntries < 25 ? options.maxEntries : 25;

            if (!(entries.length <= maxEntriesPerBatch)) {
              _context2.next = 20;
              break;
            }

            if (!(type === 'osapi')) {
              _context2.next = 14;
              break;
            }

            _context2.t0 = batchObjectToArray;
            _context2.next = 12;
            return singleOsapiBatch(entries, createBatchEntry);

          case 12:
            _context2.t1 = _context2.sent;
            return _context2.abrupt("return", (0, _context2.t0)(_context2.t1));

          case 14:
            if (!(type === 'rest')) {
              _context2.next = 18;
              break;
            }

            _context2.next = 17;
            return options.singleRestBatchFunc(entries, createBatchEntry);

          case 17:
            return _context2.abrupt("return", _context2.sent);

          case 18:
            _context2.next = 43;
            break;

          case 20:
            entryArrays = (0, _utils.sliceArray)(entries, maxEntriesPerBatch);
            results = [];
            i = 0;

          case 23:
            if (!(i < entryArrays.length)) {
              _context2.next = 42;
              break;
            }

            if (!(type === 'osapi')) {
              _context2.next = 29;
              break;
            }

            _context2.next = 27;
            return singleOsapiBatch(entryArrays[i], createBatchEntry, i);

          case 27:
            response = _context2.sent;
            responseArray = batchObjectToArray(response);

          case 29:
            if (!(type === 'rest')) {
              _context2.next = 33;
              break;
            }

            _context2.next = 32;
            return options.singleRestBatchFunc(entryArrays[i], createBatchEntry, i);

          case 32:
            responseArray = _context2.sent;

          case 33:
            results = results.concat(responseArray); //if function is defined and it returns false - stop the cycle!

            if (!(options.shouldBatchContinue && !options.shouldBatchContinue(responseArray, results))) {
              _context2.next = 36;
              break;
            }

            return _context2.abrupt("break", 42);

          case 36:
            if (!(i < entryArrays.length - 1)) {
              _context2.next = 39;
              break;
            }

            _context2.next = 39;
            return (0, _utils.pause)((i + 1) % 4 === 0 ? 11000 : 1000);

          case 39:
            i++;
            _context2.next = 23;
            break;

          case 42:
            return _context2.abrupt("return", results);

          case 43:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _promiseBatch.apply(this, arguments);
}

function promiseRestBatch(_x3, _x4) {
  return _promiseRestBatch.apply(this, arguments);
}

function _promiseRestBatch() {
  _promiseRestBatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(entries, createBatchEntry) {
    var options,
        _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            _context3.next = 3;
            return promiseBatch('rest', entries, createBatchEntry, options);

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _promiseRestBatch.apply(this, arguments);
}

function promiseOsapiBatch(_x5, _x6) {
  return _promiseOsapiBatch.apply(this, arguments);
}

function _promiseOsapiBatch() {
  _promiseOsapiBatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(entries, createBatchEntry) {
    var options,
        _args4 = arguments;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            _context4.next = 3;
            return promiseBatch('osapi', entries, createBatchEntry, options);

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _promiseOsapiBatch.apply(this, arguments);
}

var CurrentPlace = /*#__PURE__*/function () {
  function CurrentPlace() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._filter;
    (0, _classCallCheck2["default"])(this, CurrentPlace);
    (0, _defineProperty2["default"])(this, "place", false);
    this.filter = filter;
  }

  (0, _createClass2["default"])(CurrentPlace, [{
    key: "_filter",
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
    key: "fetch",
    value: function fetch() {
      var _this = this;

      return new Promise(function (resolve) {
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
}(); //export const currentPlace = new CurrentPlace()


exports.CurrentPlace = CurrentPlace;
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
  extractContent: extractContent //currentPlace,

};
var _default = fetchPromise;
exports["default"] = _default;
//# sourceMappingURL=fetchPromise.js.map
