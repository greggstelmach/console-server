// console-server.js
const http   = require('http');
const crypto = require('crypto');

function createErrorResponse(code, message, requestId) {
  return `<?xml version="1.0"?>
<ErrorResponse xmlns="http://queue.amazonaws.com/doc/2012-11-05/">
    <Error>
        <Type>Sender</Type>
        <Code>${code}</Code>
        <Message>${message}</Message>
        <RequestId>${requestId}</RequestId>
    </Error>
</ErrorResponse>`;
}

function createSuccessResponse(messageId, md5OfBody, requestId) {
  return `<?xml version="1.0"?>
<SendMessageResponse xmlns="http://queue.amazonaws.com/doc/2012-11-05/">
    <SendMessageResult>
        <MessageId>${messageId}</MessageId>
        <MD5OfMessageBody>${md5OfBody}</MD5OfMessageBody>
    </SendMessageResult>
    <ResponseMetadata>
        <RequestId>${requestId}</RequestId>
    </ResponseMetadata>
</SendMessageResponse>`;
}

let counter = 0;

const server = http.createServer((req, res) => {
  counter++;
  let body = '';

  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const requestId = crypto.randomUUID();
    res.setHeader('Content-Type', 'application/xml');

    if (counter % 2 === 0) {                        // simulate failure on every 2nd request
      res.statusCode = 500;
      res.end(createErrorResponse('InternalError', 'Internal Server Error', requestId));
    } else {                                        // simulate success otherwise
      const messageId   = crypto.randomUUID();
      const md5OfBody   = crypto.createHash('md5').update(body).digest('hex');
      res.statusCode = 200;
      res.end(createSuccessResponse(messageId, md5OfBody, requestId));
    }

    console.log(`${req.method} ${req.url} → ${res.statusCode}`);
  });
});

const host = process.argv[2] || 'localhost';
const port = process.argv[3] || 3000;

server.listen(port, host, () =>
  console.log(`Listening at http://${host}:${port}\n(Usage: node console-server.js <host> <port>)`)
);

