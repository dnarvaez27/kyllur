#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const http_1 = require("http");
const app_1 = __importDefault(require("../app"));
const mix_1 = __importDefault(require("../utils/mix"));
const debug = debug_1.default('nodeexpressreactive4:server');
/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    // named pipe ? val : port number ? port : false
    return isNaN(port)
        ? val
        : (port >= 0
            ? port
            : false);
};
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3001');
app_1.default.set('port', port);
/**
 * Create HTTP server.
 */
const server = http_1.createServer(app_1.default);
/**
 * Listen on provided port, on all network interfaces.
 */
const mix = new mix_1.default({ server });
mix.start();
server.listen(port);
server.on('error', (error) => {
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
function getOrThrow(val) {
    if (val) {
        return val;
    }
    throw Error(`Failed Assertion on variable. Must not be null: ${val}`);
}
