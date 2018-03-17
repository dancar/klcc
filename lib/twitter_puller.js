const fs = require('fs')
const debug = require('debug')('twitter_puller')  // TODO: different per insance?
const Twitter = require('twitter')

const DEFAULT_MAX_TWEETS = 100
const TWITTER_OPTS = [
  "consumer_key",
  "consumer_secret",
  "access_token_key",
  "access_token_secret"
]

module.exports = class TwitterPuller {
  constructor (query, tweetsDbAdapter, maxTweets = DEFAULT_MAX_TWEETS) {
    debug('init')
    // TODO: Support multiuser?
    // TODO: support application creds?
    const opts = {}
    TWITTER_OPTS.forEach(k =>{
      const envVar = "TWITTER_" + k.toUpperCase()
      const value = process.env[envVar]
      if (!value) {
        throw "Missing Twitter environment variable: " + envVar
      }
      opts[k] = value
    })

    this.query = query
    this.dbAdapter = tweetsDbAdapter
    this.client = new Twitter(opts)
    this.maxTweets = maxTweets
  }

  pull () {
    // Skip actualy pull in for special debugging:
    if (process.env.DEBUG_READ_TWEETS_FROM_FILE) {
      const tweets = JSON.parse(fs.readFileSync('./tweets.json'))
      this.dbAdapter.saveAll(
        Object.keys(tweets)
          .map( k => [k, tweets[k].text, {handle: tweets[k].handle}] )
      )
      return
    }

    const opts = {
      q: this.query,
      count: this.maxTweets
    }
    debug('querying %s', opts.q)
    this.client.get('search/tweets', opts,
      (error, result, response) => {
        if (error) {
          // TODO: better error handling
          debug("Error: %s", error)
          throw error;
        }
        const tweets = result.statuses
        debug('got %d tweets', tweets.length)
        this.dbAdapter.saveAll(tweets.map(this._extractTweetParams.bind(this)))
      })
    debug("Setting up stream")
    const stream = this.client.stream('statuses/filter', {track: this.query})
    stream.on('data', (event) => {
      debug("Received stream event: %s", event)
      if (this._isTweetEvent(event)) {
        this.dbAdapter.saveTweet(...this._extractTweetParams(event))
      }
    })
  }
  _extractTweetParams(tweet) {
    return [
      tweet.id_str,
      tweet.text,
      { // metadata:
        createdAt: Date.parse(tweet.created_at),
        handle: tweet.user.screen_name
      }
    ]
  }
  _isTweetEvent(event) {
    return typeof event.contributors === "object" &&
      typeof event.id_str === "string" &&
      typeof event.text === "string"
  }
}
