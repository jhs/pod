// Get podcasts.
//

var config = require('./config.js')
var fetch_feed = require('./feed.js')

config('shows.txt', function(er, shows) {
  if (er)
    throw er

  console.log(shows)
})
