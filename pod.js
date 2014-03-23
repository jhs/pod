#!/usr/bin/env node
//
// Get podcasts.

var request = require('request')
var Parser = require('feedparser')

var TIMEOUT = 30 * 1000

function fetch(feed) {
  var req = request(feed, {'timeout':TIMEOUT, 'pool':false})
  req.setMaxListeners(50)

  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
  req.setHeader('accept', 'text/html,application/xhtml+xml')

  var parser = new Parser

  req.on('response', function(res) {
    if(res.statusCode != 200)
      return this.emit('error', new Error('Bad status '+res.statusCode+' to feed: ' + feed))

    this.pipe(parser)
  })

  parser.on('error', function(er) { req.emit('error', er) })
  parser.on('end', function() {
    console.log('Done: %s', feed)
  })

  parser.on('readable', function() {
    var post
    while (post = this.read()) {
      console.log('Post')
      console.log(post)
      console.log('')
    }
  })
}

var url = 'http://feeds.muleradio.net/thetalkshow'
console.log('fetch: %s', url)
fetch(url)
