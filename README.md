# anrom-jive-app-tools

A set of simple tools that helps creating Jive tiles and apps. Also includes some common utilities  

## Requirements
* **npm** version 6.4.0 or above
* **node** version 8.12.0 or above


## Installation
`npm install anrom-jive-app-tools`

## Usage

Different sets of tools in this package can be imported in several ways.

You can import them all in a single variable:  
`import tools from 'anrom-jive-app-tools'`  
`import {tileProps} from 'anrom-jive-app-tools'`

Or import a number of functions from a single toolset if you don't intend to use others and don't want to make your 
bundle even larger:  
`import {jiveDate2Moment} from 'anrom-jive-app-tools/dateUtils'`

Here's the list of toolsets that the library offers:

## tileProps
`import {tileId, tilePath, tileUrl, parent, getContainerAsync} from 'anrom-jive-app-tools/tileProps'`  

Gives you access to the tile information before DOM loads 

### `tileId()`
**type:** function  
**returns:** String   
Id of a tile, e.g. `1582`. Can be useful if your domain security is turned off and you want to access tile's frame from within a tile.
```html
<iframe id="__gadget_j-app-tile-parent-1582"...    
```
**Note:** returns `undefined` if called from an app

### `tilePath()`
**type:** function  
**returns:** String  
Relative path to a tile's folder inside jive. Helps you load the resources directly. 
(`/resources/add-ons/9abb17d6-e0a4-4e3e-b3d7-dc29f1a9edae/6dc9c116f0/tiles/tile-search`)


### `tileUrl()`
**type:** function  
**returns:** Object  
Full URL of a tile, with query params  
**output example:**
```json
{
  "protocol": "http:",
  "slashes": true,
  "auth": null,
  "host": "192.168.1.200:8080",
  "port": "8080",
  "hostname": "192.168.1.200",
  "hash": null,
  "search": "?features=os-2.5,core-v3,jq-1.11,tile,responsive&ts=1548412809958&syn_app=e502h&ref_e502h=tileInstance:1063",
  "query": {
    "features": "os-2.5,core-v3,jq-1.11,tile,responsive",
    "ts": "1548412809958",
    "syn_app": "e502h",
    "ref_e502h": "tileInstance:1063"
  },
  "pathname": "/resources/add-ons/a8e957c9-a128-415d-9138-0f5dfffa4e7e/4f40de669b/tiles/product-tile-activity/view.html",
  "path": "/resources/add-ons/a8e957c9-a128-415d-9138-0f5dfffa4e7e/4f40de669b/tiles/product-tile-activity/view.html?features=os-2.5,core-v3,jq-1.11,tile,responsive&ts=1548412809958&syn_app=e502h&ref_e502h=tileInstance:1063",
  "href": "http://192.168.1.200:8080/resources/add-ons/a8e957c9-a128-415d-9138-0f5dfffa4e7e/4f40de669b/tiles/product-tile-activity/view.html?features=os-2.5,core-v3,jq-1.11,tile,responsive&ts=1548412809958&syn_app=e502h&ref_e502h=tileInstance:1063"
}
```

### `parent()`
**type:** function  
**returns:** String  
URL of your root jive instance (without the subdomain added by domain security 
settings) e.g. `http://myjivesite.com` instead of `http://apps.myjivesite.com`

### `getContainerAsync()`
**type:** async function  
**returns:** Promise  
Jive place in which tile instance is located

## utils
Regular utility functions that is often used in jive tile development  
`import {pause, unescapeHtmlEntities, splitArray, abridge, getCacheableImage, findContentImage, getContentImage, getImagelessHTML, jsonCopy, isEmptyObject} from 'anrom-jive-app-tools/utils'`

### `pause(milliseconds)`
Promise/async wrapper for `setTimeout`. If you need to set your code execution on hold, use it:
```javascript
async function myFunc(){
    /* do stuff */
    await pause(500)
    /* do another stuff */
} 
```

### `unescapeHtmlEntities(text)`
Text returned by jive API can contain special escape characters like **&amp;amp;** which stands for 
&. With usual react rendering (`<div>{text}</div>`) these characters are not being unescaped, which 
means it will appear in your tile as "Chip &amp;amp; Dale". To avoid that, use this function:   
`<div>{unescapeHtmlEntities(text)}</div>` 

### `splitArray(array, columns)`
Used to split a plain array into several relatively equal chunks (relatively - because last chunk 
can be shorter if division is with a remainder). This is usually used to split data model array to
display in several columns 

### `abridge(text, [length=160])`
Used to display text, smartly truncated to end with a whole word and with '...' at the end. If there's 
only one word left after truncation - it will be left truncated and appedned with '...'

### `getCacheableImage(initialImageURL, [imageWidth=500, thumbnail=false])`
Check image URL against few rules, detecting images hosted within jive. If such image is detected - 
special URL is being returned, allowing image caching and size reduction. It's **highly recommended** 
to use it when rendering images in terms of performance.  
**Note:** I don't know how "thumbnail" mode is defferent from default, I'm just passing this 
argument to the URL

### `findContentImage(contentItem, defaultImageURL, [mode='regexp'])`
Searches jive API content item (document, discussion etc) for first content image URL. It has 3 modes. 
By default regular expression (`regexp`) mode is used. It's recommended to use it that way, but if 
you're experiencing some edge cases, you may want to use other modes. Though, each of them has it's 
own flaw.  

`api` mode relies on jive API's native `contentImages` field. It's fastest way to detect an image.
 The drawback is that this field is set on content creation and then never being updated, even if the 
content item does.

`jquery` mode creates the entire content's DOM in browser memory and then searches for an image. It's 
the most precise way, but it's also a slowest one. Also, **all** images in the parsed content are 
being requested from the network. This cat hit the overal performance even harder. This mode is 
only recommended as a temporal solution if `regexp` mode fails and is not yet fixed by me :)   

### `getContentImage(contentItem, [options])`
The combination of the previous two functions. Finds image in jive content and if it's a jive-hosted 
image - converts it's URL to a cacheable and resized one. **Recommended for usage by default** 
when the job is to display a content preview.

`options` parameter is optional. Default options are
```json
{
  "imageWidth": 500,
  "defaultImageURL": "",
  "mode": "regexp",
  "thumbnail": false
}
``` 
(they're the same as default parameters of the functions above)


### `getImagelessHTML(htmlText)`
Sometimes you may need html stripped of all images. This is a function for such cases.

### `jsonCopy(object)`
Makes a deep copy of JS data object (ensuring that there will be no links to it in other parts of a 
program). *Don't use* for objects with function values, class instances etc.

### `isEmptyObject(object)`
Returns **true** if the given object has no values (`{}`), **false** otherwise.

## dateUtils
Working with dates in jive requires same actions all the time. I grouped them in a few functions  
`import {jiveDateFormat, jiveDate2Moment, moment2JiveDate, jiveDate2TS, TS2JiveDate} from 'anrom-jive-app-tools/dateUtils'`

### `jiveDateFormat`
Simple string with the value `YYYY-MM-DDTHH:mm:ss.SSSZ`, which is a formatting pattern for moment.js

Next functions are quite self-explanatory:
### `jiveDate2Moment(jiveDate)`
### `moment2JiveDate(momentDate)`
### `jiveDate2TS(JiveDate)`
### `TS2JiveDate(timestamp)`

## fetchPromise
Provides a set of async promise-wrappers for jive tile osapi network methods.  
All "promise..." functions are throwing the entire response as a reject/error:

Use as promise (ES5 usage):
```javascript
function getData(){
    promiseRestGet('/people/@me').then(function(response){
        /* do your stuff */
    }).catch(function(error){
        /* process error */
    })
}
```

Use as async function (ES2017+ usage):
```ecmascript 6
async function getData(){
    try {
        const viewer = await promiseRestGet('/people/@me')
        /* do your stuff */
    } catch (error) {
        /* process error */
    }
}
```

### `promiseOsapiRequest(functionOrExecutable)`
**type:** async function  
**returns:** Promise (Object)  
**params:**
* **functionOrExecutable** - jive osapi executabe or function that takes `osapi.jive.corev3` as a 
single argument and returns such executable:

Usage option 1:
```ecmascript 6
const viewer = await promiseOsapiRequest(osapi.jive.corev3.people.getViewer())
```

Usage option 2:
```ecmascript 6
const viewer = await promiseOsapiRequest(api => api.people.getViewer())
```
 
### `promiseHttpGet(...args)`
Promise/async wrapper for [osapi.http.get](https://opensocial.atlassian.net/wiki/spaces/OSD/pages/527081/Osapi.http+v0.9#Osapi.http(v0.9)-osapi.http.get). Parameters are forwarded without change

Example:
```javascript
const posts = await promiseHttpPost('//apisrver.com/api/v1/posts')
```

### `promiseHttpPost(...args)` 
Promise/async wrapper for [osapi.http.get](https://opensocial.atlassian.net/wiki/spaces/OSD/pages/527081/Osapi.http+v0.9#Osapi.http(v0.9)-osapi.http.post). Parameters are forwarded without change

Example:
```javascript
const creationResponse = await promiseHttpPost('//apisrver.com/api/v1/posts/create', {
    authz: 'signed',
    headers : { 'Content-Type' : ['application/json'] },
    body: {
        title: 'My new blogpost',
        text: '<p>My new blogpost body</p>'
    }
})
```

### `promiseRestGet(endpoint)`
Promise/async wrapper for osapi.jive.core.get, which is an OSAPI endpoint for regular jive rest requests.

Example:
```javascript
const viewer = await promiseRestGet('/people/@me')
```

### `promiseRestPost(endpoint, options)` 
Promise/async wrapper for osapi.jive.core.post, which is an OSAPI endpoint for regular jive rest requests.

Example:
```javascript
const viewer = await promiseRestPost('/executeBatch', {
    type: "application/json",
    body: batch
})

```
### `promiseRestDelete(endpoint)`
Promise/async wrapper for osapi.jive.core.delete, which is an OSAPI endpoint for regular jive rest requests.
Usage is the same as promiseRestGet
 
### `promiseRestPut(endpoint, options)` 
Promise/async wrapper for osapi.jive.core.put, which is an OSAPI endpoint for regular jive rest requests.
Usage is the same as promiseRestPost

### `CurrentPlace([<function> filter])` 
A class for getting the current place (sophisticated alternative to `getContainerAsync`)

Usage:
```javascript
const currentPlace = new CurrentPlace()
const place = await currentPlace.fetch() 
```

By default it returns not the jive place object, but the shortened version of the next format:
```javascript
return {
  "id": rawPlace.placeID,
  "uri": rawPlace.resources.self.ref,
  "html": rawPlace.resources.html.ref,
  "name": unescapeHtmlEntities(rawPlace.name),
  "type": "place"
}
```

But if you want it another way, a filter function can be passed to a constructor:
```javascript
const currentPlace = new CurrentPlace(rawPlace => {
    return rawPlace.resources.html.ref
})
```
or even this way, if you want a raw unfiltered place object
```javascript
const currentPlace = new CurrentPlace(rawPlace => rawPlace)
```
