module.exports = fetch


var request = require('request')
var Parser = require('feedparser')

var TIMEOUT = 30 * 1000
var UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'


function fetch(feed) {
  var req = request(feed, {'timeout':TIMEOUT, 'pool':false})
  req.setMaxListeners(50)

  req.setHeader('user-agent', UA)
  req.setHeader('accept', 'text/html,application/xhtml+xml')
  req.setHeader('accept-encoding', '')

  var parser = new Parser

  req.on('response', function(res) {
    if(res.statusCode != 200)
      return this.emit('error', new Error('Bad status '+res.statusCode+' to feed: ' + feed))

    this.pipe(parser)
    console.log('response headers: %j', res.headers)
  })

  parser.on('error', function(er) { req.emit('error', er) })
  parser.on('end', function() {
    console.log('Done: %s', feed)
  })

  parser.on('readable', function() {
    var post
    while (post = this.read()) {
      console.log(post.title)
      var enc = post.enclosures || []
      if(enc.length != 1)
        return this.emit('error', new Error('Bad enclosures: ' + post.title))

      enc = enc[0]
      console.dir(enc)
      console.log('')
    }
  })
}
