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

  constructor (secondary) {
    super(secondary)
    debug('init')
  }

  _getTweets(ids) {
    if (ids.length === 0) {
      return []
    }
    return Tweet.findAll({
      where: {
        id: {
          [Sequelize.Op.or]: ids
        }
      }
    })
  }

  async _saveTweet (tweet_id_str, text, metadata) {
    const newTweet = await Tweet.upsert({
      tweet_id_str, text, metadata
    })
    debug("Created tweet %s", tweet_id_str)
  }

  async _saveAll (tweetsArr) {
    debug("Saving %d tweets", tweetsArr.length)
    await Tweet.bulkCreate(tweetsArr.map(([tweet_id_str, text, metadata]) => ({id: tweet_id_str, text, metadata})),
      {ignoreDuplicates: true}
    )
  }
}

module.exports = SequelizeTweetsDbAdapter
