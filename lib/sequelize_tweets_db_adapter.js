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

  constructor (secondary, opts = DEFAULT_OPTS) {
    super(secondary)
    debug('init')
  }

  getTweets(ids) {
    return Tweet.findAll({
      where: {
        tweet_id_str: {
          [Sequelize.Op.or]: ids
        }
      }
    })
  }

  async _save (tweet_id_str, text, metadata) {
    // TODO Optimize?
    const newTweet = await Tweet.upsert({
      tweet_id_str, text, metadata
    })
    debug("Created tweet %s", tweet_id_str)
  }
  //TODO saveAll too?
}

module.exports = SequelizeTweetsDbAdapter
