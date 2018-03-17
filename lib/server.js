const Express = require('express')
const { Tweet } = require('../models')

class Server extends Express {
  constructor (db) {
    super()
    this.use(Express.static('public'))
    this.get('/tweets', async (req, res) => {
      const q = req.query.q
      const tweets = await db.query(q)
      res.status(200).send(tweets)
    })
  }
}

module.exports = Server
