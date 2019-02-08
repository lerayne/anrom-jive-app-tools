const {
    pause,
    unescapeHtmlEntities,
    splitArray,
    abridge,
    getCacheableImage,
    findContentImage,
    getContentImage,
    getImagelessHTML,
    jsonCopy,
    isEmptyObject
} = require('../utils')

describe("pause", () => {
    test("should be a function", () => {
        expect(typeof pause).toBe('function')
    })

    test("should return promise", () => {
        expect(pause(0)).toBeInstanceOf(Promise)
    })

    test("should work with different input values", () => {
        expect(() => pause()).not.toThrow()
        expect(() => pause(0)).not.toThrow()
        expect(() => pause(500)).not.toThrow()
    })

    test("should throw error on non-numeric or negative input", () => {
        expect(() => pause(false)).toThrow()
        expect(() => pause('')).toThrow()
        expect(() => pause(-1)).toThrow()
        expect(() => pause([])).toThrow()
        expect(() => pause({})).toThrow()
    })

    test("returned promise should be resolvable", () => {
        return expect(pause()).resolves.toBe(undefined)
    })
})

describe('splitArray', () => {
    test("should be a function", () => {
        expect(typeof splitArray).toBe('function')
    })

    test("should split array properly", () => {
        const result = splitArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 4)
        expect(result).toEqual([[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17]])
    })

    test("should throw errors on improper input", () => {
        expect(() => splitArray()).toThrow()
        expect(() => splitArray(1, 1)).toThrow()
        expect(() => splitArray({})).toThrow()
        expect(() => splitArray('test')).toThrow()
        expect(() => splitArray([1], false)).toThrow()
        expect(() => splitArray([1], '')).toThrow()
        expect(() => splitArray([1], {})).toThrow()
    })

    test("should return an empty array if chunks number is >= 0", () => {
        expect(splitArray([1], 0).length).toBe(0)
    })

    test("should return an original array if chunks number is 1", () => {
        expect(splitArray([1,2,3], 1)).toEqual([1,2,3])
    })

    test("should behave properly if original array langth equals chunks", () => {
        expect(splitArray([1,2,3], 3)).toEqual([[1],[2],[3]])
    })
})

describe("abridge", () => {

    test("should be a function", () => {
        expect(typeof abridge).toBe('function')
    })

    test("should throw error on non-string", () => {
        expect(() => abridge(undefined)).toThrow()
        expect(() => abridge(-1)).toThrow()
        expect(() => abridge(false)).toThrow()
        expect(() => abridge([1,2,3])).toThrow()
        expect(() => abridge({})).toThrow()
    })

    test("should return same text if it's shorter or equal to the limit", () => {
        expect(abridge('Lorem ipsum')).toEqual('Lorem ipsum')
        expect(abridge('Lorem ipsum', 11)).toEqual('Lorem ipsum')
    })

    test("should cut last non-whole word if cut between words", () => {
        expect(abridge("Lorem ipsum dolor", 10)).toEqual('Lorem...')
    })

    test("should cut by whitespace, if found", () => {
        expect(abridge("Lorem ipsum dolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum\ndolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum\tdolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum\rdolor", 11)).toEqual('Lorem ipsum...')
    })

    test("should cut by punctuation, if found", () => {
        expect(abridge("Lorem ipsum?dolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum!dolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum.dolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum,dolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum:dolor", 11)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum;dolor", 11)).toEqual('Lorem ipsum...')
    })

    test("should remove redundant punctuation, but not ? and !", () => {
        expect(abridge("Lorem ipsum? dolor", 12)).toEqual('Lorem ipsum?...')
        expect(abridge("Lorem ipsum! dolor", 13)).toEqual('Lorem ipsum!...')
        expect(abridge("Lorem ipsum, dolor", 14)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum. dolor", 12)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum: dolor", 13)).toEqual('Lorem ipsum...')
        expect(abridge("Lorem ipsum; dolor", 14)).toEqual('Lorem ipsum...')
    })
})