// Abstract class for acessing primary tweets DB

class TweetsDbAdapter {

  constructor (secondary = null) {
    this.secondary = secondary
  }

  async query(q) {
    if (!this.secondary) {
      throw "Not Implemented"
    }
    const tweet_ids = await this.secondary.query(q)
    return await this._getTweets(tweet_ids)
  }

  async saveTweet (tweet_id_str, tweet_text, tweet_metadata) {
    this._saveTweet(tweet_id_str, tweet_text, tweet_metadata)
    if (this.secondary) {
      await this.secondary.saveTweet(tweet_id_str, tweet_text, tweet_metadata)
    }
  }

  async saveAll (tweetsArr) {
    await this._saveAll(tweetsArr)
    if (this.secondary) {
      await this.secondary.saveAll(tweetsArr)
    }
  }

  async _saveTweet (tweet_id_str, tweet_text, tweet_metadata) {
    throw "Abstract"
  }

  // This method should best be implemented by the concrete class:
  _saveAll (tweetsArr) {
    return Promise.all(tweetsArr.map(args => this.saveTweet(...args)))
  }

  _getTweets(ids) {
    throw "Abstract / Not Implemented"
  }

}
module.exports = TweetsDbAdapter
