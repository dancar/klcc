const debug = require('debug')('ES')
const elasticsearch = require('elasticsearch');

const INDEX = "tweets"
const TYPE = "tweet_text"
const QUERY_SIZE = 100

class ES {
  constructor (opts) {
    this.client = new elasticsearch.Client(opts)
  }

  index(id_str, text) {
    debug("Indexing %s", id_str)
    this.client.index({
      index: INDEX,
      id: id_str,
      type: TYPE,
      body: {text}
    })
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
