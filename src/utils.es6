export function unescapeHtmlEntities(text) {
    const temp = document.createElement('div')
    temp.innerHTML = text
    return temp.innerText || temp.textContent
}

export function pause(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function splitArray(array, chunksNumber) {
    const newArray = []

    for (let i = 0; i < chunksNumber; i++){
        newArray.push([])
    }

    if (array !== undefined && array.length){
        const chunkLength = Math.ceil(array.length / chunksNumber)

        array.forEach((item, i) => {
            const chunkNumber = Math.floor(i / chunkLength)
            newArray[chunkNumber].push(item)
        })
    }

    return newArray
}



const utils = {
    pause,
    unescapeHtmlEntities,
    splitArray
}

export default utils