'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.jiveDateFormat = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.jiveDate2Moment = jiveDate2Moment;
exports.moment2JiveDate = moment2JiveDate;
exports.jiveDate2TS = jiveDate2TS;
exports.TS2JiveDate = TS2JiveDate;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jiveDateFormat = exports.jiveDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

function _checkForErrors(input, expectedType) {
    if ((typeof input === 'undefined' ? 'undefined' : (0, _typeof3.default)(input)) !== expectedType) throw new Error("expected argument to be " + expectedType);
}

function jiveDate2Moment(jiveDate) {
    _checkForErrors(jiveDate, "string");

    return (0, _moment2.default)(jiveDate, jiveDateFormat);
}

function moment2JiveDate(momentDate) {
    _checkForErrors(momentDate, "object");
    if (!momentDate.isValid()) throw new Error("invalid moment date");

    return momentDate.format(jiveDateFormat);
}

function jiveDate2TS(jiveDate) {
    _checkForErrors(jiveDate, "string");

    var momentDate = jiveDate2Moment(jiveDate);

    if (!momentDate.isValid()) throw new Error("invalid jive date");

    return momentDate.valueOf();
}

function TS2JiveDate(ts) {
    if (typeof ts !== "number" && typeof ts !== "string") throw new Error("expected argument to be a string or number");

    var momentDate = typeof ts === 'number' ? (0, _moment2.default)(ts) : (0, _moment2.default)(ts, 'x');

    return momentDate.format(jiveDateFormat);
}

var dateUtils = {
    jiveDateFormat: jiveDateFormat,
    jiveDate2Moment: jiveDate2Moment,
    moment2JiveDate: moment2JiveDate,
    jiveDate2TS: jiveDate2TS,
    TS2JiveDate: TS2JiveDate
};

exports.default = dateUtils;
//# sourceMappingURL=dateUtils.js.map