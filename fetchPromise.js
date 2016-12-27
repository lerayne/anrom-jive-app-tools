'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.promiseOsapiRequest = promiseOsapiRequest;
exports.promiseRestRequest = promiseRestRequest;
exports.promiseHttpGet = promiseHttpGet;

var _osapi = require('jive/osapi');

var _osapi2 = _interopRequireDefault(_osapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function promiseOsapiRequest(osapiRequestFunc) {
    return new Promise(function (resolve, reject) {

        var request = typeof osapiRequestFunc == 'function' ? osapiRequestFunc(_osapi2.default.jive.corev3) : osapiRequestFunc;

        request.execute(function (response) {
            if (response.error) {
                reject({ error: response.error });
            } else {
                resolve(response);
            }
        });
    });
} /**
   * Created by M. Yegorov on 2016-12-27.
   */

function promiseRestRequest(href) {
    return new Promise(function (resolve, reject) {
        _osapi2.default.jive.core.get({
            v: 'v3',
            href: href
        }).execute(function (response) {
            if (!response.error) {
                resolve(response);
            } else {
                reject(response);
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

        (_osapi$http = _osapi2.default.http).get.apply(_osapi$http, args).execute(function (result) {
            if (result.error) reject(result.error);else {
                resolve(result);
            }
        });
    });
}

var fetchPromise = { promiseHttpGet: promiseHttpGet, promiseOsapiRequest: promiseOsapiRequest, promiseRestRequest: promiseRestRequest };

exports.default = fetchPromise;
//# sourceMappingURL=fetchPromise.js.map