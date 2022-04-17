"use strict";

require("core-js/modules/es.object.define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TS2JiveDate = TS2JiveDate;
exports["default"] = void 0;
exports.jiveDate2Moment = jiveDate2Moment;
exports.jiveDate2TS = jiveDate2TS;
exports.jiveDateFormat = void 0;
exports.moment2JiveDate = moment2JiveDate;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _moment = _interopRequireDefault(require("moment"));

var jiveDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';
exports.jiveDateFormat = jiveDateFormat;

function _checkForErrors(input, expectedType) {
  if ((0, _typeof2["default"])(input) !== expectedType) throw new Error("expected argument to be " + expectedType);
}

function jiveDate2Moment(jiveDate) {
  _checkForErrors(jiveDate, "string");

  return (0, _moment["default"])(jiveDate, jiveDateFormat);
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
  var momentDate = typeof ts === 'number' ? (0, _moment["default"])(ts) : (0, _moment["default"])(ts, 'x');
  return momentDate.format(jiveDateFormat);
}

var dateUtils = {
  jiveDateFormat: jiveDateFormat,
  jiveDate2Moment: jiveDate2Moment,
  moment2JiveDate: moment2JiveDate,
  jiveDate2TS: jiveDate2TS,
  TS2JiveDate: TS2JiveDate
};
var _default = dateUtils;
exports["default"] = _default;
//# sourceMappingURL=dateUtils.js.map
