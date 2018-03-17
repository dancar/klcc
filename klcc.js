require('dotenv').config()
const server = require('./lib/server')

const debug = require('debug')('klcc')

debug('init')

const SequelizeTweetsDbAdapter = require('./lib/sequelize_tweets_db_adapter')
const TweetsPuller = require('./lib/twitter_puller')

const adapter = new SequelizeTweetsDbAdapter()
const tp = new TweetsPuller("#MAGA", adapter, 5)
tp.pull()


server.listen(3000, () => {
  debug("Server running on 3000")
})
