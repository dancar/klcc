const debug = require('debug')('ES')
const elasticsearch = require('elasticsearch');
const TweetsDbAdapter = require('./tweets_db_adapter.js')

const INDEX = "tweets"
const TYPE = "tweet"
const QUERY_SIZE = 100

// TODO: default opts?
class ES extends TweetsDbAdapter {
  constructor (opts) {
    super()
    debug('init')
    this.client = new elasticsearch.Client(opts)
  }

  async query(q) {
    debug("Querying '%s'", q)
    const result = await this.client.search({
      // q,
      index: INDEX,
      type: TYPE,
      body: {
        query: {
          match: {
            text: q
          }
        }
        ,
        sort: [
          {"createdAt": {"order": "desc"}},
          "_score"
        ]
      },
      from: 0,
      size: QUERY_SIZE
    })
    debug("Found %d results", result.hits.total)
    return result.hits.hits.map(({_id}) => _id)
  }

  async _saveAll (objArr) {
    debug("Bulk-indexing %d items", objArr.length)
    const body = []
    objArr.forEach(
      ([tweet_id_str, text, {createdAt}]) => {
        body.push({
          index: {
            _index: INDEX,
            _type: TYPE,
            _id: tweet_id_str
          }
        })
        body.push({text, createdAt: createdAt})
      }
    )
    await this.client.bulk({body})
    debug("success")
  }

  async _saveTweet(tweet_id_str, text, {createdAt}) {
    debug("Indexing %s", tweet_id_str)
    this.client.index({
      index: INDEX,
      id: tweet_id_str,
      type: TYPE,
      body: {text, createdAt}
    })
  }
}

module.exports = ES
