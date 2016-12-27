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

**tileId** - id of a tile.  
Note: returns `undefined` if called from an app

**tilePath** - path to a tile's folder inside jive. Helps you load the resources directly

**tileUrl** - full URL of a tile, parsed as JS object with query params

**parent** - URL of your jive instance without the domain-security subdomain  
`http://myjivesite.com` instead of `http://apps.myjivesite.com`
