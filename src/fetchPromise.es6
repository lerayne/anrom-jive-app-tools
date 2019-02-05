/**
 * Created by M. Yegorov on 2016-12-27.
 */

import 'core-js/fn/object/keys'
import 'core-js/fn/array/concat'
import 'core-js/fn/array/map'
import 'core-js/fn/array/for-each'

const jive = window.jive
const osapi = window.osapi

import {promiseOsapiPollingRequest} from './deprecated'
import {unescapeHtmlEntities, pause, splitArray} from './utils'


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

export async function promiseBatch(entries, createBatchEntry){

    function batchObjectToArray(batchResponseObject){
        return Object.keys(batchResponseObject).map(id => ({id, content: batchResponseObject[id]}))
    }

    function promiseSingleBatch(entries, createBatchEntry){
        return new Promise((resolve, reject) => {

            let batch = osapi.newBatch()

            entries.forEach((entry, i) => {
                const {id, request} = createBatchEntry(entry, i)
                batch.add(id, request)
            })

            batch.execute(response => {
                if (response.error) reject(response)
                else resolve(response)
            })
        })
    }

    if (entries.length <= 30) {
        return batchObjectToArray(await promiseSingleBatch(entries, createBatchEntry))

    } else {

        const entryArrays = splitArray(entries, Math.ceil(entries.length / 30))
        let results = []
        let response = false

        for (let i = 0; i < entryArrays.length; i++){
            response = await promiseSingleBatch(entryArrays[i], createBatchEntry)

            results = results.concat(batchObjectToArray(response))

            await pause((i+1) % 4 === 0 ? 11000 : 1000)
        }

        return results
    }
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
    promiseBatch,
    CurrentPlace,
    //currentPlace,
}

export default fetchPromise