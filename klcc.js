require('dotenv').config()
const debug = require('debug')('klcc')

debug('init')

const JsonTweetsDbAdapter = require('./lib/json_tweets_db_adapter')
// const SequelizeTweetsDbAdapter = require('./lib/sequelize_tweets_db_adapter')
// const ConsoleTweetsDbAdapter = require('./lib/console_tweets_db_adapter')
const TweetsPuller = require('./lib/twitter_puller')

const adapter = new JsonTweetsDbAdapter()
const tp = new TweetsPuller("#MAGA", adapter, 5)
tp.pull()
