const app = require('express')()
const { Tweet } = require('../models')

app.get('/tweets', (req, res) => {
  tweets = Tweet.all()
})
