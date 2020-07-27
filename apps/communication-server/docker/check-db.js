const net = require('net');

const mongoDbHosts = process.env.DB_HOST
  ? process.env.DB_HOST.replace(/,\s*$/, '').split(',')
  : null;
const mongoDbPort = 27017;
const timeoutInMs = 3000;
const log = message =>
  console.log('\x1b[1m\x1b[32m%s\x1b[0m', `${new Date()}: ${message}`);
const error = message =>
  console.log('\x1b[1m\x1b[31m%s\x1b[0m', `${new Date()}: ${message}`);

const checkConnection = (host, port) => {
  const sock = new net.Socket();
  sock.setTimeout(timeoutInMs);
  sock
    .on('connect', () => {
      log(host + ':' + port + ' is up.');
      sock.destroy();
    })
    .on('error', e => {
      error(host + ':' + port + ' is down: ' + e.message);
      sock.destroy();
    })
    .on('timeout', () => {
      error(host + ':' + port + ' is down: timeout');
      sock.destroy();
    })
    .connect(port, host);
};

if (mongoDbHosts) {
  log('Waiting for MongoDB.');
  mongoDbHosts.forEach(host => {
    checkConnection(host, mongoDbPort);
  });
} else {
  error('DB_HOST environment not set');
}
