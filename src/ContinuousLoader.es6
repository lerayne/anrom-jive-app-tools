import {promiseOsapiRequest, promiseRestPost, promiseRestGet} from './fetchPromise'

export class ContinuousLoader {

    getError(asyncFunctionResponse) {
        return asyncFunctionResponse.error || false
    }

    getList (asyncFunctionResponse) {
        return asyncFunctionResponse.list || []
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
            getList: ::this.getList
        }

        this.options = {...optionsDefaults, ...options}

        this.asyncFunction = asyncFunction
        this.filter = filter
        this.resultPool = []
        this.endReached = false
    }

    async _recursiveLoad(resolve, reject, loadCount){
        try {
            const asyncFunctionResponse = await this.asyncFunction()

            const {
                getError,
                getList,
                getNextAsyncFunc,
                targetCount,
                maxTriesPerLoad
            } = this.options

            this._log('asyncFunctionResponse', asyncFunctionResponse)

            // catch errors
            const error = getError(asyncFunctionResponse)
            if (error) throw new Error(error)

            //getting list
            let list = getList(asyncFunctionResponse)

            //if unfiltered list is empty - means nothing to load
            // returning the rest of result poll (if any) and blocking
            // further calls of this.loadNext
            if (!list.length) {
                this._log('zero items get, returning []/rest of pool')
                this.endReached = true
                resolve({
                    list: this.resultPool.splice(0),
                    reason: 'source ended'
                })
                return null
            }

            //put (mapped and) filtered items in pool
            const filteredList = await this.filter(list, [...this.resultPool])

            this.resultPool = this.resultPool.concat(filteredList)

            // getting possible next poll - this should be done before first possible
            // contentful resolve()
            const nextAsyncFunc = getNextAsyncFunc(asyncFunctionResponse)
            if (typeof nextAsyncFunc === 'function'){
                this.asyncFunction = nextAsyncFunc
            } else {
                this.endReached = true
            }

            //if pool reached target number - resolve items and remove them from pool
            if (this.resultPool.length >= targetCount) {
                this._log('pool reached the target count. set pause.')
                resolve({
                    list: this.resultPool.splice(0, targetCount),
                    reason: 'reached target count'
                })
                this._log('(rest of pool:', this.resultPool)
                return null
            }

            loadCount++

            if (maxTriesPerLoad > 0 && loadCount >= maxTriesPerLoad){
                // if pool hasn't reached the target number, but it's last poll according to
                // maxTriesPerLoad
                this._log("max tries reached. returning what's found so far")
                resolve({
                    list: this.resultPool.splice(0),
                    reason: 'max polls reached'
                })
                return null

            } else if (!this.endReached) {
                //if pool hasn't reached target number, but there's more to load
                this._log('got', this.resultPool.length, 'while target is', targetCount ,'need to load one more time')
                this._recursiveLoad(resolve, reject, loadCount)
                return null

            } else {
                this._log('no next promise available. returning pool')
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

            const {targetCount} = this.options

            if (this.resultPool.length >= targetCount) {
                this._log('target count found in existing pool')
                resolve({
                    list: this.resultPool.splice(0, targetCount),
                    reason: 'target count exists in pool'
                })
                return null
            }

            if (this.endReached) {
                if (this.resultPool.length) {
                    this._log('no next promise available. returning pool')
                    resolve({
                        list: this.resultPool.splice(0),
                        reason: 'source ended'
                    })
                } else {
                    this._log('end was already reached before, no more polling')
                    resolve({
                        list: [],
                        reason: 'polling finished'
                    })
                }
                return null
            }

            this._recursiveLoad(resolve, reject, 0)
        })
    }

    _log(...args){
        if (this.options.debug){
            console.log(...args)
        }
    }
}

export class ContinuousLoadJiveREST extends ContinuousLoader {
    getList (asyncFunctionResponse) {
        //this._log('REST getList')
        const responseContent = asyncFunctionResponse.content || asyncFunctionResponse
        return  responseContent.list || []
    }

    getError(asyncFunctionResponse) {
        //this._log('REST getError')
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
        const responseContent = asyncFunctionResponse.content || asyncFunctionResponse

        const {itemsPerPage, list, links} = responseContent

        if (
            !responseContent.links
            || !responseContent.links.next
            || (list.length < itemsPerPage && !this.options.loose)
        ) {
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
            // loose:true means that (list.length < itemsPerPage) doesn't mean list has ended.
            // Useful for /activity andpoint
            loose: false,
            method: 'get',
            createNextAsyncFunc: ::this.createNextAsyncFunc
        }

        this.options = {...optionsDefaults, ...this.options, ...options}
    }
}

export class ContinuousLoadJiveOSAPI extends ContinuousLoader {
    getList (asyncFunctionResponse) {
        //console.log('REST getList')
        const responseContent = asyncFunctionResponse.content || asyncFunctionResponse
        return  responseContent.list || []
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