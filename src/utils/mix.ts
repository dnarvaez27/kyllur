import WebSocket from 'ws';
import DB, { DBStream } from './db';
import WSS from '../utils/wss';

class Mix {
  wss: WSS;
  streams: { [key: string]: DBStream };

  constructor(server: WebSocket.ServerOptions) {
    this.wss = new WSS();
    this.streams = {};
    this.wss.setup(server);
  }

  start() {
    this.wss.setOnNewChannelListener(channel => {
      (async () => {
        const stream = await DB.listenToChanges(channel, []);
        this.streams[channel] = stream;
        stream.setOnDataChanged(data => {
          const obj: any = {};
          obj[`CH_${channel.toUpperCase()}`] = data;
          this.wss.notify(channel)(obj);
        });
      })();
    });

    this.wss.setOnEmptyChannelListener(channel => {
      (async () => {
        if (channel in this.streams) {
          await this.streams[channel].closeStream();
          delete this.streams[channel];
        } else {
          console.log(`Channel ${channel} not in streams, ${Object.keys(this.streams)}`)
        }
      })();
    });
  }
}

export default Mix;