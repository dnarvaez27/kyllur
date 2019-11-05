const WebSocket = require('ws');
const { getSatellites, getStars } = require('./util');
const { execQuery, functions, listenToChanges } = require('./db');


const DELTA_INTERVAl = +process.env.DELTA_INTERVAl;

class Message {
  constructor(msg) {
    const data = msg.split(';');
    this.type = data[0];
    this.args = data.slice(1);
  }

  isLocation() {
    return this.type === 'LOCATION';
  }

  getLocation() {
    return { latitude: +this.args[0], longitude: +this.args[1] };
  }

  isSubscription() {
    return this.type === 'SUBSCRIBE';
  }

  getSubscriptionChannel() {
    return this.args;
  }
}

class Client {
  constructor(id, ws, close, onNewChannel, removeChannels) {
    this.clientInterval = null;
    this.id = id;
    this.ws = ws;
    this.subscribedChannels = [];
    this.onNewChannel = onNewChannel;
    this.removeChannels = removeChannels;
    
    ws.on('message', this.onNewMessage.bind(this));
    ws.on('close', this.onClose(close).bind(this));
  }

  onNewMessage(message) {
    console.log(`WSS: [Client ${this.id}] Received: ${message}`);
    const protocol = new Message(message);

    if (protocol.isLocation()) {
      this.onLocationReceived(protocol);
    } else if (protocol.isSubscription()) {
      this.onSubscriptionReceived(protocol);
    }
  }

  onSubscriptionReceived(protocol) {
    // Think unused
    const channel = protocol.getSubscriptionChannel()[0];
    this.subscribedChannels.push(channel);
    this.ws.send(JSON.stringify({ INFO: { msg: `Subscribed to ${channel}` } }));
    this.onNewChannel(channel, this);
  }

  onLocationReceived(protocol) {
    const send = () => {
      (async () => {
        const satellites = await getSatellites(latitude, longitude);
        const stars = await getStars(latitude, longitude);

        // const starsPipeline = (s) => ([{ $match: { 'id': s._id } }]);

        // this.removeChannels(this);
        // this.subscribedChannels = [/* ...satellites.map(s => `sat_${s.satid}`),*/ ...stars.map(s => `stars@${JSON.stringify(starsPipeline(s))}`)];
        // this.subscribeToAll(this.subscribedChannels);
        this.ws.send(JSON.stringify({ LIVE: { satellites, stars } }));
      })();
    };
    const { latitude, longitude } = protocol.getLocation();

    (async () => {
      await execQuery(functions.createOne, 'locations', { latitude, longitude });
    })();

    if (this.clientInterval) {
      clearInterval(this.clientInterval);
    }

    send();
    this.clientInterval = setInterval(() => {
      send();
    }, DELTA_INTERVAl);
  }

  send(data) {
    this.ws.send(JSON.stringify({ LOCATIONS: data }));
  }

  subscribeToAll(channels) {
    channels.forEach(ch => this.onNewChannel(ch, this));
  }

  onClose(close) {
    return () => {
      clearInterval(this.clientInterval);
      close(this);
    };
  }
}

class WSS {
  constructor() {
    this.wss = null;
    this.clients = [];
    this.chanels = {};
    this.notifyAll = this.notifyAll.bind(this);
    this.notify = this.notify.bind(this);

    this.onClientSubscription = this.onClientSubscription.bind(this);
    this.onClientClose = this.onClientClose.bind(this);
    this.unsubscribeFromChannels = this.unsubscribeFromChannels.bind(this);
  }

  setup(server) {
    this.wss = new WebSocket.Server({ server });
    console.log('WSS: Setting up');
    let clientCount = 0;

    this.wss.on('connection', ws => {
      const client = new Client(clientCount++, ws, this.onClientClose, this.onClientSubscription, this.unsubscribeFromChannels);
      console.log(`WSS: New client ${client.id}`);
      this.clients.push(client);
    });
  }

  onClientSubscription(channel, cli) {
    if (!(channel in this.chanels)) {
      console.log(channel);

      const data = channel.split('@');
      const collecton = data[0];
      const pipe = data.length === 2 ? JSON.parse(data[1]) : [];
      console.log('*', pipe);

      this.chanels[channel] = { stream: null, listeners: [] };
      const onChange = this.notify(channel);
      const onStreamReady = stream => {
        this.chanels[channel].stream = stream;
      };
      listenToChanges(collecton, pipe, onChange, onStreamReady);
    }
    this.chanels[channel].listeners.push(cli);
  }

  onClientClose(client) {
    console.log(`WSS: [Client ${client.id}] Closed`);
    this.unsubscribeFromChannels(client);
  }

  unsubscribeFromChannels(client) {
    client.subscribedChannels.forEach(ch => {
      this.chanels[ch].listeners = this.chanels[ch].listeners.filter(cli => cli.id !== client.id);
      if (this.chanels[ch].listeners.length === 0) {
        this.chanels[ch].stream.close();
        delete this.chanels[ch];
      }
    });
  }

  notifyAll(data) {
    this.clients.forEach(cli => cli.send(JSON.parse(data)));
  }

  notify(channel) {
    return (data) => {
      console.log(`WSS: Notifying ${channel}`);
      if(this.chanels[channel]){
        this.chanels[channel].listeners.forEach(cli => cli.send(JSON.parse(data)));
      }
    };
  }
}

module.exports = WSS;
