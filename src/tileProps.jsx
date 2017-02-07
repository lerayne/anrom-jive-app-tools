import {parse} from 'url'
import jive from 'jive'

let getUrlParemeters

if (gala != undefined && typeof gala === 'object') {
    getUrlParemeters = function(){
        return {
            parent: jive.tile.getJiveURL() || '',
            url: jive.tile.getAppURL() || ''
        }
    }
} else {
    const gadgets = require('jive/gadgets')
    getUrlParemeters = gadgets.util.getUrlParameters
}

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

export {tileId, tilePath, tileUrl, parent}
const tileProps = {tileId, tilePath, tileUrl, parent}
export default tileProps
