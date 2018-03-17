const TweetsDbAdapter = require('./tweets_db_adapter')
const Sequelize = require('sequelize')
const debug = require('debug')('SequelizeTweetsDbAdapter')
const { Tweet } = require('../models')



const DEFAULT_OPTS = {
  databaseName: 'tweets.db',
  dialect: 'sqlite',
  storage: './db/tweets.db'
}

class SequelizeTweetsDbAdapter extends TweetsDbAdapter {

  constructor (opts = DEFAULT_OPTS) {
    super()
    debug('init')
  }

  async _save (tweet_id_str, text, tweet_metadata) {
    // TODO Optimize?
    const newTweet = await Tweet.upsert({
      tweet_id_str, text
    })
    debug("Created tweet %s", tweet_id_str)
  }
  //TODO saveAll too?
}

module.exports = SequelizeTweetsDbAdapter
