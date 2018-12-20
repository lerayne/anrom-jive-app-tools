import {promiseOsapiRequest, promiseRestPost, promiseRestGet} from './fetchPromise'

export class ContinuousLoader {

    getError(asyncFunctionResponse) {
        return asyncFunctionResponse.error || false
    }

    getList (asyncFunctionResponse) {
        return asyncFunctionResponse.list || []
    }

    getResponseContent (asyncFunctionResponse) {
        return asyncFunctionResponse
    }

    /**
     * Overrideable function to create new promise-returning function
     * @param asyncFunctionResponse
     * @returns {function|boolean} - should return async function (one that returns promise),
     * NOT promise itself
     */
    getNextAsyncFunc(asyncFunctionResponse){
        console.warn('getNextAsyncFunc should be defined in either options or child class')
        return false
    }

    /**
     * Constructs a class instance
     * @param {function} asyncFunction - should return Promise
     * @param {function} filter - should return array
     * @param {object} [options]
     */
    constructor(asyncFunction, filter, options = {}) {

        const optionsDefaults = {
            debug: false,
            targetCount: 10,
            maxTriesPerLoad: 5,
            getNextAsyncFunc: ::this.getNextAsyncFunc,
            getError: ::this.getError,
            getList: ::this.getList,
            getResponseContent: ::this.getResponseContent,
            map: false
        }

        this.options = {...optionsDefaults, ...options}

        this.asyncFunction = asyncFunction
        this.filter = filter
        this.resultPool = []
        this.endReached = false
    }

    async recursiveLoad(resolve, reject, loadCount){
        try {
            const asyncFunctionResponse = await this.asyncFunction()

            const {
                getError,
                getList,
                getNextAsyncFunc,
                targetCount,
                maxTriesPerLoad
            } = this.options

            this.log('asyncFunctionResponse', asyncFunctionResponse)

            // catch errors
            const error = getError(asyncFunctionResponse)
            if (error) throw new Error(error)

            //getting list
            let list = getList(asyncFunctionResponse)

            //if unfiltered list is empty - means nothing to load
            // returning the rest of result poll (if any) and blocking
            // further calls of this.loadNext
            if (!list.length) {
                this.log('zero items get, returning []/rest of pool')
                this.endReached = true
                resolve({
                    list: this.resultPool.splice(0),
                    reason: 'source ended'
                })
                return null
            }

            //put (mapped and) filtered items in pool
            if (this.options.map) list = await this.options.map(list, [...this.resultPool])
            const filteredList = await this.filter(list, [...this.resultPool])

            this.resultPool = this.resultPool.concat(filteredList)

            // getting possible next poll - this should be done before first possible
            // contentful resolve()
            const nextAsyncFunc = getNextAsyncFunc(asyncFunctionResponse)
            if (typeof nextAsyncFunc === 'function'){
                this.asyncFunction = nextAsyncFunc
            }

            //if pool reached target number - resolve items and remove them from pool
            if (this.resultPool.length >= targetCount) {
                this.log('pool reached the target count. set pause.')
                resolve({
                    list: this.resultPool.splice(0, targetCount),
                    reason: 'reached target count'
                })
                this.log('(rest of pool:', this.resultPool)
                return null
            }

            loadCount++

            if (loadCount >= maxTriesPerLoad){
                // if pool hasn't reached the target number, but it's last poll according to
                // maxTriesPerLoad
                this.log("max tries reached. returning what's found so far")
                resolve({
                    list: this.resultPool.splice(0),
                    reason: 'max polls reached'
                })
                return null

            } else if (typeof nextAsyncFunc === 'function') {
                //if pool hasn't reached target number, but there's more to load
                this.log('got', this.resultPool.length, 'while target is', targetCount ,'need to load one more time')
                this.recursiveLoad(resolve, reject, loadCount)
                return null

            } else {
                this.log('no next promise available. returning pool')
                this.endReached = true
                resolve({
                    list: this.resultPool.splice(0),
                    reason: 'source ended'
                })
            }

        } catch (error) {
            reject(error)
        }
    }

    loadNext() {
        return new Promise((resolve, reject) => {

            if (this.endReached) {
                this.log('end was reached before, no more promising')
                resolve({
                    list: [],
                    reason: 'polling finished'
                })
                this.log('(rest of pool:', this.resultPool)
                return null
            }

            const {targetCount} = this.options

            if (this.resultPool.length >= targetCount) {
                this.log('target count found in existing pool')
                resolve({
                    list: this.resultPool.splice(0, targetCount),
                    reason: 'target count exists in pool'
                })
                return null
            }

            this.recursiveLoad(resolve, reject, 0)
        })
    }

    log(...args){
        if (this.options.debug){
            console.log(...args)
        }
    }
}

export class ContinuousLoadJiveREST extends ContinuousLoader {
    getList (asyncFunctionResponse) {
        //this.log('REST getList')
        const responseContent = this.getResponseContent(asyncFunctionResponse)
        return  responseContent.list || []
    }

    getResponseContent (asyncFunctionResponse) {
        //this.log('REST getResponseContent')
        return asyncFunctionResponse.content || asyncFunctionResponse
    }

    getError(asyncFunctionResponse) {
        //this.log('REST getError')
        if (asyncFunctionResponse.status) {
            switch (asyncFunctionResponse.status) {
                case 200:
                    return false
                case 204:
                    return '204: No Content'
                default:
                    return asyncFunctionResponse.status
            }
        }

        return false
    }

    getNextAsyncFunc (asyncFunctionResponse){
        const responseContent = this.getResponseContent(asyncFunctionResponse)

        const {itemsPerPage, list, links} = responseContent

        if (list.length < itemsPerPage || !responseContent.links || !responseContent.links.next) {
            // there's nothing to load more
            return false
        }

        return this.options.createNextAsyncFunc(links.next, responseContent)
    }

    createNextAsyncFunc(nextLink, responseContent){
        return () => {
            const link = nextLink.split('api/core/v3')[1]
            if (this.options.method.toLowerCase() === 'get') return promiseRestGet(link)
            if (this.options.method.toLowerCase() === 'post') return promiseRestPost(link)
        }
    }

    constructor(asyncFunction, filter, options = {}){
        super(asyncFunction, filter, options)

        const optionsDefaults = {
            method: 'get',
            createNextAsyncFunc: ::this.createNextAsyncFunc
        }

        this.options = {...optionsDefaults, ...this.options, ...options}
    }
}

export class ContinuousLoadJiveOSAPI extends ContinuousLoader {
    getList (asyncFunctionResponse) {
        //console.log('REST getList')
        const responseContent = this.getResponseContent(asyncFunctionResponse)
        return  responseContent.list || []
    }

    getResponseContent (asyncFunctionResponse) {
        //console.log('REST getResponseContent')
        return asyncFunctionResponse.content || asyncFunctionResponse
    }

    getNextAsyncFunc(asyncFunctionResponse){
        if (typeof asyncFunctionResponse.getNextPage === 'function'){
            return () => promiseOsapiRequest(asyncFunctionResponse.getNextPage)
        }

        return false
    }
}

export default {
    ContinuousLoader,
    ContinuousLoadJiveREST,
    ContinuousLoadJiveOSAPI
}