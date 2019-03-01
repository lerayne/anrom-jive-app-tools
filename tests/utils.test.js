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



describe("unescapeHtmlEntities", () => {
    test("should be a function", () => {
        expect(typeof unescapeHtmlEntities).toBe('function')
    })

    test("to unescape & entity", () => {
        expect(unescapeHtmlEntities("Chip &amp; Dale")).toBe('Chip & Dale')
    })

    /*test("to NOT unescape <>", () => {
        expect(unescapeHtmlEntities("&lt;iframe&gt;")).toBe('‹iframe›')
        expect(unescapeHtmlEntities("&LT;iframe&GT;")).toBe('‹iframe›')
        expect(unescapeHtmlEntities("<iframe>")).toBe('‹iframe›')
    })*/

    test("to remove HTML tags", () => {
        expect(unescapeHtmlEntities('text &amp; <b>is bold</b><script>')).toBe('text & is bold')
    })

    test("to throw error on improper input", () => {
        expect(() => unescapeHtmlEntities()).toThrow()
        expect(() => unescapeHtmlEntities(1)).toThrow()
        expect(() => unescapeHtmlEntities(false)).toThrow()
        expect(() => unescapeHtmlEntities(undefined)).toThrow()
        expect(() => unescapeHtmlEntities([])).toThrow()
        expect(() => unescapeHtmlEntities({})).toThrow()
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
        expect(() => splitArray(undefined)).toThrow()
        expect(() => splitArray()).toThrow()
        expect(() => splitArray(1, 1)).toThrow()
        expect(() => splitArray({})).toThrow()
        expect(() => splitArray('test')).toThrow()
        expect(() => splitArray([1], undefined)).toThrow()
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

    test("should behave properly if original array langth equals chunks number", () => {
        expect(splitArray([1,2,3], 3)).toEqual([[1],[2],[3]])
    })

    test("should behave properly if chunks number is bigger than array length", () => {
        expect(splitArray([1,2,3], 5)).toEqual([[1],[2],[3],[],[]])
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
        expect(abridge('Lorem ipsum')).toBe('Lorem ipsum')
        expect(abridge('Lorem ipsum', 11)).toBe('Lorem ipsum')
    })

    test("should cut last non-whole word if cut between words", () => {
        expect(abridge("Lorem ipsum dolor", 10)).toBe('Lorem...')
    })

    test("should cut by whitespace, if found", () => {
        expect(abridge("Lorem ipsum dolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum\ndolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum\tdolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum\rdolor", 11)).toBe('Lorem ipsum...')
    })

    test("should cut by punctuation, if found", () => {
        expect(abridge("Lorem ipsum?dolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum!dolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum.dolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum,dolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum:dolor", 11)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum;dolor", 11)).toBe('Lorem ipsum...')
    })

    test("should remove redundant punctuation, but not ? and !", () => {
        expect(abridge("Lorem ipsum? dolor", 12)).toBe('Lorem ipsum?...')
        expect(abridge("Lorem ipsum! dolor", 12)).toBe('Lorem ipsum!...')
        expect(abridge("Lorem ipsum, dolor", 12)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum. dolor", 12)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum: dolor", 12)).toBe('Lorem ipsum...')
        expect(abridge("Lorem ipsum; dolor", 12)).toBe('Lorem ipsum...')
    })

    test("should cut first long word without removing it", () => {
        expect(abridge("LoremIpsumDolor", 12)).toBe('LoremIpsumDo...')
    })
})

describe("getCacheableImage", () => {
    test("should be a function", () => {
        expect(typeof getCacheableImage).toBe('function')
    })

    test("should return falsy value if given", () => {
        expect(getCacheableImage('')).toBe('')
        expect(getCacheableImage(false)).toBe(false)
        expect(getCacheableImage(0)).toBe(0)
        expect(getCacheableImage(undefined)).toBe(undefined)
    })

    test("should throw error on wrong parameter types", () => {
        expect(() => getCacheableImage({})).toThrow()
        expect(() => getCacheableImage([])).toThrow()
        expect(() => getCacheableImage(true)).toThrow()
        expect(() => getCacheableImage(500)).toThrow()
        expect(() => getCacheableImage('a', '')).toThrow()
        expect(() => getCacheableImage('a', {})).toThrow()
        expect(() => getCacheableImage('a', false)).toThrow()
        expect(() => getCacheableImage('a', [])).toThrow()
    })

    test("should return initial image if it doesn't match the pattern", () => {
        expect(getCacheableImage('https://miro.medium.com/max/854/1*WgROsTKa6diRYTG5K0R5mw.jpeg'))
            .toBe('https://miro.medium.com/max/854/1*WgROsTKa6diRYTG5K0R5mw.jpeg')

        // similar to jive URL, but with error
        expect(getCacheableImage('https://jivedemo.jiveon.com/servlet/downloadImage/38-2097-243635/1350-900/michael-haslim-21018-unsplash.jpg'))
            .toBe('https://jivedemo.jiveon.com/servlet/downloadImage/38-2097-243635/1350-900/michael-haslim-21018-unsplash.jpg')
    })

    test("should return modified URL if pattern matched", () => {
        expect(getCacheableImage('https://jivedemo.jiveon.com/servlet/JiveServlet/downloadImage/38-2097-243635/1350-900/michael-haslim-21018-unsplash.jpg'))
            .toBe('https://jivedemo.jiveon.com/api/core/v3/images/243635?width=500')

        expect(getCacheableImage('https://jivedemo.jiveon.com/servlet/JiveServlet/previewBody/5154-102-1-7132/fleurtreurniet325960-unsplash.jpg'))
            .toBe('https://jivedemo.jiveon.com/servlet/JiveServlet?bodyImage=true&contentType=image&maxWidth=500&maxHeight=300&binaryBodyID=7132')
    })

    test("expect image width to be configurable, but only in downloadImage mode", () => {
        expect(getCacheableImage('https://jivedemo.jiveon.com/servlet/JiveServlet/downloadImage/38-2097-243635/1350-900/michael-haslim-21018-unsplash.jpg', 250))
            .toBe('https://jivedemo.jiveon.com/api/core/v3/images/243635?width=250')

        expect(getCacheableImage('https://jivedemo.jiveon.com/servlet/JiveServlet/previewBody/5154-102-1-7132/fleurtreurniet325960-unsplash.jpg', 250))
            .toBe('https://jivedemo.jiveon.com/servlet/JiveServlet?bodyImage=true&contentType=image&maxWidth=500&maxHeight=300&binaryBodyID=7132')
    })
})

describe("findContentImage", () => {
    test("should be a function", () => {
        expect(typeof findContentImage).toBe('function')
    })

    test("should return null on incompatible 1st argument", () => {
        expect(findContentImage({})).toBe(null)
        expect(findContentImage({response: false})).toBe(null)
        expect(findContentImage({content: {list:[]}})).toBe(null)
        expect(findContentImage(false)).toBe(null)
        expect(findContentImage('')).toBe(null)
        expect(findContentImage('aaa')).toBe(null)
        expect(findContentImage(500)).toBe(null)
        expect(findContentImage(undefined)).toBe(null)
    })

    test("should throw error on invalid 2nd argument", () => {
        expect(() => findContentImage({content:{text:'a'}}, 500)).toThrow()
        expect(() => findContentImage({content:{text:'a'}}, {})).toThrow()
        expect(() => findContentImage({content:{text:'a'}}, false)).toThrow()
        expect(() => findContentImage({content:{text:'a'}}, [])).toThrow()
        expect(() => findContentImage({content:{text:'a'}}, 'regex')).toThrow()
    })

    const testContentA = {
        content: {
            text: '<body><!-- [DocumentBodyStart:5ca86533-7f86-4957-a95f-e05fa05fae15] --><div class="jive-rendered-content"><p><span style="color: #000000; background-color: #ffffff;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris semper ultrices leo, ultrices pellentesque odio. Morbi vestibulum est arcu, vel mollis libero feugiat a. Suspendisse massa lorem, dictum vel blandit ut, rhoncus et felis. Vestibulum eleifend magna non metus posuere feugiat. Morbi sagittis congue risus, sed porta urna dictum sed. Ut rhoncus turpis orci, eu ullamcorper lacus cursus non. Aenean urna urna, porttitor a mauris et, sodales viverra dolor. Nunc dictum sollicitudin lacinia. Curabitur imperdiet nunc et hendrerit malesuada.</span></p><p><span style="color: #000000; background-color: #ffffff;"><a href="https://jivedemo.jiveon.com/servlet/JiveServlet/showImage/38-2097-243635/michael-haslim-21018-unsplash.jpg"><img alt="" class="image-1 jive-image j-img-original" height="900" src="https://jivedemo.jiveon.com/servlet/JiveServlet/downloadImage/38-2097-243635/1350-900/michael-haslim-21018-unsplash.jpg" style="" width="1350"/></a></span></p><p><span style="color: #000000; background-color: #ffffff;"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris semper ultrices leo, ultrices pellentesque odio. Morbi vestibulum est arcu, vel mollis libero feugiat a. Suspendisse massa lorem, dictum vel blandit ut, rhoncus et felis. Vestibulum eleifend magna non metus posuere feugiat. Morbi sagittis congue risus, sed porta urna dictum sed. Ut rhoncus turpis orci, eu ullamcorper lacus cursus non. Aenean urna urna, porttitor a mauris et, sodales viverra dolor. Nunc dictum sollicitudin lacinia. Curabitur imperdiet nunc et hendrerit malesuada.</span></span></p></div><!-- [DocumentBodyEnd:5ca86533-7f86-4957-a95f-e05fa05fae15] --></body>\n'
        }
    }

    test("should find image in regexp mode", () => {
        expect(findContentImage(testContentA))
            .toBe("https://jivedemo.jiveon.com/servlet/JiveServlet/downloadImage/38-2097-243635/1350-900/michael-haslim-21018-unsplash.jpg")
    })

    test("should find image in jquery mode", () => {
        expect(findContentImage(testContentA, "jquery"))
            .toBe("https://jivedemo.jiveon.com/servlet/JiveServlet/downloadImage/38-2097-243635/1350-900/michael-haslim-21018-unsplash.jpg")
    })
})