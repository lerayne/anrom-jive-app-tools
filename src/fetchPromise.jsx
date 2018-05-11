/**
 * Created by M. Yegorov on 2016-12-27.
 */

import osapi from 'jive/osapi'
import 'core-js/fn/object/keys'
import 'core-js/fn/array/concat'
import 'core-js/fn/array/map'
import 'core-js/fn/array/foreach'
import 'regenerator-runtime/runtime'

function pause(delay){
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

function splitArray(array, chunksNumber) {
    const newArray = []

    for (let i = 0; i < chunksNumber; i++){
        newArray.push([])
    }

    if (array !== undefined && array.length){
        const chunkLength = Math.ceil(array.length / chunksNumber)

        array.forEach((item, i) => {
            const chunkNumber = Math.floor(i / chunkLength)
            newArray[chunkNumber].push(item)
        })
    }

    return newArray
}

export function promiseOsapiRequest(osapiRequestFunc){
    return new Promise((resolve, reject) => {

        const request = typeof osapiRequestFunc === 'function' ? osapiRequestFunc(osapi.jive.corev3) : osapiRequestFunc;

        request.execute(response => {
            if (response.error) {
                reject(response)
            } else {
                resolve(response)
            }
        })
    })
}

/**
 * todo: нормальная реализация, если надо сделать загрузку один раз, но будет плохо работать если нужна догрузка:
 * возвращает не запрошенное количество, а больший кусок. Нужно придумать вариант, при котором вместо родного
 * getNextPage используется собственный promiseNextPage, в котором содержатся рекурсия на сам promiseOsapiPollingRequest
 * и остаток списка
 */

export function promiseOsapiPollingRequest(osapiRequestFunc, filterFunction, targetNumber, maxIterationCount = 0) {
    return new Promise((resolve, reject) => {

        let list = []
        let iteration = 0

        function getNextChunk(executable) {

            iteration++

            promiseOsapiRequest(executable).then(response => {

                const getNextPage = response.getNextPage || false

                //todo: собственно начало работы над промисом остатка
                /*const promiseNextPage = function(){
                 return new Promise((resolve2, reject2) => {
                 if (list.length >= targetNumber) {

                 }
                 })
                 }*/

                if (!response.list.length) {

                    resolve({list, reason: 'no results'})

                } else {

                    list = [...list, ...response.list.filter(filterFunction)]

                    if (list.length >= targetNumber) {

                        resolve({list, getNextPage, reason: `target number reached (on iteration ${iteration})`})

                    } else {

                        if (maxIterationCount === 0 || iteration <= maxIterationCount) {

                            if (getNextPage) {

                                // recursion here
                                getNextChunk(getNextPage)

                            } else {
                                resolve({list, reason: 'list end reached'})
                            }

                        } else {
                            resolve({list, getNextPage, reason: 'maximum iteration count reached'})
                        }
                    }
                }

            }).catch(reject)
        }

        getNextChunk(osapiRequestFunc)
    })
}

export function promiseRestRequest(href) {
    return new Promise((resolve, reject) => {
        osapi.jive.core.get({
            v:'v3',
            href
        }).execute(response => {
            if (response.error) {
                reject(response)
            } else {
                resolve(response)
            }
        })
    })
}

export const promiseRestGet = promiseRestRequest

export function promiseRestPost(href) {
    return new Promise((resolve, reject) => {
        osapi.jive.core.post({
            v:'v3',
            href
        }).execute(response => {
            if (response.error) {
                reject(response)
            } else {
                resolve(response)
            }
        })
    })
}

export function promiseHttpGet(...args){
    return new Promise ((resolve, reject) => {

        osapi.http.get(...args).execute(response => {
            if (response.error) {
                reject(response)
            } else {
                resolve(response)
            }
        })
    })
}

export function promiseHttpPost(...args){
    return new Promise ((resolve, reject) => {

        osapi.http.post(...args).execute(response => {
            if (response.error) {
                reject(response)
            } else {
                resolve(response)
            }
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
                if (response.error) {
                    reject(response)
                } else {
                    resolve(response)
                }
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


const fetchPromise = {
    promiseHttpGet,
    promiseHttpPost,
    promiseOsapiRequest,
    promiseRestGet,
    promiseRestPost,
    promiseRestRequest,
    promiseOsapiPollingRequest,
    promiseBatch
}

export default fetchPromise