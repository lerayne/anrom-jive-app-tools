import { promiseRestBatch } from '../fetchPromise'

//todo: so far works with OSAPI batch (not REST) and doesn't load more than required initially (no
// full support of "load more")
export default class PostSortLoader {
  constructor (createBatchFunction, createContentItemRequest, sortingFunction, options) {

    const optionsDefaults = {
      // how many items of final sorted content we want to load per each "loadNext"
      targetCount: 10,

      //how many batched pages of signature requests to perform
      batchNumber: 5,

      // jive batch can take no more than 25 requests per batch. 25 is a default, but we're
      // putting it here explicitly.
      // In many cases it's better to ask for signatures in smaller chunks - like 10 times per
      // 100 items makes it 1000 items per page, but we can stop after each thousand and run
      // shouldBatchContinue to avoid loading too much content
      batchMaxEntries: 25,

      // function that runs after each batch page. If it returns false - batching should stop
      shouldBatchContinue: null
    }

    this.options = { ...optionsDefaults, ...options }

    //global flag telling us that we should stop polling.
    this.endReached = false

    //main functions from params
    this.createBatchFunction = createBatchFunction
    this.createContentItemRequest = createContentItemRequest
    this.sortingFunction = sortingFunction

    //collection of just IDs and fields by which content is sorted
    this.contentSignaturesPool = []
  }

  async loadNext (customLoadNumber = false) {
    // if poll is empty and end is not reached (means this is first calling of loadNext) -
    // get those signatures!
    if (!this.contentSignaturesPool.length && !this.endReached) {
      this.contentSignaturesPool = await this.getSignatures()
    }

    // as long as pool has data - slice in targetCount/customLoadNumber and get individual items
    if (this.contentSignaturesPool.length) {
      const contentToRequest = this.contentSignaturesPool.splice(0, customLoadNumber || this.options.targetCount)

      // but if this was the last slice - flag the "endReached"
      if (!this.contentSignaturesPool.length) {
        this.endReached = true
      }

      const contentsResponse = await promiseRestBatch(contentToRequest, (entry, eI, rI) => {
        return {
          key: rI + '.' + eI,
          request: {
            method: 'GET',
            endpoint: this.createContentItemRequest(entry)
          }
        }
      })

      //todo: figure out what to do with errors inside this list (now they're just ignored)
      return {
        list: contentsResponse
          .filter(item => !item.error)
          .map(item => item.data),
        reason: this.endReached ? 'source ended' : 'reached target count'
      }
    } else {
      return {
        list: [],
        reason: 'polling finished'
      }
    }
  }

  async getSignatures () {
    const {
      batchNumber,
    } = this.options

    const batchArray = []
    for (let i = 0; i < batchNumber; i++) batchArray.push(i)

    const response = await promiseRestBatch(batchArray, (batchPageIndex, entryIndex, requestIndex) => {
      return {
        key: requestIndex + '.' + entryIndex,
        request: {
          method: 'GET',
          endpoint: this.createBatchFunction(batchPageIndex)
        }
      }
    }, {
      maxEntries: this.options.batchMaxEntries,
      shouldBatchContinue: this.options.shouldBatchContinue
    })

    //todo: figure out what to do with errors inside this list (now they're just ignored)
    const signatures = response
      .filter(chunk => chunk.status === 200)
      .map(chunk => chunk.data.list)
      .reduce((accum, current) => accum.concat(current), [])

    const sortedSignatures = signatures.sort(this.sortingFunction)

    console.log('response', response)
    console.log('sortedSignatures', sortedSignatures)

    return sortedSignatures
  }
}
