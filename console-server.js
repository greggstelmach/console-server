// Alternates between 200 and 500 responses. 

http = require('http')
fs = require('fs')
let counter = 0;
server = http.createServer( function(req, res) {
    counter++;
    console.log(counter)
    console.log('Method: ' + req.method)
    console.log('URL: ' + req.url)
    var body = ''
    req.on('data', function (data) {
      body += data
    })
    req.on('end', function() {
        console.log("Request Body: '" + body + "'")

        res.setHeader('Content-Type', 'text/plain');
        if (counter % 2 === 0) {
            res.statusCode = 500;
            res.end('Internal Server Error');
        } else {
            res.statusCode = 200;
            res.end('OK');
        }
        console.log("statusCode: " + res.statusCode)
    })
});
port = process.argv[3] || 3000
host = process.argv[2] || 'localhost'
server.listen(port, host)
console.log('Listening at http://' + host + ':' + port)
console.log('(Usage: node console-server.js <host> <port>)')
