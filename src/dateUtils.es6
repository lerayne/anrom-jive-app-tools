import moment from 'moment'

export const jiveDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ'

export function jiveDate2Moment(jiveDate){
    return moment(jiveDate, jiveDateFormat)
}

export function moment2JiveDate(momentDate){
    return momentDate.format(jiveDateFormat)
}

export function jiveDate2TS(jiveDate) {
    return jiveDate2Moment(jiveDate).valueOf()
}

export function TS2JiveDate(ts) {
    return moment(ts).format(jiveDateFormat)
}

const dateUtils = {
    jiveDateFormat,
    jiveDate2Moment,
    moment2JiveDate,
    jiveDate2TS,
    TS2JiveDate
}

export default dateUtils