// Abstract class for tweets database adapters
// An adapter can have a secondary adapter (namely, elasticsearch) , which will also persist all tweets
// When present, the secondary adapter will be used for fulltext search queries

class TweetsDbAdapter {

  constructor (secondary = null) {
    this.secondary = secondary
  }

  // Full-text query of tweet texts
  // Defaults to using the secondary DB if present for fetching tweet IDs.
  async query(q) {
    if (!this.secondary) {
      throw "Not Implemented"
    }
    const tweetIds = await this.secondary.query(q)
    return await this._getTweets(tweetIds)
  }

  async saveTweet (tweet_id_str, tweet_text, tweet_metadata) {
    this._saveTweet(tweet_id_str, tweet_text, tweet_metadata)
    if (this.secondary) {
      await this.secondary.saveTweet(tweet_id_str, tweet_text, tweet_metadata)
    }
  }

  // bulk save tweets
  async saveAll (tweetsArr) {
    await this._saveAll(tweetsArr)
    if (this.secondary) {
      await this.secondary.saveAll(tweetsArr)
    }
  }

  async _saveTweet (tweet_id_str, tweet_text, tweet_metadata) {
    throw "Abstract"
  }

  _saveAll (tweetsArr) {
    throw "Abstract"
  }

  _getTweets(ids) {
    throw "Abstract / Not Implemented"
  }

}
module.exports = TweetsDbAdapter
