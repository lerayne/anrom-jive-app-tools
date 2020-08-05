/**
 * Created by M. Yegorov on 2016-12-27.
 */

import 'core-js/fn/object/keys'
import 'core-js/fn/array/concat'
import 'core-js/fn/array/map'
import 'core-js/fn/array/for-each'
import 'core-js/fn/string/includes'

const jive = window.jive
const osapi = window.osapi

import {promiseOsapiPollingRequest} from './deprecated'
import {unescapeHtmlEntities, pause, sliceArray} from './utils'

export function extractContent(response) {

    if (!response.content) return response

    if (response.content.id !== undefined) return response.content
    if (response.content instanceof Array) return response.content
    if (response.content.list) return response.content

    return response
}

export function promiseOsapiRequest(osapiRequestFunc){
    return new Promise((resolve, reject) => {

        const request = (typeof osapiRequestFunc === 'function') ? osapiRequestFunc(osapi.jive.corev3) : osapiRequestFunc;

        request.execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}


export function promiseHttpGet(...args){
    return new Promise ((resolve, reject) => {

        osapi.http.get(...args).execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}

export function promiseHttpPost(...args){
    return new Promise ((resolve, reject) => {

        osapi.http.post(...args).execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}

export function promiseRestGet(href) {

    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1]
    }

    return new Promise((resolve, reject) => {
        osapi.jive.core.get({
            v:'v3',
            href
        }).execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}

export const promiseRestRequest = function(href){
    console.warn('Use of promiseRestRequest is deprecated, use promiseRestGet instead')
    return promiseRestGet(href)
}

/**
 *
 * @param href
 * @param options - body, type, etc
 * @returns {Promise<any>}
 */
export function promiseRestPost(href, options = {}) {

    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1]
    }

    return new Promise((resolve, reject) => {
        osapi.jive.core.post({
            v:'v3',
            href,
            ...options
        }).execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}

export function promiseRestDelete(href) {

    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1]
    }

    return new Promise((resolve, reject) => {
        osapi.jive.core.delete({
            v:'v3',
            href
        }).execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}

export function promiseRestPut(href) {

    if (href.includes("/api/core/v3/")) {
        href = href.split("/api/core/v3")[1]
    }

    return new Promise((resolve, reject) => {
        osapi.jive.core.put({
            v:'v3',
            href
        }).execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}


function singleOsapiBatch(entries, createBatchEntry, j = 0) {
    return new Promise((resolve, reject) => {

        let batch = osapi.newBatch()

        entries.forEach((entry, i) => {
            const [id, executable] = createBatchEntry(entry, i, j)
            batch.add(id, executable)
        })

        batch.execute(response => {
            if (response.error) reject(response)
            else resolve(response)
        })
    })
}

function batchObjectToArray(batchResponse) {
    //console.log('batchObjectToArray', batchResponse)

    return Object.keys(batchResponse).map(key => {

        let returnObject = {
            id: key,
            status: (typeof batchResponse[key].status === "number") ? batchResponse[key].status : 200
        }

        if (batchResponse[key].error) {
            returnObject.error = batchResponse[key].error
        } else {
            returnObject.data = extractContent(batchResponse[key])
        }

        return returnObject
    })
}

async function singleRestBatch(items, createBatchEntry, j=0){
    const batch = items.map((item, i) => createBatchEntry(item, i, j))

    const response = await promiseRestPost('/executeBatch', {
        type: "application/json",
        body: batch
    })

    return extractContent(response)
}

/**
 * promiseOsapiBatch
 *
 * @param entries - any array based on which you want to build a batch
 * @param createBatchEntry - a func that takes a single entry and its index from the array above
 * and returns an object with the fields "id" and "request". "id" should be a unique id of the
 * request and "request" should be an OSAPI executable
 * @returns {Promise<Array>}
 */
async function promiseBatch(type = 'rest', entries, createBatchEntry, optionsArgument = {}) {

    const defaultOptions = {
        maxEntries: 25,
        shouldBatchContinue: null,
        singleRestBatchFunc: singleRestBatch
    }

    const options = {...defaultOptions, ...optionsArgument}

    //console.time('batch')

    //no more than 25! Jive hard limit
    const maxEntriesPerBatch = options.maxEntries < 25 ? options.maxEntries : 25

    if (entries.length <= maxEntriesPerBatch) {

        if (type === 'osapi') return batchObjectToArray(await singleOsapiBatch(entries, createBatchEntry))
        if (type === 'rest') return await options.singleRestBatchFunc(entries, createBatchEntry)

        //console.timeEnd('batch')

    } else {

        const entryArrays = sliceArray(entries, maxEntriesPerBatch)
        let results = []
        let responseArray

        for (let i = 0; i < entryArrays.length; i++) {
            if (type === 'osapi') {
                const response = await singleOsapiBatch(entryArrays[i], createBatchEntry, i)
                responseArray = batchObjectToArray(response)
            }
            if (type === 'rest') {
                responseArray = await options.singleRestBatchFunc(entryArrays[i], createBatchEntry, i)
            }

            results = results.concat(responseArray)

            //if function is defined and it returns false - stop the cycle!
            if (options.shouldBatchContinue && !options.shouldBatchContinue(responseArray, results)){
              break
            }

            // make 1 sec pause after each request an 11 sec pause each 4 requests to bypass jive's
            // request frequency limitation
            // but only if this is not the last query
            if (i < entryArrays.length - 1) {
                await pause((i + 1) % 4 === 0 ? 11000 : 1000)
            }
        }

        //console.timeEnd('batch')

        return results
    }
}

export async function promiseRestBatch(entries, createBatchEntry, options = {}) {
    return await promiseBatch('rest', entries, createBatchEntry, options)
}

export async function promiseOsapiBatch(entries, createBatchEntry, options = {}) {
    return await promiseBatch('osapi', entries, createBatchEntry, options)
}

export class CurrentPlace {
    place = false

    constructor(filter = this._filter){
        this.filter = filter
    }

    _filter(rawPlace){
        return {
            id: rawPlace.placeID,
            uri: rawPlace.resources.self.ref,
            html: rawPlace.resources.html.ref,
            name: unescapeHtmlEntities(rawPlace.name),
            type: 'place'
        }
    }

    fetch(){
        return new Promise(resolve => {

            if (this.place) {
                resolve(this.place)
                return null
            }

            jive.tile.getContainer(place => {
                this.place = this.filter(place)
                resolve(this.place)
            })
        })
    }
}

//export const currentPlace = new CurrentPlace()

const fetchPromise = {
    promiseHttpGet,
    promiseHttpPost,
    promiseOsapiRequest,
    promiseRestGet,
    promiseRestPost,
    promiseRestPut,
    promiseRestDelete,
    promiseRestRequest,
    promiseOsapiPollingRequest,
    promiseOsapiBatch,
    promiseRestBatch,
    CurrentPlace,
    extractContent
    //currentPlace,
}

export default fetchPromise