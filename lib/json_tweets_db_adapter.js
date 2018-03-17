const TweetsDbAdapter = require('./tweets_db_adapter')
const debug = require('debug')('JsonTweetsDbAdapter')
const fs = require('fs')
const path = require('path')

const DEFAULT_FILE = 'tweets.json'

class JsonTweetsDbAdapter extends TweetsDbAdapter {
  constructor (secondary, file = DEFAULT_FILE) {
    super(secondary)
    this.file = file
    this.data = this.readFile()
    debug('init')
  }

  getTweets(ids) {
    return ids.map( id => this.data[id] )
  }

  readFile() {
    if (!fs.existsSync(this.file)) {
      debug("No JSON data file exists in '%s'", this.file)
      return {}
    }
    return JSON.parse(fs.readFileSync(this.file))
  }

  async saveFile() {
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
      await this.saveFile()
      debug("Created tweet %s", tweet_id_str)
    }
    else {
      debug("Skipping tweet %s", tweet_id_str)
    }

  }
  //TODO saveAll too?
}

module.exports = JsonTweetsDbAdapter
