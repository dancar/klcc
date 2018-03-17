// Abstract class for saving tweets to DB
class TweetsDbAdapter {

  constructor (secondary) {
    this.secondary = secondary
  }

  async save (tweet_id_str, tweet_text, tweet_metadata) {
    this._save(tweet_id_str, tweet_text, tweet_metadata)
    this.secondary.index(tweet_id_str, tweet_text)
  }

  async _save (tweet_id_str, tweet_text, tweet_metadata) {
    throw 'Abstract'
  }

  async saveAll (tweetsArr) {
    return Promise.all(tweetsArr.map(args => this.save(...args)))
  }
}
module.exports = TweetsDbAdapter
