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

const longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pharetra egestas sapien quis vestibulum. Cras semper posuere libero. Nunc auctor leo nisl, vel laoreet massa semper ac. Morbi euismod auctor magna, non sollicitudin orci viverra at. Ut consequat nunc sapien, a pellentesque arcu vestibulum at. Curabitur ut molestie est. Quisque at pulvinar lorem. Curabitur eget faucibus mi. Aenean malesuada efficitur luctus. Proin ut aliquam lectus. Pellentesque euismod metus risus, id sagittis ante sollicitudin venenatis"

describe("abridge", () => {

    test("should be a funcion", () => {
        expect(typeof abridge).toBe('function')
    })

    test("should throw error on non-string", () => {
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