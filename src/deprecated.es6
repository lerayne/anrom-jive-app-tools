import {promiseOsapiRequest} from "./fetchPromise";

export function promiseOsapiPollingRequest(osapiRequestFunc, filterFunction, targetNumber, maxIterationCount = 0) {
    console.warn('Use of promiseOsapiPollingRequest is deprecated. Please use ContinuousLoadJiveOSAPI class instead.')

    return new Promise((resolve, reject) => {

        let list = []
        let iteration = 0

        function getNextChunk(executable) {

            iteration++

            promiseOsapiRequest(executable).then(response => {

                const getNextPage = response.getNextPage || false

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
