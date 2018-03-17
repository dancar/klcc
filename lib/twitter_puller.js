const fs = require('fs')
const debug = require('debug')('twitter_puller')  // TODO: different per insance?
const Twitter = require('twitter')

const DEFAULT_MAX_TWEETS = 100

module.exports = class TwitterPuller {
  constructor (query, tweetsDbAdapter, max_tweets = DEFAULT_MAX_TWEETS) {
    debug('init')
    // TODO: Support multiuser?
    // TODO: support application creds?
    const twitter_opts = {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
    this.query = query
    this.dbAdapter = tweetsDbAdapter
    this.client = new Twitter(twitter_opts)
  }

  pull () {
    if (process.env.DEBUG_READ_TWEETS_FROM_FILE) {
      const tweets = JSON.parse(fs.readFileSync('./tweets.json'))
      this.dbAdapter.saveAll(
        Object.keys(tweets)
          .map( k => [k, tweets[k]] )
      )
      return
    }


    // TODO: add stream, too?
    const opts = {
      q: this.query,
      count: this.max_tweets
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
        this.dbAdapter.saveAll(tweets.map(tweet => [tweet.id_str, tweet.text]))
      })
  }
}
