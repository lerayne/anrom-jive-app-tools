# anrom-jive-app-tools

### Requirements
* `osapi` global variable have to be exported as `'jive/osapi'` in webpack externals
* `gadgets` global variable have to be exported as `'jive/gadgets'` in webpack externals

## Installation
`npm install --save anrom-jive-app-tools`

## Tools
Global import
`import tools from 'anrom-jive-app-tools'`
`import {tileProps} from 'anrom-jive-app-tools'`

### tileProps
Gives you access to some valuable information about the tile before DOM loads

`import tools from 'anrom-jive-app-tools/tileProps'`
`import {tileId, tilePath, tileUrl, parent} from 'anrom-jive-app-tools/tileProps'`

**tileId** - id of a tile, e.g. `1582`. Can be useful if your domain security is turned off and you want to access tile's frame from within a tile.
```html
<iframe 
    id="__gadget_j-app-tile-parent-1582" 
    name="__gadget_j-app-tile-parent-1582" 
    onload="window.__gadgetOnLoad('https://mysite.jiveon.com/resources/add-ons/9abb17d6-e0a4-4e3e-b3d7-dc29f1a9edae/6dc9c116f0/tiles/tile-search/view.html?syn_app=w5d5q&amp;ref_w5d5q=tileInstance:1582', 'j-app-tile-parent-1582');"
></iframe>
```
Note: returns `undefined` if called from an app

**tilePath** - relative path to a tile's folder inside jive. Helps you load the resources directly.
example: `/resources/add-ons/9abb17d6-e0a4-4e3e-b3d7-dc29f1a9edae/6dc9c116f0/tiles/tile-search`

**tileUrl** - full URL of a tile, parsed as JS object with query params

**parent** - URL of your jive instance without the domain-security subdomain  
`http://myjivesite.com` instead of `http://apps.myjivesite.com`
