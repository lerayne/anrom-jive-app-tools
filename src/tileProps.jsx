import {parse} from 'url'
//import gadgets from 'jive/gadgets'

const urlParemeters = window.gadgets.util.getUrlParameters()

// parent: url of a root jive instance (e.g. mysite.com instead of domain-protected apps.mysite.com)
const {parent} = urlParemeters;

// full tile url prsed as jive object
const tileUrl = parse(urlParemeters.url, true)

// if called from tile - return tile id
let tileId
if (tileUrl.query && tileUrl.query.syn_app) {
    const {syn_app} = tileUrl.query
    tileId = tileUrl.query['ref_' + syn_app].split(':')[1]
}

//path that helps address images and other assets
const pathChunks = tileUrl.pathname.split('/')
pathChunks.pop();
const tilePath = pathChunks.join('/')

export {tileId, tilePath, tileUrl, parent}
const tileProps = {tileId, tilePath, tileUrl, parent}
export default tileProps
