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
    debug("Bulk-indexing %d items", objArr.length)
    const body = []
    objArr.forEach(
      ({tweet_id_str, text }) => {
        body.push({
          index: {
            _index: INDEX,
            _type: TYPE,
            _id: tweet_id_str
          }
        })
        body.push({text})
      }
    )
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
