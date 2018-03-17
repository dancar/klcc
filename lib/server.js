const express = require('express')
const app = express()
const { Tweet } = require('../models')

app.use(express.static('public'))
app.get('/tweets', async (req, res) => {
  const tweets = (await Tweet.all()).map(({text, tweet_id_str}) => ({text, id_str: tweet_id_str}))
  res.status(200).send(tweets)
})

module.exports = app
