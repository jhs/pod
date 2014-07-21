module.exports = get_config

// Podcast config
//

var fs = require('fs')

var CONFIG_LINE = /^(.+) (http.*) (\d+)$/

function get_config(file, callback) {
  fs.readFile(file, 'utf8', function(er, body) {
    if (er)
      return callback(er)

    var shows = []
    body.split(/\n/).forEach(function(line) {
      var match = line.match(CONFIG_LINE)
      if (!match)
        return

      var show = {title:match[1], url:match[2], last:+match[3]}
      shows.push(show)
    })

    callback(null, shows)
  })
}


if (require.main === module)
  get_config(__dirname + '/shows.txt', function(er, shows) {
    if (er)
      throw er
    console.log('Shows:')
    console.log(shows)
  })
