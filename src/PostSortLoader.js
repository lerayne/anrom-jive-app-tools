import {promiseOsapiBatch} from '../fetchPromise'

//todo: so far works with OSAPI batch (not REST) and doesn't load more than required initially (no
// full support of "load more")
export default class PostSortLoader {
  constructor (createBatchFunction, createContentItemRequest, sortingFunction, options) {

    const optionsDefaults = {
      targetCount: 10,
      batchNumber: 5,
      batchMaxEntries: 25,
      shouldBatchContinue: null
    }

    this.endReached = false

    this.options = { ...optionsDefaults, ...options }

    this.createBatchFunction = createBatchFunction
    this.createContentItemRequest = createContentItemRequest
    this.sortingFunction = sortingFunction

    //collection of just IDs and fields by which content is sorted
    this.contentSignaturesPool = []
  }

  async loadNext(customLoadNumber = false) {
    if (!this.contentSignaturesPool.length) {
      this.contentSignaturesPool = await this.getSignatures()
    }

    if (this.contentSignaturesPool.length) {
      const contentToRequest = this.contentSignaturesPool.splice(0, customLoadNumber || this.options.targetCount)

      const contentsResponse = await promiseOsapiBatch(contentToRequest, (entry, eI, rI) => {
        return [
          rI + '.' + eI,
          this.createContentItemRequest(entry)
        ]
      })

      //todo: figure out what to do with errors inside this list (now they're just ignored)
      return {
        list: contentsResponse
          .filter(item => !item.error)
          .map(item => item.data),
        reason: 'reached target count'
      }
    } else if (!this.endReached) {
      this.endReached = true
      return {
        list: [],
        reason: 'source ended'
      }
    } else {
      return {
        list: [],
        reason: 'polling finished'
      }
    }
  }

  async getSignatures(){
    const {
      batchNumber,
    } = this.options

    const batchArray = []
    for (let i = 0; i < batchNumber; i++) batchArray.push(i)

    const response = await promiseOsapiBatch(batchArray, (entry, entryIndex, requestIndex) => {
      return [
        requestIndex + '.' + entryIndex,
        this.createBatchFunction(entry)
      ]
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