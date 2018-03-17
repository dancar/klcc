require('dotenv').config()

if (process.env.NODE_ENV !== 'production') {
  const longjohn = require('longjohn') // nicer stack trace
  longjohn.async_trace_limit = -1
}

const fs = require('fs')
const debug = require('debug')('klcc')
const Server = require('./lib/server')
const ES = require('./lib/es')
// const JsonTweetsDbAdapter = require('./lib/json_tweets_db_adapter')
// const SqliteTweetsDbAdapter = require('./lib/sqlite_tweets_db_adapter')
const SequelizeTweetsDbAdapter = require('./lib/sequelize_tweets_db_adapter')
const TweetsPuller = require('./lib/twitter_puller')


debug('init')
const esOpts = JSON.parse(fs.readFileSync('./config/elasticsearch.json'))
const es = new ES(esOpts)

// const dbOpts = JSON.parse(fs.readFileSync('./config/db.json'))
const db = new SequelizeTweetsDbAdapter(es)
const tp = new TweetsPuller("Seinfeld", db, 5)
tp.pull()


new Server(db, es).listen(3000, () => {
  debug("Server running on 3000")
})
