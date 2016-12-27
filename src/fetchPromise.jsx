/**
 * Created by M. Yegorov on 2016-12-27.
 */

import osapi from 'jive/osapi';

export function promiseOsapiRequest(osapiRequestFunc){
    return new Promise((resolve, reject) => {

        const request = typeof osapiRequestFunc == 'function' ? osapiRequestFunc(osapi.jive.corev3) : osapiRequestFunc;

        request.execute(response => {
            if (response.error) {
                reject({error: response.error})
            } else {
                resolve(response)
            }
        })
    });
}

export function promiseRestRequest(href){
    return new Promise((resolve, reject) => {
        osapi.jive.core.get({
            v:'v3',
            href
        }).execute(response => {
            if (!response.error) {
                resolve(response)
            } else {
                reject(response)
            }
        })
    })
}

export function promiseHttpGet(...args){
    return new Promise ((resolve, reject) => {

        osapi.http.get(...args).execute(result => {
            if (result.error) reject(result.error);
            else {
                resolve(result);
            }
        })
    })
}

const fetchPromise = {promiseHttpGet, promiseOsapiRequest, promiseRestRequest}

export default fetchPromise