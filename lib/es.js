const debug = require('debug')('ES')
const elasticsearch = require('elasticsearch');

const INDEX = "tweets"
const QUERY_SIZE = 100

const DEFAULT_OPTS = {
  host: 'localhost:9200'
}

class ES {
  constructor (opts = DEFAULT_OPTS) {
    this.client = new elasticsearch.Client(opts)
  }

  index(id_str, text) {
    debug("Indexing %s", id_str)
    this.client.index({
      index: INDEX,
      id: id_str,
      type: "tweets",
      body: {text}
    })
  }

  async search(q) {
    const result = await this.client.search({
      q,
      index: INDEX,
      size: QUERY_SIZE
    })
    return result.hits.hits.map(({_id}) => _id)
  }

}

module.exports = ES
