import {parse} from 'url'

const jive = window.jive
const gadgets = window.gadgets

const getUrlParemeters = gadgets.util.getUrlParameters

const cache = {}

// full tile url prsed as jive object
const tileUrl = function(){
    if (!cache.tileUrl) {
        cache.tileUrl = parse(getUrlParemeters().url, true)
    }

    return cache.tileUrl
}

//path that helps address images and other assets
const tilePath = function(){
    if (!cache.tilePath) {

        const _tileUrl = tileUrl()

        const pathChunks = _tileUrl.pathname ? _tileUrl.pathname.split('/') : []
        pathChunks.pop();
        cache.tilePath = pathChunks.join('/')
    }

    return cache.tilePath
}

// if called from tile - return tile id
const tileId = function(){
    if (!cache.tileId) {

        const _tileUrl = tileUrl()

        let _tileId = false
        if (_tileUrl.query && _tileUrl.query.syn_app) {
            const {syn_app} = _tileUrl.query
            _tileId = tileUrl.query['ref_' + syn_app].split(':')[1]
        }

        cache.tileId = _tileId
    }

    return cache.tileId
}

// parent: url of a root jive instance (e.g. mysite.com instead of domain-protected apps.mysite.com)
const parent = function(){
    if (!cache.parent) {
        cache.parent = getUrlParemeters().parent
    }

    return cache.parent
}

const getContainerAsync = function(){
    return new Promise((resolve, reject) => {

        if (cache.place) {
            resolve(cache.place)
        } else {
            jive.tile.getContainer(place => {
                cache.place = place
                resolve(place)
            })
        }
    })
}

export {tileId, tilePath, tileUrl, parent, getContainerAsync}
const tileProps = {tileId, tilePath, tileUrl, parent, getContainerAsync}
export default tileProps
