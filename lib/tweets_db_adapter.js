// Abstract class for acessing primary tweets DB

class TweetsDbAdapter {

  constructor (secondary) {
    this.secondary = secondary
  }

  getTweets(ids) {
    throw "Abstract"
  }

  async saveTweet (tweet_id_str, tweet_text, tweet_metadata) {
    this._save(tweet_id_str, tweet_text, tweet_metadata)
    this.secondary.index(tweet_id_str, tweet_text)
  }

  async saveAll (tweetsArr) {
    return Promise.all(tweetsArr.map(args => this.saveTweet(...args)))
  }

  async _saveTweet (tweet_id_str, tweet_text, tweet_metadata) {
    throw 'Abstract'
  }
}
module.exports = TweetsDbAdapter
