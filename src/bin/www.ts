#!/usr/bin/env node

import Debug from 'debug';
import { createServer } from 'http';
import app from '../app';
import Mix from '../utils/mix';

const debug = Debug('nodeexpressreactive4:server');

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: any) => {
  const port = parseInt(val, 10);
  // named pipe ? val : port number ? port : false
  return isNaN(port)
    ? val
    : (port >= 0
      ? port
      : false
    );
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
const mix = new Mix({ server });
mix.start();


server.listen(port);
server.on('error', (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = getOrThrow(server.address());
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug('Listening on ' + bind);
});

function getOrThrow(val: any) {
  if (val) {
    return val;
  }
  throw Error(`Failed Assertion on variable. Must not be null: ${val}`);
}