const Express = require('express')
const { Tweet } = require('../models')

class Server extends Express {
  constructor (db, es) {
    super()
    this.use(Express.static('public'))
    this.get('/tweets', async (req, res) => {
      const q = req.query.q
      const tweet_ids = await es.query(q)
      const tweets = await db.getTweets(tweet_ids)
      res.status(200).send(tweets)
    })
  }
}

module.exports = Server
