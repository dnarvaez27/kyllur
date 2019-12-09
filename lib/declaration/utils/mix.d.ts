import WebSocket from 'ws';
import { DBStream } from './db';
import WSS from '../utils/wss';
declare class Mix {
    wss: WSS;
    streams: {
        [key: string]: DBStream;
    };
    constructor(server: WebSocket.ServerOptions);
    start(): void;
}
export default Mix;
