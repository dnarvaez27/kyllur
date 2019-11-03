const WebSocket = require('ws');

class WSS {
  constructor() {
    this.wss = null;
    this.clients = [];
    this.chanels = {};
    this.notifyAll = this.notifyAll.bind(this);
  }

  setup(server) {
    this.wss = new WebSocket.Server({ server });
    console.log('WSS: Setting up');
    let clientCount = 0;

    this.wss.on('connection', ws => {
      const clientId = clientCount++;
      console.log(`WSS: New client ${clientId}`);
      this.clients.push(ws);

      ws.on('message', message => {
        // Subscription to channels
        console.log(`WSS: [Client ${clientId}] Received: ${message}`);

        if (!(message in this.chanels)) {
          this.chanels[message] = [];
        }
        this.chanels[message].push(ws);
        ws.send(JSON.stringify({ msg: `Subscribed to ${message}` }));
      });

      ws.on('close', () => {
        console.log(`WSS: [Client ${clientId}] Closed`);
        // TODO: Remvoe closed clients
      });
    });
  }

  notifyAll(data) {
    this.clients.forEach(ws => ws.send(data));
  }

  notify(channel) {
    return (data) => {
      console.log(`WSS: Notifying ${channel}`);

      this.chanels[channel].forEach(c => c.send(data));
    };
  }
}

module.exports = WSS;
