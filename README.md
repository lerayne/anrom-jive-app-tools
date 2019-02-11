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





# Contents
- **[tileProps](#tileprops)** - utils for getting additional info about the tile and it's location
  - [tileId](#tileid)
  - [tilePath](#tilepath)
  - [tileUrl](#tileurl)
  - [parent](#parent)
  - [getContainerAsync](#async-getcontainerasync)
- **[utils](#utils)** - other simple utilities
  - [pause](#async-pausemilliseconds)
  - [unescapeHtmlEntities](#unescapehtmlentitiestext)
  - [splitArray](#splitarrayarray-columns)
  - [abridge](#abridgetext-length160)
  - [getCacheableImage](#getcacheableimageinitialimageurl-imagewidth500-thumbnailfalse)
  - [findContentImage](#findcontentimagecontentitem-moderegexp-fallbackfalse)
  - [getContentImage](#getcontentimagecontentitem-options)
  - [getImagelessHTML](#getimagelesshtmlhtmltext)
  - [jsonCopy](#jsoncopyobject)
  - [isEmptyObject](#isemptyobjectobject)
- **[dateUtils](#dateutils)** - utils for work with jive dates
  - [jiveDateFormat](#jivedateformat)
  - [jiveDate2Moment](#jivedate2momentjivedate)
  - [moment2JiveDate](#moment2jivedatemomentdate)
  - [jiveDate2TS](#jivedate2tsjivedate)
  - [TS2JiveDate](#ts2jivedatetimestamp)
- **[fetchPromise](#fetchpromise)** - promise/async wrappers for tile network requests
  - [promiseOsapiRequest](#async-promiseosapirequestfunctionorexecutable)
  - [promiseHttpGet](#async-promisehttpgetargs)
  - [promiseHttpPost](#async-promisehttppostargs)
  - [promiseRestGet](#async-promiserestgetendpoint)
  - [promiseRestPost](#async-promiserestpostendpoint-options)
  - [promiseRestPut](#async-promiserestputendpoint-options)
  - [promiseRestDelete](#async-promiserestdeleteendpoint)
  - [promiseBatch](#async-promisebatchentries-createbatchentry)
  - [CurrentPlace](#class-currentplacefunction-filter)
- **[ContinuousLoader](#continuousloader)** - smart tool for client-side filtering
  - [ContinuousLoader](#class-continuousloaderasyncfunction-filter-options)
    - [Methods](#methods)
    - [Usage Examples](#usage-examples)
  - [ContinuousLoadJiveREST](#class-continuousloadjiverestasyncfunction-filter-options)
  - [ContinuousLoadJiveOSAPI](#class-continuousloadjiveosapiasyncfunction-filter-options)






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
**returns:** String; Id of a tile (string), e.g. `1582`. 

Can be useful if your domain security is turned off and you want to access tile's frame from within a tile.  

Usage example:  
```html
//Jive main page code containing a tile
<iframe id="__gadget_j-app-tile-parent-1582"... />    
```

```javascript
//Tile code
import {tileId} from 'anrom-jive-app-tools/tileProps'
const iframe = window.parent.document.querySelector('#__gadget_j-app-tile-parent-' + tileId())
```
**Note:** returns `undefined` if called from an app


### `tilePath()` 
**returns:** String; Relative path to a tile's folder inside jive. 

Helps you load the resources directly. 
(`/resources/add-ons/9abb17d6-e0a4-4e3e-b3d7-dc29f1a9edae/6dc9c116f0/tiles/tile-search`)

This function comes in handy when you need to use a file that resides in tile's package, but you 
don't know it's final address, because tile will have a new URL after each upload of the package.
Sometimes you can just use relative URLs and rely on webpack loaders to place file where they have 
to be. But in case of fonts, for example, you can't. 

Usage example:
```javascript
import {tilePath} from 'anrom-jive-app-tools/tileProps'
import LatoRegularWOFF from '../fonts/Lato-Regular.woff'

export default function FontLoader() {
    return <style>{
        `@font-face {
            font-family: 'Lato-Regular';
            font-style: normal;
            font-weight: 400;
            src: url(${tilePath()}/fonts/${LatoRegularWOFF}) format('woff');
        }`
    }</style>
}
```

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
**returns:** Promise(Object); Jive place in which tile instance is located

Usage example:
```javascript
const currentPlace = await getContainerAsync()
const content = await promiseRestGet('/places/' + currentPlace.placeID + '/contents')
```











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
**returns:** Promise(none); 

Promise/async wrapper for `setTimeout`. If you need to set your code execution on hold, use it:
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

**Note:** This function will not allow you to place HTML: it will turn < and > symbols to small 
quotation marks: ‹ and ›  


### `splitArray(array, columns)`
**returns:** Array(Arrays);  

Used to split a plain array into several relatively equal chunks (relatively - because last chunk 
can be shorter if division is with a remainder). This is usually used to split data model array to
display in several columns 

Usage example:
```javascript
const columns = splitArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 4)
// [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17]]
```


### `abridge(text, [length=160])`
**returns:** String; 
 
Used to display text, smartly truncated to end with a whole word and with '...' at the end. If there's 
only one word left after truncation - it will be left truncated and appedned with '...'. Also it 
will trim the `.`, `,`, `:` and `;` at the end of last word, but leave `?` or `!` 


### `getCacheableImage(initialImageURL, [imageWidth=500, thumbnail=false])`
**returns:** String; Transformed URL if `initialImageURL` matches the pattern, `initialImageURL` 
if not; Any falsy value, if given as `initialImageURL`   

Check image URL against few rules, detecting images hosted within jive. If such image is detected - 
special URL is being returned, allowing image caching and size reduction. It's **highly recommended** 
to use it when rendering images in terms of performance.  

**Note:** I don't know how "thumbnail" mode is different from default, I'm just passing this 
argument to the URL


### `findContentImage(contentItem, [mode='regexp', fallback=false])`
**returns:** String; `false` if no image found; `null` if `contentItem` is malformed  

Searches jive API content item (document, discussion etc) for first content image URL. 

**params:**
* `contentItem` - jive API content item (documen, discussion etc)
* `mode` ("regexp") - select mode (see below)
* `fallback` (true) - if set to true or omitted *and* the `mode` parameter is *not* `api` 
         - it will fall back to jive API in case the selected method hasn't found any images. 

**modes:**   
By default regular expression ("regexp") mode is used. It's recommended to use it that way, but if 
you're experiencing some edge cases, you may want to use other modes. Though, each of them has it's 
own flaw.  

`api` mode relies on jive API's native `contentImages` and `thumbnailURL` fields. It's fastest way to detect an image.
 The drawback is that at least `contentImages` field is populated on content creation and then never being updated, even if the 
content item does.

`jquery` mode creates the entire content's DOM in browser memory and then searches for an image. It's 
the most precise way, but it's also a slowest one. Also, **all** images in the parsed content are 
being requested from the network. This can *severely* hit the overall performance. This mode is 
only recommended as a *temporal solution* if `regexp` mode fails and is not yet fixed by me :)   


### `getContentImage(contentItem, [options])`
**returns:** String;   

The combination of the previous two functions. Finds image in jive content and if it's a jive-hosted 
image - converts it's URL to a cacheable and resized one. *Recommended for usage by default* 
when the job is to display a content preview.

`options` parameter is optional. Option names and their defaults are:
```json
{
  "imageWidth": 500,
  "mode": "regexp",
  "thumbnail": false,
  "fallback": true
}
``` 
(they're the same as default parameters of the functions above)


### `getImagelessHTML(htmlText)`
**returns:** String;   
Sometimes you may need html stripped of all images. This is a function for such cases.


### `jsonCopy(object)`
**returns:** Object;   

Makes a deep copy of JS data object (ensuring that there will be no references to it's members in other parts of a 
program). *Don't use* for objects with function values, class instances etc. Also fixes the issue when 
Array prototype is polluted and thus `array instanceof Array` check fails.

Usage example:
```javascript
const immutableConfig = jsonCopy(config)
```

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

This also means that you can put any executable OSAPI function including those returned from an 
OSAPI request, like the "getNextPage": 

```javascript
const contentResponse = await promiseOsapiRequest(osapi.jive.corev3.contents.get())
const nextPage = await promiseOsapiRequest(contentResponse.getNextPage())
```

Usage option 2:
```javascript
const viewer = await promiseOsapiRequest(api => api.people.getViewer())
```
 
 
### `async promiseHttpGet(...args)`
Promise/async wrapper for 
[osapi.http.get](https://opensocial.atlassian.net/wiki/spaces/OSD/pages/527081/Osapi.http+v0.9#Osapi.http(v0.9)-osapi.http.get). 
Parameters are forwarded without change.  
Use it to access non-jive API from within a tile

Usage example:
```javascript
const posts = await promiseHttpPost('https://apisrver.com/api/v1/posts')
```


### `async promiseHttpPost(...args)` 
Promise/async wrapper for 
[osapi.http.get](https://opensocial.atlassian.net/wiki/spaces/OSD/pages/527081/Osapi.http+v0.9#Osapi.http(v0.9)-osapi.http.post). 
Parameters are forwarded without change  
Use it to access non-jive API from within a tile

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
Promise/async wrapper for `osapi.jive.core.get`, which is an OSAPI endpoint for regular jive REST v3 
requests.

Usage examples:
```javascript
const viewer = await promiseRestGet('/people/@me')
const viewer = await promiseRestGet('/api/core/v3/people/@me')
// IMPORTANT! in the next case the host http://myserver.com will be completely thrown away and the 
// call will address the current jive instance. This is also true for all the next promiseRest... 
// functions
const viewer = await promiseRestGet('http://myserver.com/api/core/v3/people/@me')
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
A class for getting the current place (sophisticated alternative to [getContainerAsync](#async-getcontainerasync))

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


### `class ContinuousLoader(asyncFunction, filter, options)`
General class for getting large amounts of data from APIs (or any other async interfaces) which 
do not provide sufficient filtering parameters. In other words, this is a tool for 
client-side filtering abstraction over regular APIs.

This class is not based on Jive API and can be used with any asynchronous functions but it has two 
descendants (see below) created especially for Jive's REST API and OSAPI.   

**params:** 
* **asyncFunction** - ES2017 async function or any function that returns a Promise. **Important:** you 
should not pass Promise itself there, but a function that returns Promise when called.
* **filter** - async/promise *or regular* function that is being called for each collection to define whether 
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

**`[async] filter(currentList, existingList)`**  
*should return:* Array/Promise(Array); Filtered list of items   
* `currentList` - results collection received from the latest `asyncFunction` call
* `existingList` - results from previous calls that have already passed this filter, but haven't 
been returned by `loadNext` yet (usually used to 
remove duplicates). Note that the filtered items which are already returned by `loadNext` 
are being deleted and will not be passed to this parameter again, so if you want to remove all the 
duplicates, you should check items against your target collection too.

*Note:* Since this function receives the array and returns the array, it can be used not only for 
filtering, but also for mapping (transforming) the array either before filtering, or after it. Also,
this function can be async if needed, so you can make another async operations inside it, like
calling for external services (use this option with caution).

**`getNextAsyncFunc(asyncFunctionResponse)`**  
*should return:* async/promise function for the next call, analogical to the `asyncFunction`. If
returns anything but a function (e.g. `false`) -it will be treated as a fact that there's no 
possibility to form a new request and the loader wil stop with "reason: source ended" 
* `asyncFunctionResponse` - response of the previous async/promise function

**`getError(asyncFunctionResponse)`**  
*should return:* Error to display if there is one, `false` if no errors found.
* `asyncFunctionResponse` - response of the previous async/promise function

**`getList(asyncFunctionResponse)`**  
*should return:* Array of items
* `asyncFunctionResponse` - response of the previous async/promise function


#### Methods

**`async ContinuousLoader.loadNext()`**  
**returns:** Promise(Object)  
Main loading function that tries to loads first/next stated number of items.
Returning object contains two fields:
* `list` - the resulting list of items
* `reason` - text entry explaining why the polling stopped. Reason can be one of those:
    * "reached target count" - ContinuousLoader has found the desired count of items, but `loadNext` 
    can be called one more time 
    * "target count exists in pool" - there was no need in additional polling, the whole next "page"
    was found in an existing poll that has been fetched by previous `loadNext`  
    * "max polls reached" - there can be more results, but ContinuousLoader made `maxTriesPerLoad` 
    requests and target count haven't been reached
    * "source ended" - latest call returned 0 items, or `getNextAsyncFunc` returned not a function. 
    Further polling makes no sense 
    * "polling finished" - there been "source ended" response already, why do you still 
    polling `loadNext`? 
    
    
#### Usage examples

We will code a request for some abstract API that doesn't provide a server-side filtering by entity 
type:
```javascript
// Let's first program our filter function
function filter(currentList, existingList){
    return currentList.filter((listItem, itemIndex, thisArray) => {
        
        // only items with type "document" match our selection
        if (listItem.type !== 'document') return false
        
        // also, we don't want duplicates (by ID) in this current list...
        if (thisArray.findIndex(dupItem => dupItem.id === listItem.id) !== itemIndex) return false
        
        // ...or in existing collection pool
        if (existingList.find(dupItem => dupItem.id === listItem.id)) return false

        // if all checks passed
        return true
    })
   
}

// Now set our first async API call function
function makeAPICall (){
    // this will return a Promise when "makeAPICall" is called
    return fetch('http://someapi.com/api/get/contents').then(response => response.json())
}

// And the function that tells loader how to make new API call 
// based on results from each previous one 
function getNextAsyncFunc(APIResponse){
    // form new URL minding the pagination from previous one's response
    const newURL = 'http://someapi.com/api/get/contents?startFrom=' 
        + (APIResponse.pageLength + APIResponse.startFrom)
    
    // returning new function
    // IMPORTANT! The returned value has to be an async function, not a promise!
    return () => fetch(newURL).then(response => response.json())
}

// Finally: initializing the class instance
const loader = new ContinuousLoader(makeAPICall, filter, {
    getNextAsyncFunc: getNextAsyncFunc
})

// Now we can get (hopefully) 10 document-typed items from that API with each call. We can get less 
// if the target count is not found in first 5 API calls, but we can set larger "maxTriesPerLoad", 
// or just set it to 0. Anyway, until items.reason is not "source ended" - it means there can be 
// more matching items in API source 
async function load(){
    const items = await loader.nextPage()
}
```
    
    
### `class ContinuousLoadJiveREST(asyncFunction, filter, [options])`
A descendant class of ContinuousLoader, which has it's own getNextAsyncFunc, getError and getList implementations based on 
standard jive REST response, so you don't have to write it. It also has a set of new **optional** parameters:
* `loose` (false) - true means that (list.length < itemsPerPage) doesn't mean list has ended. Useful 
when working with non-consistent `/activities` API, which sometimes can return number of items that 
is different from `count` parameter
* `method` ("get") - you need to set this value if your default asyncFunction uses method different 
then "get" for internal getNextAsyncFunc implementation to work properly
* `createNextAsyncFunc` - a creator of new asynchronous function based on jive API's "next" link

Usage Example:
```javascript
// finds users that have Title === 'director'  
function filter(currentList){
    return currentList.filter(user => {
        return user.jive.profile && user.jive.profile.find(
            field => field.jive_label === 'Title' && field.value.toLowerCase() === 'director'
        )
    })
}

const loader = new ContinuousLoadJiveREST(() => promiseRestGet('/people'), filter)

const page1 = await loader.loadNext()
```

**Argument functions' interfaces:**  
`createNextAsyncFunc(nextLink, responseContent)`  
*should return:* async/promise function for the next call, analogical to the `asyncFunction`. The 
class has internal implementation of this function too, so you only have to use it if you have to 
do something else then just passing "next" link as a new request
* `nextLink` - regular jive API's "next" link 
* `responseContent` - the whole response (if you need it)


### `class ContinuousLoadJiveOSAPI(asyncFunction, filter, options)`
A descendant class of ContinuousLoader, which has it's own getList and getNextAsyncFunc implementations
based on Jive's OSAPI response. 

Usage Example:
```javascript
// finds users that have Title === 'director'  
function filter(currentList){
    return currentList.filter(user => {
        return user.jive.profile && user.jive.profile.find(
            field => field.jive_label === 'Title' && field.value.toLowerCase() === 'director'
        )
    })
}

const loader = new ContinuousLoadJiveOSAPI(() => promiseOsapiRequest(osapi.jive.corev3.people.get()), filter)

const page1 = await loader.loadNext()
```    
    