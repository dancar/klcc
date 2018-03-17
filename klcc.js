require('dotenv').config()
const fs = require('fs')
const debug = require('debug')('klcc')
const Server = require('./lib/server')
const ES = require('./lib/es')
const TweetsDbAdapter = require('./lib/json_tweets_db_adapter')
const TweetsPuller = require('./lib/twitter_puller')


debug('init')
const esOpts = JSON.parse(fs.readFileSync('./config/elasticsearch.json'))
const es = new ES(esOpts)
const db = new TweetsDbAdapter(es)
const tp = new TweetsPuller("Seinfeld", db, 5)
tp.pull()


new Server(db, es).listen(3000, () => {
  debug("Server running on 3000")
})
