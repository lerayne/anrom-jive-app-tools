"use strict";

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

require("core-js/modules/es.object.define-properties.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.reflect.construct.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ContinuousLoader = exports.ContinuousLoadJiveREST = exports.ContinuousLoadJiveOSAPI = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("core-js/modules/es.function.bind.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.splice.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.date.now.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _fetchPromise = require("./fetchPromise");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/*
 * Continuous loader designed to abstract loading content lists by any asynchronous API in cases
 * when said API doesn't support filtering parameters by which you want to filter this content.
 */
var ContinuousLoader = /*#__PURE__*/function () {
  /**
   * Constructs a class instance
   * @param {function} asyncFunction - should return Promise
   * @param {function} filter - should return array
   * @param {object} [options]
   */
  function ContinuousLoader(asyncFunction, filter) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2["default"])(this, ContinuousLoader);
    var optionsDefaults = {
      debug: false,
      targetCount: 10,
      maxTriesPerLoad: 5,
      timeLimit: 10000,
      getNextAsyncFunc: this.getNextAsyncFunc.bind(this),
      getError: this.getError.bind(this),
      getList: this.getList.bind(this),
      transformResponse: null
    };
    this.options = _objectSpread(_objectSpread({}, optionsDefaults), options);
    this.asyncFunction = asyncFunction;
    this.filter = filter;
    this.resultPool = [];
    this.endReached = false;
    this.transformResponse = this.options.transformResponse || this._transformResponse.bind(this);
  }

  (0, _createClass2["default"])(ContinuousLoader, [{
    key: "getError",
    value: // Overrideable method that gets error from API response
    function getError(asyncFunctionResponse) {
      return asyncFunctionResponse.error || false;
    } // Overrideable method that gets content list from API response

  }, {
    key: "getList",
    value: function getList(asyncFunctionResponse) {
      return asyncFunctionResponse.list || [];
    }
    /**
     * Overrideable method to create new promise-returning function
     * @param asyncFunctionResponse
     * @returns {function|boolean} - should return async function (one that returns promise),
     * NOT promise itself
     */

  }, {
    key: "getNextAsyncFunc",
    value: function getNextAsyncFunc(asyncFunctionResponse) {
      console.warn('getNextAsyncFunc should be defined in either options or child class');
      return false;
    }
  }, {
    key: "_transformResponse",
    value: function _transformResponse(list) {
      return Promise.resolve(list);
    }
  }, {
    key: "_recursiveLoad",
    value: function () {
      var _recursiveLoad2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject, loadCount) {
        var asyncFunctionResponse, _this$options, getError, getList, getNextAsyncFunc, targetCount, maxTriesPerLoad, error, list, _list, filteredList, nextAsyncFunc, _list2, sincePassStart, _list3, _list4, _list5;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.asyncFunction();

              case 3:
                asyncFunctionResponse = _context.sent;
                _this$options = this.options, getError = _this$options.getError, getList = _this$options.getList, getNextAsyncFunc = _this$options.getNextAsyncFunc, targetCount = _this$options.targetCount, maxTriesPerLoad = _this$options.maxTriesPerLoad;

                this._log('asyncFunctionResponse', asyncFunctionResponse); // catch errors


                error = getError(asyncFunctionResponse);

                if (!error) {
                  _context.next = 9;
                  break;
                }

                throw new Error(error);

              case 9:
                //getting list
                list = getList(asyncFunctionResponse); //if unfiltered list is empty - means nothing to load
                // returning the rest of result poll (if any) and blocking
                // further calls of this.loadNext

                if (list.length) {
                  _context.next = 18;
                  break;
                }

                this._log('zero items get, returning []/rest of pool');

                this.endReached = true;
                _context.next = 15;
                return this.transformResponse(this.resultPool.splice(0));

              case 15:
                _list = _context.sent;
                resolve({
                  list: _list,
                  reason: 'source ended'
                });
                return _context.abrupt("return", null);

              case 18:
                _context.next = 20;
                return this.filter(list, (0, _toConsumableArray2["default"])(this.resultPool));

              case 20:
                filteredList = _context.sent;
                this.resultPool = this.resultPool.concat(filteredList); // getting possible next poll - this should be done before first possible
                // contentful resolve()

                nextAsyncFunc = getNextAsyncFunc(asyncFunctionResponse);

                if (typeof nextAsyncFunc === 'function') {
                  this.asyncFunction = nextAsyncFunc;
                } else {
                  this.endReached = true;
                } //if pool reached target number - resolve items and remove them from pool


                if (!(this.resultPool.length >= targetCount)) {
                  _context.next = 32;
                  break;
                }

                this._log('pool reached the target count. set pause.');

                _context.next = 28;
                return this.transformResponse(this.resultPool.splice(0, targetCount));

              case 28:
                _list2 = _context.sent;
                resolve({
                  list: _list2,
                  reason: 'reached target count'
                });

                this._log('(rest of pool:', this.resultPool);

                return _context.abrupt("return", null);

              case 32:
                loadCount++;
                sincePassStart = Date.now() - this.passStartTS;

                this._log('Time passes since pass started', sincePassStart);

                if (!(sincePassStart > this.options.timeLimit)) {
                  _context.next = 44;
                  break;
                }

                // if pool hasn't reached the target number, but time limit has been exceded
                this._log('time limit of ' + this.options.timeLimit + 'ms is exceeded. returning what\'s' + ' found so far');

                _context.next = 39;
                return this.transformResponse(this.resultPool.splice(0));

              case 39:
                _list3 = _context.sent;
                resolve({
                  list: _list3,
                  reason: 'time limit exceeded'
                });
                return _context.abrupt("return", null);

              case 44:
                if (!(maxTriesPerLoad > 0 && loadCount >= maxTriesPerLoad)) {
                  _context.next = 53;
                  break;
                }

                // if pool hasn't reached the target number, but it's last poll according to
                // maxTriesPerLoad
                this._log('max tries reached. returning what\'s found so far');

                _context.next = 48;
                return this.transformResponse(this.resultPool.splice(0));

              case 48:
                _list4 = _context.sent;
                resolve({
                  list: _list4,
                  reason: 'max polls reached'
                });
                return _context.abrupt("return", null);

              case 53:
                if (this.endReached) {
                  _context.next = 59;
                  break;
                }

                //if pool hasn't reached target number, but there's more to load
                this._log('got', this.resultPool.length, 'while target is', targetCount, 'need to load one more time');

                this._recursiveLoad(resolve, reject, loadCount);

                return _context.abrupt("return", null);

              case 59:
                this._log('no next promise available. returning pool');

                _context.next = 62;
                return this.transformResponse(this.resultPool.splice(0));

              case 62:
                _list5 = _context.sent;
                resolve({
                  list: _list5,
                  reason: 'source ended'
                });

              case 64:
                _context.next = 69;
                break;

              case 66:
                _context.prev = 66;
                _context.t0 = _context["catch"](0);
                reject(_context.t0);

              case 69:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 66]]);
      }));

      function _recursiveLoad(_x, _x2, _x3) {
        return _recursiveLoad2.apply(this, arguments);
      }

      return _recursiveLoad;
    }()
  }, {
    key: "loadNext",
    value: function loadNext() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var targetCount = _this.options.targetCount;

        if (_this.resultPool.length >= targetCount) {
          _this._log('target count found in existing pool');

          _this.transformResponse(_this.resultPool.splice(0, targetCount)).then(function (list) {
            return resolve({
              list: list,
              reason: 'target count exists in pool'
            });
          })["catch"](reject);

          return null;
        }

        if (_this.endReached) {
          if (_this.resultPool.length) {
            _this._log('no next promise available. returning pool');

            _this.transformResponse(_this.resultPool.splice(0)).then(function (list) {
              return resolve({
                list: list,
                reason: 'source ended'
              });
            })["catch"](reject);
          } else {
            _this._log('end was already reached before, no more polling');

            resolve({
              list: [],
              reason: 'polling finished'
            });
          }

          return null;
        }

        _this.passStartTS = Date.now();

        _this._recursiveLoad(resolve, reject, 0);
      });
    }
  }, {
    key: "_log",
    value: function _log() {
      if (this.options.debug) {
        var _console;

        (_console = console).log.apply(_console, arguments);
      }
    }
  }]);
  return ContinuousLoader;
}();

exports.ContinuousLoader = ContinuousLoader;

var ContinuousLoadJiveREST = /*#__PURE__*/function (_ContinuousLoader) {
  (0, _inherits2["default"])(ContinuousLoadJiveREST, _ContinuousLoader);

  var _super = _createSuper(ContinuousLoadJiveREST);

  function ContinuousLoadJiveREST(asyncFunction, filter) {
    var _this2;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2["default"])(this, ContinuousLoadJiveREST);
    _this2 = _super.call(this, asyncFunction, filter, options);
    var optionsDefaults = {
      // loose:true means that (list.length < itemsPerPage) doesn't mean list has ended.
      // Useful for jive REST "/activity" endpoint
      loose: false,
      method: 'get',
      createNextAsyncFunc: _this2.createNextAsyncFunc.bind((0, _assertThisInitialized2["default"])(_this2))
    };
    _this2.options = _objectSpread(_objectSpread(_objectSpread({}, optionsDefaults), _this2.options), options);
    return _this2;
  }

  (0, _createClass2["default"])(ContinuousLoadJiveREST, [{
    key: "getList",
    value: function getList(asyncFunctionResponse) {
      //this._log('REST getList')
      var responseContent = asyncFunctionResponse.content || asyncFunctionResponse;
      return responseContent.list || [];
    }
  }, {
    key: "getError",
    value: function getError(asyncFunctionResponse) {
      //this._log('REST getError')
      if (asyncFunctionResponse.status) {
        switch (asyncFunctionResponse.status) {
          case 200:
            return false;

          case 204:
            return '204: No Content';

          default:
            return asyncFunctionResponse.status;
        }
      }

      return false;
    }
  }, {
    key: "getNextAsyncFunc",
    value: function getNextAsyncFunc(asyncFunctionResponse) {
      var responseContent = asyncFunctionResponse.content || asyncFunctionResponse;
      var itemsPerPage = responseContent.itemsPerPage,
          list = responseContent.list,
          links = responseContent.links;

      if (!responseContent.links || !responseContent.links.next || list.length < itemsPerPage && !this.options.loose) {
        // there's nothing to load more
        return false;
      }

      return this.options.createNextAsyncFunc(links.next, responseContent);
    }
  }, {
    key: "createNextAsyncFunc",
    value: function createNextAsyncFunc(nextLink, responseContent) {
      var _this3 = this;

      return function () {
        var link = nextLink.split('api/core/v3')[1];
        if (_this3.options.method.toLowerCase() === 'get') return (0, _fetchPromise.promiseRestGet)(link);
        if (_this3.options.method.toLowerCase() === 'post') return (0, _fetchPromise.promiseRestPost)(link);
      };
    }
  }]);
  return ContinuousLoadJiveREST;
}(ContinuousLoader);

exports.ContinuousLoadJiveREST = ContinuousLoadJiveREST;

var ContinuousLoadJiveOSAPI = /*#__PURE__*/function (_ContinuousLoader2) {
  (0, _inherits2["default"])(ContinuousLoadJiveOSAPI, _ContinuousLoader2);

  var _super2 = _createSuper(ContinuousLoadJiveOSAPI);

  function ContinuousLoadJiveOSAPI() {
    (0, _classCallCheck2["default"])(this, ContinuousLoadJiveOSAPI);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2["default"])(ContinuousLoadJiveOSAPI, [{
    key: "getList",
    value: function getList(asyncFunctionResponse) {
      //console.log('REST getList')
      var responseContent = asyncFunctionResponse.content || asyncFunctionResponse;
      return responseContent.list || [];
    }
  }, {
    key: "getNextAsyncFunc",
    value: function getNextAsyncFunc(asyncFunctionResponse) {
      if (typeof asyncFunctionResponse.getNextPage === 'function') {
        return function () {
          return (0, _fetchPromise.promiseOsapiRequest)(asyncFunctionResponse.getNextPage);
        };
      }

      return false;
    }
  }]);
  return ContinuousLoadJiveOSAPI;
}(ContinuousLoader);

exports.ContinuousLoadJiveOSAPI = ContinuousLoadJiveOSAPI;
var _default = {
  ContinuousLoader: ContinuousLoader,
  ContinuousLoadJiveREST: ContinuousLoadJiveREST,
  ContinuousLoadJiveOSAPI: ContinuousLoadJiveOSAPI
};
exports["default"] = _default;
//# sourceMappingURL=ContinuousLoader.js.map
