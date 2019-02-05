const jQuery = window.jQuery

export function unescapeHtmlEntities(text) {
    const temp = document.createElement('div')
    temp.innerHTML = text
    return temp.innerText || temp.textContent
}

export function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function splitArray(array, chunksNumber) {
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

    //cut text
    text = text.slice(0, length)

    let words = text.split(' ')

    //remove last word (cause it can be broken, or too long in case of a link)
    if (words.length > 1) {
        words = words.slice(0, words.length - 1)
    }

    // remove commas and dots from a last word
    words[words.length - 1] = words[words.length - 1].replace(/\.|,/gi, '')

    return words.join(' ') + '...'
}

export function getCacheableImage(initialImageURL, imageWidth = 500, thumbnail = false) {

    //return initialImageURL
    if (!initialImageURL) return initialImageURL

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

export function findContentImage(contentItem, defaultImageURL, mode = 'regexp') {

    if (!contentItem || !contentItem.content || !contentItem.content.text) return null

    switch (mode) {
        case 'api':
            // version 1: take from API. Downside: API images list never updates after content creation
            if (contentItem.contentImages && contentItem.contentImages.length) {
                return contentItem.contentImages[0].ref
            }
            return defaultImageURL
        case 'jquery':
            //version 2: find image links with jQuery. Downside: it requests all the images content item has
            return jQuery ? ($(contentItem.content.text).find('img').attr('src') || defaultImageURL) : defaultImageURL
        case 'regexp':
            //version 3: Find image URLs by regExp
            const images = contentItem.content.text.match(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/im)
            return (images && images[1]) ? images[1] : defaultImageURL
        default:
            return defaultImageURL
    }
}

export function getImagelessHTML(htmlText) {
    return htmlText.replace(/<img[^>]*src=["']?([^>"']+)["']?[^>]*>/gim, '')
}

export function getContentImage(contentItem, options={}){

    const defaultOptions = {
        imageWidth: 500,
        defaultImageURL: '',
        mode: 'regexp',
        thumbnail: false
    }

    options = {
        ...defaultOptions,
        ...options
    }

    const {imageWidth, defaultImageURL, mode, thumbnail} = options

    return getCacheableImage(findContentImage(contentItem, defaultImageURL, mode), imageWidth, thumbnail)
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