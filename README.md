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

# tileProps
```javascript
import {
    tileId, 
    tilePath, 
    tileUrl, 
    parent, 
    getContainerAsync
} from 'anrom-jive-app-tools/tileProps'
```

Gives you access to the tile information before DOM loads 

### `tileId()` 
**returns:** String; Id of a tile (string), e.g. `1582`. Can be useful if your domain security is turned off and you want to access tile's frame from within a tile.
```html
<iframe id="__gadget_j-app-tile-parent-1582"...    
```
**Note:** returns `undefined` if called from an app

### `tilePath()` 
**returns:** String; Relative path to a tile's folder inside jive. Helps you load the resources directly. 
(`/resources/add-ons/9abb17d6-e0a4-4e3e-b3d7-dc29f1a9edae/6dc9c116f0/tiles/tile-search`)


### `tileUrl()`
**returns:** Object; Full URL of a tile, with query params  
Output example:
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
**returns:** String; URL of your root jive instance (without the subdomain added by domain security 
settings) e.g. `http://myjivesite.com` instead of `http://apps.myjivesite.com`

### `async getContainerAsync()`
**returns:** Promise(object); Jive place in which tile instance is located

# utils
Regular utility functions that is often used in jive tile development  
```javascript
import {
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
} from 'anrom-jive-app-tools/utils'
```

### `async pause(milliseconds)`
**returns:** Promise(none); Promise/async wrapper for `setTimeout`. If you need to set your code execution on hold, use it:
```javascript
async function myFunc(){
    /* do stuff */
    await pause(500)
    /* do another stuff */
} 
```

### `unescapeHtmlEntities(text)`
**returns:** String;   
Text returned by jive API can contain special escape characters like **&amp;amp;** which stands for 
&. With usual react rendering (`<div>{text}</div>`) these characters are not being unescaped, which 
means it will appear in your tile as "Chip &amp;amp; Dale". To avoid that, use this function:   
`<div>{unescapeHtmlEntities(text)}</div>` 

### `splitArray(array, columns)`
**returns:** Array(Arrays);  
Used to split a plain array into several relatively equal chunks (relatively - because last chunk 
can be shorter if division is with a remainder). This is usually used to split data model array to
display in several columns 

### `abridge(text, [length=160])`
**returns:** String;  
Used to display text, smartly truncated to end with a whole word and with '...' at the end. If there's 
only one word left after truncation - it will be left truncated and appedned with '...'

### `getCacheableImage(initialImageURL, [imageWidth=500, thumbnail=false])`
**returns:** String;   
Check image URL against few rules, detecting images hosted within jive. If such image is detected - 
special URL is being returned, allowing image caching and size reduction. It's **highly recommended** 
to use it when rendering images in terms of performance.  
**Note:** I don't know how "thumbnail" mode is defferent from default, I'm just passing this 
argument to the URL

### `findContentImage(contentItem, defaultImageURL, [mode='regexp'])`
**returns:** String;   
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
**returns:** String;   
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
**returns:** String;   
Sometimes you may need html stripped of all images. This is a function for such cases.

### `jsonCopy(object)`
**returns:** Object;   
Makes a deep copy of JS data object (ensuring that there will be no links to it in other parts of a 
program). *Don't use* for objects with function values, class instances etc.

### `isEmptyObject(object)`
**returns:** Boolean;   
Returns **true** if the given object has no values (`{}`), **false** otherwise.

# dateUtils
Working with dates in jive requires same actions all the time. I grouped them in a few functions  
```javascript
import {
    jiveDateFormat, 
    jiveDate2Moment, 
    moment2JiveDate, 
    jiveDate2TS, 
    TS2JiveDate
} from 'anrom-jive-app-tools/dateUtils'
```

### `jiveDateFormat`
**type:** String;   
Simple string with the value `YYYY-MM-DDTHH:mm:ss.SSSZ`, which is a formatting pattern for moment.js

Next functions are quite self-explanatory:
### `jiveDate2Moment(jiveDate)`
### `moment2JiveDate(momentDate)`
### `jiveDate2TS(JiveDate)`
### `TS2JiveDate(timestamp)`

# fetchPromise
```javascript
import {
    promiseOsapiRequest,
    promiseHttpGet,
    promiseHttpPost,
    promiseRestGet,
    promiseRestPost,
    promiseRestPut,
    promiseRestDelete,
    promiseBatch,
    CurrentPlace
} from 'anrom-jive-app-tools/fetchPromise'
```
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
```javascript
async function getData(){
    try {
        const viewer = await promiseRestGet('/people/@me')
        /* do your stuff */
    } catch (error) {
        /* process error */
    }
}
```

### `async promiseOsapiRequest(functionOrExecutable)`
**returns:** Promise(Object)  
Takes jive osapi executabe or function that takes `osapi.jive.corev3` as a 
single argument and returns such executable:

Usage option 1:
```javascript
const viewer = await promiseOsapiRequest(osapi.jive.corev3.people.getViewer())
```

Usage option 2:
```javascript
const viewer = await promiseOsapiRequest(api => api.people.getViewer())
```
 
### `async promiseHttpGet(...args)`
Promise/async wrapper for [osapi.http.get](https://opensocial.atlassian.net/wiki/spaces/OSD/pages/527081/Osapi.http+v0.9#Osapi.http(v0.9)-osapi.http.get). Parameters are forwarded without change

Usage example:
```javascript
const posts = await promiseHttpPost('https://apisrver.com/api/v1/posts')
```

### `async promiseHttpPost(...args)` 
Promise/async wrapper for [osapi.http.get](https://opensocial.atlassian.net/wiki/spaces/OSD/pages/527081/Osapi.http+v0.9#Osapi.http(v0.9)-osapi.http.post). Parameters are forwarded without change

Usage example:
```javascript
const creationResponse = await promiseHttpPost('https://apisrver.com/api/v1/posts/create', {
    authz: 'signed',
    headers : { 'Content-Type' : ['application/json'] },
    body: {
        title: 'My new blogpost',
        text: '<p>My new blogpost body</p>'
    }
})
```

### `async promiseRestGet(endpoint)`
Promise/async wrapper for osapi.jive.core.get, which is an OSAPI endpoint for regular jive rest requests.

Usage example:
```javascript
const viewer = await promiseRestGet('/people/@me')
```

### `async promiseRestPost(endpoint, options)` 
Promise/async wrapper for osapi.jive.core.post, which is an OSAPI endpoint for regular jive rest requests.

Usage example:
```javascript
const batch = [/* your batch entries */]
const viewer = await promiseRestPost('/executeBatch', {
    type: "application/json",
    body: batch
})
```

### `async promiseRestDelete(endpoint)`
Promise/async wrapper for osapi.jive.core.delete, which is an OSAPI endpoint for regular jive rest requests.
Usage is the same as `promiseRestGet`
 
### `async promiseRestPut(endpoint, options)` 
Promise/async wrapper for osapi.jive.core.put, which is an OSAPI endpoint for regular jive rest requests.
Usage is the same as `promiseRestPost`

### `async promiseBatch(entries, createBatchEntry)`
This function will be reworked. No docs for now

### `class CurrentPlace([<function> filter])` 
A class for getting the current place (sophisticated alternative to `getContainerAsync`)

Usage example:
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

# ContinuousLoader
```javascript
import {
    ContinuousLoader, 
    ContinuousLoadJiveREST, 
    ContinuousLoadJiveOSAPI
} from 'anrom-jive-app-tools/ContinuousLoader'
```
A set of classes for sequential requests and frontend-side content filtering

### `class ContinuousLoader(asyncFunction, filter, [options={}])`
**params:** 
* **asyncFunction** - ES2017 async function or any function that returns a Promise. **Important:** you 
should not pass Promise itself there, but a function that returns Promise when called.
* **filter** - async/promise function that is being called for each collection to define whether 
it's members pass to the final set or not (interface below)
* **options** - other parameters (listed below)
    * required:
        * `getNextAsyncFunc` - function that returns new async/promise function for the next call. 
        It can be based on previous async call's results.
    * optional (have defaults):
        * `debug` (false) - turns on console logging
        * `targetCount` (10) - Desired number of the items. Per one call of `loadNext` ContinuousLoader 
        will make several requests and filter the results until the number is reached
        * `maxTriesPerLoad` (5) - Number of requests per single `loadNext` is by default limited to 5. 
        You can set it to 0 to allow infinite calls (not safe for performance) or just pass another
        number 
        * `getError` - calculates error type based on async/promise function response. By default 
        just looks for `response.error` 
        * `getList` - gets list of items from async/promise function response. By default looks for 
        `response.list`

**Argument functions' interfaces:**

**`async filter(currentList, existingList)`**  
*should return:* Array; Filtered list of items   
* `currentList` - results collection received with the latest `asyncFunction` call
* `existingList` - results from previous calls that have already passed this filter, but haven't 
been returned by `loadNext` (usually used to 
remove duplicates). Note that the filtered items which are already returned by `loadNext` 
are being cleared and will not be passed to this parameter again, so if you want to remove all the 
duplicates, you should check items against your target collection too.

*Note:* since this function receives the array and returns the array, it can be used not only for 
filtering, but also for mapping (transforming) the array either before filtering, or after it. Also,
this function can be async if needed, so you can make another async operations inside it.

**`getNextAsyncFunc(asyncFunctionResponse)`**  
*should return:* async/promise function for the next call, analogical to the `asyncFunction`
* `asyncFunctionResponse` - response of the previous async/promise function

**`getError(asyncFunctionResponse)`**  
*should return:* Error to display if there is one, `false` if no errors found.
* `asyncFunctionResponse` - response of the previous async/promise function

**`getList(asyncFunctionResponse)`**  
*should return:* Array of items
* `asyncFunctionResponse` - response of the previous async/promise function

#### `async ContinuousLoader.loadNext()`
**returns:** Promise(Object)  
Main loading function that tries to loads first/next stated number of items 