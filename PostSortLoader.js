'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

//todo: so far works with REST batch (not OSAPI) and doesn't load more than required initially (no
// full support of "load more")
var PostSortLoader = function () {
  function PostSortLoader(createSignatureRequest, createContentItemRequest, sortingFunction, options) {
    (0, _classCallCheck3.default)(this, PostSortLoader);


    var optionsDefaults = {
      // how many items of final sorted content we want to load per each "loadNext"
      targetCount: 10,

      //how many batched pages of signature requests to perform
      batchNumber: 5,

      // jive batch can take no more than 25 requests per batch. 25 is a default, but we're
      // putting it here explicitly.
      // In many cases it's better to ask for signatures in smaller chunks - like 10 times per
      // 100 items makes it 1000 items per page, but we can stop after each thousand and run
      // shouldBatchContinue to avoid loading too much content
      batchMaxEntries: 25,

      // function that runs after each batch page. If it returns false - batching should stop
      shouldBatchContinue: null,

      // function to filter out some signatures before fetching of real data starts. For example
      // we want to disable of loading some IDs
      filterSignature: function filterSignature(sig, i, a) {
        return sig;
      }
    };

    this.options = (0, _extends3.default)({}, optionsDefaults, options);

    //global flag telling us that we should stop polling.
    this.endReached = false;

    //main functions from params
    this.createSignatureRequest = createSignatureRequest;
    this.createContentItemRequest = createContentItemRequest;
    this.sortingFunction = sortingFunction;

    //collection of just IDs and fields by which content is sorted
    this.contentSignaturesPool = [];
  }

  (0, _createClass3.default)(PostSortLoader, [{
    key: 'loadNext',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _this = this;

        var customLoadNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var rawPool, contentToRequest, contentsResponse;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // if poll is empty and end is not reached (means this is first calling of loadNext) -
                // get those signatures!
                rawPool = [];

                if (!(!this.contentSignaturesPool.length && !this.endReached)) {
                  _context.next = 6;
                  break;
                }

                _context.next = 4;
                return this.getSignatures();

              case 4:
                rawPool = _context.sent;

                this.contentSignaturesPool = [].concat((0, _toConsumableArray3.default)(rawPool));

              case 6:
                if (!this.contentSignaturesPool.length) {
                  _context.next = 15;
                  break;
                }

                contentToRequest = this.contentSignaturesPool.splice(0, customLoadNumber || this.options.targetCount);

                // but if this was the last slice - flag the "endReached"

                if (!this.contentSignaturesPool.length) {
                  this.endReached = true;
                }

                _context.next = 11;
                return (0, _fetchPromise.promiseRestBatch)(contentToRequest, function (entry, eI, rI) {
                  return {
                    key: rI + '.' + eI,
                    request: {
                      method: 'GET',
                      endpoint: _this.createContentItemRequest(entry)
                    }
                  };
                });

              case 11:
                contentsResponse = _context.sent;
                return _context.abrupt('return', {
                  allSignatures: rawPool.length ? rawPool : undefined,
                  remainingSignatures: [].concat((0, _toConsumableArray3.default)(this.contentSignaturesPool)),
                  list: contentsResponse.filter(function (item) {
                    return !item.error;
                  }).map(function (item) {
                    return item.data;
                  }),
                  reason: this.endReached ? 'source ended' : 'reached target count'
                });

              case 15:
                return _context.abrupt('return', {
                  allSignatures: rawPool.length ? rawPool : undefined,
                  remainingSignatures: [].concat((0, _toConsumableArray3.default)(this.contentSignaturesPool)),
                  list: [],
                  reason: 'polling finished'
                });

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadNext() {
        return _ref.apply(this, arguments);
      }

      return loadNext;
    }()
  }, {
    key: 'getSignatures',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var _this2 = this;

        var _options, batchNumber, filterSignature, batchArray, i, response, signatures, sortedSignatures;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _options = this.options, batchNumber = _options.batchNumber, filterSignature = _options.filterSignature;
                batchArray = [];

                for (i = 0; i < batchNumber; i++) {
                  batchArray.push(i);
                }_context2.next = 5;
                return (0, _fetchPromise.promiseRestBatch)(batchArray, function (batchPageIndex, entryIndex, requestIndex) {
                  return {
                    key: requestIndex + '.' + entryIndex,
                    request: {
                      method: 'GET',
                      endpoint: _this2.createSignatureRequest(batchPageIndex)
                    }
                  };
                }, {
                  maxEntries: this.options.batchMaxEntries,
                  shouldBatchContinue: this.options.shouldBatchContinue
                });

              case 5:
                response = _context2.sent;


                //todo: figure out what to do with errors inside this list (now they're just ignored)
                signatures = response.filter(function (chunk) {
                  return chunk.status === 200;
                }).map(function (chunk) {
                  return chunk.data.list;
                }).reduce(function (accum, current) {
                  return accum.concat(current);
                }, []).filter(function (sig, index, all) {
                  return filterSignature(sig, index, all);
                });
                sortedSignatures = signatures.sort(this.sortingFunction);


                console.log('response', response);
                console.log('sortedSignatures', sortedSignatures);

                return _context2.abrupt('return', sortedSignatures);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getSignatures() {
        return _ref2.apply(this, arguments);
      }

      return getSignatures;
    }()
  }]);
  return PostSortLoader;
}();

exports.default = PostSortLoader;
module.exports = exports['default'];
//# sourceMappingURL=PostSortLoader.js.map