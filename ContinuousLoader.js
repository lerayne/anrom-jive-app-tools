'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContinuousLoadJiveOSAPI = exports.ContinuousLoadJiveREST = exports.ContinuousLoader = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fetchPromise = require('./fetchPromise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContinuousLoader = exports.ContinuousLoader = function () {
    (0, _createClass3.default)(ContinuousLoader, [{
        key: 'getError',
        value: function getError(asyncFunctionResponse) {
            return asyncFunctionResponse.error || false;
        }
    }, {
        key: 'getList',
        value: function getList(asyncFunctionResponse) {
            return asyncFunctionResponse.list || [];
        }
    }, {
        key: 'getResponseContent',
        value: function getResponseContent(asyncFunctionResponse) {
            return asyncFunctionResponse;
        }

        /**
         * Overrideable function to create new promise-returning function
         * @param asyncFunctionResponse
         * @returns {function|boolean} - should return async function (one that returns promise),
         * NOT promise itself
         */

    }, {
        key: 'getNextAsyncFunc',
        value: function getNextAsyncFunc(asyncFunctionResponse) {
            console.warn('getNextAsyncFunc should be defined in either options or child class');
            return false;
        }

        /**
         * Constructs a class instance
         * @param {function} asyncFunction - should return Promise
         * @param {function} filter - should return array
         * @param {object} [options]
         */

    }]);

    function ContinuousLoader(asyncFunction, filter) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        (0, _classCallCheck3.default)(this, ContinuousLoader);


        var optionsDefaults = {
            debug: false,
            targetCount: 10,
            maxTriesPerLoad: 5,
            getNextAsyncFunc: this.getNextAsyncFunc.bind(this),
            getError: this.getError.bind(this),
            getList: this.getList.bind(this),
            getResponseContent: this.getResponseContent.bind(this),
            map: false
        };

        this.options = (0, _extends3.default)({}, optionsDefaults, options);

        this.asyncFunction = asyncFunction;
        this.filter = filter;
        this.resultPool = [];
        this.endReached = false;
    }

    (0, _createClass3.default)(ContinuousLoader, [{
        key: 'recursiveLoad',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject, loadCount) {
                var asyncFunctionResponse, _options, getError, getList, getNextAsyncFunc, targetCount, maxTriesPerLoad, error, list, filteredList, nextAsyncFunc;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.asyncFunction();

                            case 3:
                                asyncFunctionResponse = _context.sent;
                                _options = this.options, getError = _options.getError, getList = _options.getList, getNextAsyncFunc = _options.getNextAsyncFunc, targetCount = _options.targetCount, maxTriesPerLoad = _options.maxTriesPerLoad;


                                this.log('asyncFunctionResponse', asyncFunctionResponse);

                                // catch errors
                                error = getError(asyncFunctionResponse);

                                if (!error) {
                                    _context.next = 9;
                                    break;
                                }

                                throw new Error(error);

                            case 9:

                                //getting list
                                list = getList(asyncFunctionResponse);

                                //if unfiltered list is empty - means nothing to load
                                // returning the rest of result poll (if any) and blocking
                                // further calls of this.loadNext

                                if (list.length) {
                                    _context.next = 15;
                                    break;
                                }

                                this.log('zero items get, returning []/rest of pool');
                                this.endReached = true;
                                resolve({
                                    list: this.resultPool.splice(0),
                                    reason: 'source ended'
                                });
                                return _context.abrupt('return', null);

                            case 15:
                                if (!this.options.map) {
                                    _context.next = 19;
                                    break;
                                }

                                _context.next = 18;
                                return this.options.map(list, [].concat((0, _toConsumableArray3.default)(this.resultPool)));

                            case 18:
                                list = _context.sent;

                            case 19:
                                _context.next = 21;
                                return this.filter(list, [].concat((0, _toConsumableArray3.default)(this.resultPool)));

                            case 21:
                                filteredList = _context.sent;


                                this.resultPool = this.resultPool.concat(filteredList);

                                // getting possible next poll - this should be done before first possible
                                // contentful resolve()
                                nextAsyncFunc = getNextAsyncFunc(asyncFunctionResponse);

                                if (typeof nextAsyncFunc === 'function') {
                                    this.asyncFunction = nextAsyncFunc;
                                }

                                //if pool reached target number - resolve items and remove them from pool

                                if (!(this.resultPool.length >= targetCount)) {
                                    _context.next = 30;
                                    break;
                                }

                                this.log('pool reached the target count. set pause.');
                                resolve({
                                    list: this.resultPool.splice(0, targetCount),
                                    reason: 'reached target count'
                                });
                                this.log('(rest of pool:', this.resultPool);
                                return _context.abrupt('return', null);

                            case 30:

                                loadCount++;

                                if (!(loadCount >= maxTriesPerLoad)) {
                                    _context.next = 37;
                                    break;
                                }

                                // if pool hasn't reached the target number, but it's last poll according to
                                // maxTriesPerLoad
                                this.log("max tries reached. returning what's found so far");
                                resolve({
                                    list: this.resultPool.splice(0),
                                    reason: 'max polls reached'
                                });
                                return _context.abrupt('return', null);

                            case 37:
                                if (!(typeof nextAsyncFunc === 'function')) {
                                    _context.next = 43;
                                    break;
                                }

                                //if pool hasn't reached target number, but there's more to load
                                this.log('got', this.resultPool.length, 'while target is', targetCount, 'need to load one more time');
                                this.recursiveLoad(resolve, reject, loadCount);
                                return _context.abrupt('return', null);

                            case 43:
                                this.log('no next promise available. returning pool');
                                this.endReached = true;
                                resolve({
                                    list: this.resultPool.splice(0),
                                    reason: 'source ended'
                                });

                            case 46:
                                _context.next = 51;
                                break;

                            case 48:
                                _context.prev = 48;
                                _context.t0 = _context['catch'](0);

                                reject(_context.t0);

                            case 51:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 48]]);
            }));

            function recursiveLoad(_x2, _x3, _x4) {
                return _ref.apply(this, arguments);
            }

            return recursiveLoad;
        }()
    }, {
        key: 'loadNext',
        value: function loadNext() {
            var _this = this;

            return new _promise2.default(function (resolve, reject) {

                if (_this.endReached) {
                    _this.log('end was reached before, no more promising');
                    resolve({
                        list: [],
                        reason: 'polling finished'
                    });
                    _this.log('(rest of pool:', _this.resultPool);
                    return null;
                }

                var targetCount = _this.options.targetCount;


                if (_this.resultPool.length >= targetCount) {
                    _this.log('target count found in existing pool');
                    resolve({
                        list: _this.resultPool.splice(0, targetCount),
                        reason: 'target count exists in pool'
                    });
                    return null;
                }

                _this.recursiveLoad(resolve, reject, 0);
            });
        }
    }, {
        key: 'log',
        value: function log() {
            if (this.options.debug) {
                var _console;

                (_console = console).log.apply(_console, arguments);
            }
        }
    }]);
    return ContinuousLoader;
}();

var ContinuousLoadJiveREST = exports.ContinuousLoadJiveREST = function (_ContinuousLoader) {
    (0, _inherits3.default)(ContinuousLoadJiveREST, _ContinuousLoader);
    (0, _createClass3.default)(ContinuousLoadJiveREST, [{
        key: 'getList',
        value: function getList(asyncFunctionResponse) {
            //this.log('REST getList')
            var responseContent = this.getResponseContent(asyncFunctionResponse);
            return responseContent.list || [];
        }
    }, {
        key: 'getResponseContent',
        value: function getResponseContent(asyncFunctionResponse) {
            //this.log('REST getResponseContent')
            return asyncFunctionResponse.content || asyncFunctionResponse;
        }
    }, {
        key: 'getError',
        value: function getError(asyncFunctionResponse) {
            //this.log('REST getError')
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

            return 'Unable to find status of async function response';
        }
    }, {
        key: 'getNextAsyncFunc',
        value: function getNextAsyncFunc(asyncFunctionResponse) {
            var responseContent = this.getResponseContent(asyncFunctionResponse);

            var itemsPerPage = responseContent.itemsPerPage,
                list = responseContent.list,
                links = responseContent.links;


            if (list.length < itemsPerPage || !responseContent.links || !responseContent.links.next) {
                // there's nothing to load more
                return false;
            }

            return this.options.createNextAsyncFunc(links.next, responseContent);
        }
    }, {
        key: 'createNextAsyncFunc',
        value: function createNextAsyncFunc(nextLink, responseContent) {
            var _this3 = this;

            return function () {
                var link = nextLink.split('api/core/v3')[1];
                if (_this3.options.method.toLowerCase() === 'get') return (0, _fetchPromise.promiseRestGet)(link);
                if (_this3.options.method.toLowerCase() === 'post') return (0, _fetchPromise.promiseRestPost)(link);
            };
        }
    }]);

    function ContinuousLoadJiveREST(asyncFunction, filter) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        (0, _classCallCheck3.default)(this, ContinuousLoadJiveREST);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (ContinuousLoadJiveREST.__proto__ || (0, _getPrototypeOf2.default)(ContinuousLoadJiveREST)).call(this, asyncFunction, filter, options));

        var optionsDefaults = {
            method: 'get',
            createNextAsyncFunc: _this2.createNextAsyncFunc.bind(_this2)
        };

        _this2.options = (0, _extends3.default)({}, optionsDefaults, _this2.options, options);
        return _this2;
    }

    return ContinuousLoadJiveREST;
}(ContinuousLoader);

var ContinuousLoadJiveOSAPI = exports.ContinuousLoadJiveOSAPI = function (_ContinuousLoader2) {
    (0, _inherits3.default)(ContinuousLoadJiveOSAPI, _ContinuousLoader2);

    function ContinuousLoadJiveOSAPI() {
        (0, _classCallCheck3.default)(this, ContinuousLoadJiveOSAPI);
        return (0, _possibleConstructorReturn3.default)(this, (ContinuousLoadJiveOSAPI.__proto__ || (0, _getPrototypeOf2.default)(ContinuousLoadJiveOSAPI)).apply(this, arguments));
    }

    (0, _createClass3.default)(ContinuousLoadJiveOSAPI, [{
        key: 'getList',
        value: function getList(asyncFunctionResponse) {
            //console.log('REST getList')
            var responseContent = this.getResponseContent(asyncFunctionResponse);
            return responseContent.list || [];
        }
    }, {
        key: 'getResponseContent',
        value: function getResponseContent(asyncFunctionResponse) {
            //console.log('REST getResponseContent')
            return asyncFunctionResponse.content || asyncFunctionResponse;
        }
    }, {
        key: 'getNextAsyncFunc',
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

exports.default = {
    ContinuousLoader: ContinuousLoader,
    ContinuousLoadJiveREST: ContinuousLoadJiveREST,
    ContinuousLoadJiveOSAPI: ContinuousLoadJiveOSAPI
};
//# sourceMappingURL=ContinuousLoader.js.map