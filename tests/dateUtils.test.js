const {
    jiveDateFormat,
    jiveDate2Moment,
    moment2JiveDate,
    jiveDate2TS,
    TS2JiveDate
} = require('../dateUtils')

const moment = require('moment')

describe("jiveDate2Moment", () => {
    test("should be a function", () => {
        expect(typeof jiveDate2Moment).toBe('function')
    })

    test("should return a correct moment object", () => {
        const momentDate = jiveDate2Moment('2019-02-18T23:03:04.131+0200')

        expect(momentDate.isValid()).toBe(true)
        expect(momentDate.format('YYYY-MM-DD HH:mm:ss.SSS ZZ')).toBe('2019-02-18 23:03:04.131 +0200')
    })

    test("should throw an error on incorrect input", () => {
        expect(() => jiveDate2Moment()).toThrow()
        expect(() => jiveDate2Moment(1)).toThrow()
        expect(() => jiveDate2Moment({})).toThrow()
        expect(() => jiveDate2Moment([])).toThrow()
        expect(() => jiveDate2Moment(false)).toThrow()
    })
})

describe("moment2JiveDate", () => {
    test("should be a function", () => {
        expect(typeof moment2JiveDate).toBe('function')
    })

    test("should return a correct ISO date", () => {
        const momentDate = jiveDate2Moment('2019-02-18T23:03:04.131+0200')

        expect(moment2JiveDate(momentDate)).toBe('2019-02-18T23:03:04.131+0200')
    })

    test("should throw an error on incorrect input", () => {
        expect(() => moment2JiveDate()).toThrow()
        expect(() => moment2JiveDate(1)).toThrow()
        expect(() => moment2JiveDate('')).toThrow()
        expect(() => moment2JiveDate([])).toThrow()
        expect(() => moment2JiveDate(false)).toThrow()
    })

    test("should throw an error on incorrect moment object", () => {
        expect(() => moment2JiveDate({})).toThrow()
    })
})

describe("jiveDate2TS", () => {
    test("should be a function", () => {
        expect(typeof jiveDate2TS).toBe('function')
    })

    test("should return a correct timestamp", () => {
        expect(jiveDate2TS('2019-02-18T23:03:04.131+0200')).toBe(1550523784131)
    })

    test("should throw an error on incorrect input", () => {
        expect(() => jiveDate2TS()).toThrow()
        expect(() => jiveDate2TS(1)).toThrow()
        expect(() => jiveDate2TS([])).toThrow()
        expect(() => jiveDate2TS({})).toThrow()
        expect(() => jiveDate2TS(false)).toThrow()
    })

    test("should throw an error on incorrect jive date", () => {
        expect(() => jiveDate2TS('sadadadadadad')).toThrow()
    })
})

describe("TS2JiveDate", () => {
    test("should be a function", () => {
        expect(typeof TS2JiveDate).toBe('function')
    })

    test("should return a correct ISO date from number", () => {
        const jiveDate = TS2JiveDate(1550523784131)
        const momentDate = jiveDate2Moment(jiveDate)

        expect(momentDate.utc().format(jiveDateFormat)).toBe('2019-02-18T21:03:04.131+0000')
    })

    test("should return a correct ISO date from string", () => {
        const jiveDate = TS2JiveDate("1550523784131")
        const momentDate = jiveDate2Moment(jiveDate)

        expect(momentDate.utc().format(jiveDateFormat)).toBe('2019-02-18T21:03:04.131+0000')
    })

    test("should throw an error on incorrect input", () => {
        expect(() => TS2JiveDate()).toThrow()
        expect(() => TS2JiveDate({})).toThrow()
        expect(() => TS2JiveDate(false)).toThrow()
        expect(() => TS2JiveDate([])).toThrow()
    })
})