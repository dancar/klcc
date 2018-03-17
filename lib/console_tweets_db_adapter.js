const TweetsDbAdapter = require('./tweets_db_adapter')

class DebugTweetsDbAdapter extends TweetsDbAdapter {
  save (tweet_id_str, tweet_text, tweet_metadata = {}) {
    console.log(
      `tweet id: ${tweet_id_str}\n`,
      `tweet text: ${tweet_text}\n`,
      `metadata: ${tweet_metadata}\n`,
      '\n*******************'
    )
  }
}
module.exports = DebugTweetsDbAdapter
