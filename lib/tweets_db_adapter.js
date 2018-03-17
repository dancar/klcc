// Abstract class for saving tweets to DB
class TweetsDbAdapter {
  async save (tweet_id_str, tweet_text, tweet_metadata) {
    throw 'Abstract'
  }

  async saveAll (tweetsArr) {
    return Promise.all(tweetsArr.map(args => this.save(...args)))
  }
}
module.exports = TweetsDbAdapter
