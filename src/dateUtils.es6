import moment from 'moment'

export const jiveDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

function _checkForErrors(input, expectedType){
    if (typeof input !== expectedType) throw new Error("expected argument to be " + expectedType)
}

export function jiveDate2Moment(jiveDate) {
    _checkForErrors(jiveDate, "string")

    return moment(jiveDate, jiveDateFormat)
}

export function moment2JiveDate(momentDate){
    _checkForErrors(momentDate, "object")
    if (!momentDate.isValid()) throw new Error("invalid moment date")

    return momentDate.format(jiveDateFormat)
}

export function jiveDate2TS(jiveDate) {
    _checkForErrors(jiveDate, "string")

    const momentDate = jiveDate2Moment(jiveDate)

    if (!momentDate.isValid()) throw new Error("invalid jive date")

    return momentDate.valueOf()
}

export function TS2JiveDate(ts) {
    if (typeof ts !== "number" && typeof ts !== "string")
        throw new Error("expected argument to be a string or number")

    const momentDate = (typeof ts === 'number') ? moment(ts) : moment(ts, 'x')

    return momentDate.format(jiveDateFormat)
}

const dateUtils = {
    jiveDateFormat,
    jiveDate2Moment,
    moment2JiveDate,
    jiveDate2TS,
    TS2JiveDate
}

export default dateUtils