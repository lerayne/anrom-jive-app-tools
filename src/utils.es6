const jQuery = window.jQuery

export function unescapeHtmlEntities(text) {
    if(typeof text !== 'string') throw new Error('Argument should be a string')

    const temp = document.createElement('div')
    temp.innerHTML = text.replace(/<|&lt;/gi, '‹').replace(/>|&gt;/gi, '›')
    return temp.innerText || temp.textContent
}

export function pause(ms=0) {
    if (typeof ms !== 'number') throw new Error('Expected parameter to be a number')
    if (ms < 0) throw new Error("We can't do time travel :) Please input a positive number or 0")

    return new Promise(resolve => setTimeout(resolve, ms))
}

export function splitArray(array, chunksNumber) {
    if (!(array instanceof Array)) throw new Error ('1st argument should be an array')
    if (typeof chunksNumber !== 'number') throw new Error ('1st argument should be an array')
    if (chunksNumber <= 0) return []
    if (chunksNumber === 1) return array

    const newArray = []

    for (let i = 0; i < chunksNumber; i++) {
        newArray.push([])
    }

    if (array !== undefined && array.length) {
        const chunkLength = Math.ceil(array.length / chunksNumber)

        array.forEach((item, i) => {
            const chunkNumber = Math.floor(i / chunkLength)
            newArray[chunkNumber].push(item)
        })
    }

    return newArray
}

export function abridge(text, length = 160) {

    if (typeof text !== 'string') {
        throw new Error(`"abridge" 1st argument must be a string (${typeof text} given)`)
    }

    //if it's less than limit - just return it
    if (text.length <= length) return text

    let newText = text.slice(0, length)

    // if the next symbol is not a whitespace and not a punctuation - remove last word
    if (!text[length].match(/\s|\.|,|:|;|!|\?/)) {

        let words = newText.split(' ')

        //remove last word (cause it can be broken, or too long in case of a link)
        if (words.length > 1) {
            words = words.slice(0, words.length - 1)
        }

        newText = words.join(' ')
    }

    // remove commas and dots from a last word
    newText = newText.replace(/(\.|,|;|:)$/, '')

    return newText + '...'
}

export function getCacheableImage(initialImageURL, imageWidth = 500, thumbnail = false) {

    //return initialImageURL
    if (!initialImageURL) return initialImageURL

    if (typeof initialImageURL !== 'string') {
        throw new Error ('1st argument should be falsy value or string')
    }
    if (typeof imageWidth !== 'undefined' && typeof imageWidth !== 'number'){
        throw new Error ('2nd argument should be a number if defined')
    }

    const jiveStorageResult =
        initialImageURL.match(/(.+)servlet\/JiveServlet\/(downloadImage|previewBody)\/([\d-]+)\/(.+)/i)

    //console.log('jiveStorageResult', jiveStorageResult)

    if (!jiveStorageResult || !jiveStorageResult[3]) return initialImageURL

    //get jive image ID from URL
    const imageNumberChunks = jiveStorageResult[3].split('-')
    const imageID = imageNumberChunks[imageNumberChunks.length - 1]

    switch (jiveStorageResult[2]){
        case 'downloadImage':
            return jiveStorageResult[1]
                + 'api/core/v3/images/' + imageID + '?width=' + imageWidth
                + (thumbnail ? '&thumbnail=true' : '')
        case 'previewBody':
            return jiveStorageResult[1]
                + 'servlet/JiveServlet?bodyImage=true&contentType=image&maxWidth=500&maxHeight=300'
                + '&binaryBodyID=' + imageID
    }
}

export function findContentImage(contentItem, mode = 'regexp', fallback = true) {

    if (!contentItem || !contentItem.content || !contentItem.content.text) return null

    if (typeof mode !== 'undefined' && !['regexp', 'api', 'jquery'].includes(mode)) {
        throw new Error('2nd argument should be "regexp"|"api"|"jquery"')
    }

    let image

    function getFromApi(){
        if (contentItem.contentImages && contentItem.contentImages.length) {
            return contentItem.contentImages[0].ref
        } else if (contentItem.thumbnailURL) {
            return contentItem.thumbnailURL
        }
        return false
    }

    switch (mode) {
        case 'api':
            // version 1: take from API. Downside: API images list never updates after content creation
            image = getFromApi()
            break
        case 'jquery':
            //version 2: find image links with jQuery. Downside: it requests all the images content item has
            image = jQuery ? jQuery(contentItem.content.text).find('img').attr('src') : false
            break
        case 'regexp':
            //version 3: Find image URLs by regExp
            const images = contentItem.content.text.match(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/im)
            image = (images && images[1]) ? images[1] : false
            break
    }

    if (!image && mode !== 'api' && fallback) {
        image = getFromApi()
    }

    return image
}

export function getImagelessHTML(htmlText) {
    return htmlText.replace(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/gim, '')
}

export function getContentImage(contentItem, options={}){

    const defaultOptions = {
        imageWidth: 500,
        mode: 'regexp',
        thumbnail: false,
        fallback: true
    }

    options = {
        ...defaultOptions,
        ...options
    }

    const {imageWidth, mode, thumbnail, fallback} = options

    return getCacheableImage(findContentImage(contentItem, mode, fallback), imageWidth, thumbnail)
}

export function jsonCopy (obj) {
    if (typeof obj !== 'object') return null
    try {
        return JSON.parse(JSON.stringify(obj))
    } catch (error) {
        console.error('Warning! Argument is not a valid JSON. Details:', error)
    }
}

export function isEmptyObject (obj){
    if (typeof obj !== 'object') return null
    return Object.keys(obj).length === 0
}

const utils = {
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
}

export default utils