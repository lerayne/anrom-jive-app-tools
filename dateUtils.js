'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.jiveDateFormat = undefined;
exports.jiveDate2Moment = jiveDate2Moment;
exports.moment2JiveDate = moment2JiveDate;
exports.jiveDate2TS = jiveDate2TS;
exports.TS2JiveDate = TS2JiveDate;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jiveDateFormat = exports.jiveDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

function jiveDate2Moment(jiveDate) {
    return (0, _moment2.default)(jiveDate, jiveDateFormat);
}

function moment2JiveDate(momentDate) {
    return momentDate.format(jiveDateFormat);
}

function jiveDate2TS(jiveDate) {
    return jiveDate2Moment(jiveDate).valueOf();
}

function TS2JiveDate(ts) {
    return (0, _moment2.default)(ts).format(jiveDateFormat);
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