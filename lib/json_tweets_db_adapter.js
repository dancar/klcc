const TweetsDbAdapter = require('./tweets_db_adapter')
const debug = require('debug')('JsonTweetsDbAdapter')
const fs = require('fs')
const path = require('path')

const DEFAULT_FILE = 'tweets.json'

class JsonTweetsDbAdapter extends TweetsDbAdapter {
  constructor (secondary, file = DEFAULT_FILE) {
    super(secondary)
    debug('init')
    this.file = file
    this.data = {}
    if (fs.existsSync(this.file)) {
      this.data = JSON.parse(fs.readFileSync(this.file))
      debug('Read done from data file: %s', this.file)
    }
  }

  getTweets(ids) {
    return ids.map( id => this.data[id] )
  }

  async _saveFile() {
    await new Promise( (resolve, reject) => {
      const content = JSON.stringify(this.data)
      fs.writeFile(this.file, content, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }


  async _save (tweet_id_str, text, metadata) {
    if (! this.data.hasOwnProperty(tweet_id_str)) {
      this.data[tweet_id_str] = {text, ...metadata}
      await this._saveFile()
      debug("Created tweet %s", tweet_id_str)
    }
    else {
      debug("Skipping tweet %s", tweet_id_str)
    }

  }
  //TODO saveAll too?
}

module.exports = JsonTweetsDbAdapter
