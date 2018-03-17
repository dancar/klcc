const debug = require('debug')('ES')
const elasticsearch = require('elasticsearch');

const INDEX = "tweets"
const TYPE = "tweet_text"
const QUERY_SIZE = 100

class ES {
  constructor (opts) {
    debug('init')
    this.client = new elasticsearch.Client(opts)
  }

  index(tweet_id_str, text) {
    debug("Indexing %s", tweet_id_str)
    this.client.index({
      index: INDEX,
      id: tweet_id_str,
      type: TYPE,
      body: {text}
    })
  }

  async bulkIndex(objArr) {
    const params = objArr.map(({tweet_id_str, text }) =>
      [{
        index: {
          _index: INDEX,
          _type: TYPE,
          _id: tweet_id_str
        }
      },{text}]
    )
    debug("Bulk-indexing %d items", objArr.length)
    const body = [].concat.apply(...params)
    await this.client.bulk({body})
    debug("success")
  }

  async search(q) {
    const result = await this.client.search({
      q,
      index: INDEX,
      type: TYPE,
      size: QUERY_SIZE
    })
    return result.hits.hits.map(({_id}) => _id)
  }

}

module.exports = ES
