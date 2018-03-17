require('dotenv').config()
const fs = require('fs')
const debug = require('debug')('klcc')
const Server = require('./lib/server')
const EsTweetsDbAdapter = require('./lib/es_tweets_db_adapter')
const SequelizeTweetsDbAdapter = require('./lib/sequelize_tweets_db_adapter')
const TweetsPuller = require('./lib/twitter_puller')


debug('init')
const query        = process.env.QUERY
const esOpts       = JSON.parse(fs.readFileSync('./config/elasticsearch.json'))
const secondaryDb  = new EsTweetsDbAdapter(esOpts)
const primaryDb    = new SequelizeTweetsDbAdapter(secondaryDb)
const tweetsPuller = new TweetsPuller(query, primaryDb)
tweetsPuller.pull()


if (process.env.RUN_SERVER) {
  const host = process.env.SERVER_HOST
  const port = process.env.SERVER_PORT || 3000
  new Server(primaryDb).listen(port, host, () => {
    debug(`Server running on ${port}`)
  })
}
