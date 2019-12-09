import WebSocket from 'ws';
import { getSatellites, getStars } from './api';
import DB, { Functions } from './db';
import { getEnvVar, decorators } from './utils';


const DELTA_INTERVAl = +(getEnvVar('DELTA_INTERVAL', Infinity));


enum PROTOCOL {
  LOCATION = 'LOCATION',
  SUBSCRIBE = 'SUBSCRIBE',
  LIVE = 'LIVE',
  INFO = 'INFO',
  SEPARATOR = ';',
  CHANNEL_SEPARATOR = '@'
}

class Message {
  type: string;
  args: string[];

  constructor(msg: string) {
    const data = msg.split(PROTOCOL.SEPARATOR);
    this.type = data[0];
    this.args = data.slice(1);
  }

  isLocation(): boolean {
    return this.type === PROTOCOL.LOCATION;
  }

  getLocation(): { latitude: number, longitude: number } {
    if (this.isLocation()) {
      return { latitude: +this.args[0], longitude: +this.args[1] };
    }
    throw Error(`Message is not LOCATION ${this.type}: ${this.args}`);
  }

  isSubscription(): boolean {
    return this.type === PROTOCOL.SUBSCRIBE;
  }

  getSubscriptionChannel(): string[] {
    return this.args;
  }
}

class ClientManager {
  id: number;
  ws: WebSocket;
  subscribedChannels: string[];
  clientInterval?: NodeJS.Timeout;
  onSubscribe: (channel: string) => void;
  onUnsubscribe: (channel: string) => void;
  onMessage?: (message: Message) => void;

  constructor(
    ws: WebSocket,
    id: number,
    onClose: (client: ClientManager) => void,
    onSubscribe: (client: ClientManager, channel: string) => void,
    onUnsubscribe: (client: ClientManager, channel: string) => void,
    onMessage?: (message: Message) => void) {

    this.clientInterval = undefined;
    this.id = id;
    this.ws = ws;
    this.subscribedChannels = [];

    this.onSubscribe = (channnel) => onSubscribe(this, channnel);
    this.onUnsubscribe = (channnel) => onUnsubscribe(this, channnel);
    this.onMessage = onMessage;

    ws.on('message', this.onNewMessage.bind(this));
    ws.on('close', this.onClose(onClose).bind(this));
  }

  @decorators.log('WS')
  onNewMessage(strmessage: string) {
    const message = new Message(strmessage);
    if (this.onMessage) {
      this.onMessage(message);
    }

    if (message.isLocation()) {
      this.onLocationReceived(message);
    } else if (message.isSubscription()) {
      this.onSubscriptionReceived(message);
    }
  }

  @decorators.log('WS')
  onSubscriptionReceived(protocol: Message) {
    const channel = protocol.getSubscriptionChannel().join(PROTOCOL.CHANNEL_SEPARATOR);

    const msg: any = {};
    msg[PROTOCOL.INFO] = { msg: `Subscribed to ${channel}` };
    this.send(msg);
    this.subscribedChannels.push(channel);
    this.onSubscribe(channel);
  }

  @decorators.log('WS')
  onLocationReceived(protocol: Message) {
    const coordinates = protocol.getLocation()

    this.addLocationToDB(coordinates);
    this.initInterval(coordinates);
  }

  initInterval(coordinates: { latitude: number, longitude: number }) {
    this.clearClientInterval();
    this.sendResponseLocation(coordinates);
    this.clientInterval = setInterval(() => this.sendResponseLocation(coordinates), DELTA_INTERVAl);
  }

  @decorators.log('WS')
  sendResponseLocation({ latitude, longitude }: { latitude: number, longitude: number }) {
    (async () => {
      const satellites = await getSatellites(latitude, longitude);
      const stars = await getStars(latitude, longitude);

      const msg: any = {};
      msg[PROTOCOL.LIVE] = { satellites, stars };
      this.send(msg);
    })();
  }

  // NOTE: Check if reallocate into another component
  @decorators.log('WS')
  addLocationToDB({ latitude, longitude }: { latitude: number, longitude: number }) {
    (async () => {
      await DB.execQuery(Functions.createOne, 'locations', {}, { args: { data: { latitude, longitude } } });
    })();
  }

  @decorators.log('WS', { logArguments: false })
  send(data: any) {
    if (typeof data === 'object') {
      this.ws.send(JSON.stringify(data));
    } else {
      this.ws.send(`${data}`);
    }
  }

  clearClientInterval() {
    if (this.clientInterval) {
      clearInterval(this.clientInterval);
    }
  }

  onClose(close: (client: ClientManager) => void) {
    return () => {
      if (this.clientInterval) {
        clearInterval(this.clientInterval);
      }
      close(this);
    };
  }
}

class Channel {
  name: string;
  clients: { [cliendId: number]: ClientManager };

  constructor(name: string) {
    this.name = name;
    this.clients = {};
  }

  addClient(client: ClientManager) {
    this.clients[client.id] = client;
  }

  removeClient(client: ClientManager) {
    delete this.clients[client.id];
  }

  @decorators.intercept({ before: (obj: Channel) => console.log(`Channel: Notifying ${obj.name}`) })
  notify(data: any) {
    Object.values(this.clients).forEach(c => c.send(data));
  }

  get isEmpty(): boolean {
    return Object.values(this.clients).length === 0;
  }
}

class WSS {
  wss?: WebSocket.Server;
  clients: { [clientId: string]: ClientManager };
  channels: { [channelId: string]: Channel };
  clientsCount: number;

  newChannelListener?: (channel: string) => void;
  emptyChannelListener?: (channel: string) => void;
  messageListener?: (channel: Message) => void;

  constructor() {
    this.wss = undefined;
    this.clients = {};
    this.channels = {};
    this.clientsCount = 0;

    this.newChannelListener = undefined;
    this.emptyChannelListener = undefined;

    this.onClientClose = this.onClientClose.bind(this);
    this.onClientSubscribe = this.onClientSubscribe.bind(this);
    this.onClientUnsubscribe = this.onClientUnsubscribe.bind(this);
    this.notifyAll = this.notifyAll.bind(this);
    this.notify = this.notify.bind(this);
    this.setup = this.setup.bind(this);
    this.onNewConnection = this.onNewConnection.bind(this);
  }

  setup(server: WebSocket.ServerOptions) {
    this.wss = new WebSocket.Server(server);
    this.wss.on('connection', this.onNewConnection);
  }

  @decorators.log('WSS', { logArguments: false })
  onNewConnection(ws: WebSocket) {
    const client = new ClientManager(
      ws,
      this.clientsCount++,
      this.onClientClose,
      this.onClientSubscribe,
      this.onClientUnsubscribe,
      this.messageListener && this.messageListener.bind(this)
    );
    this.clients[client.id] = client;
  }

  setOnNewChannelListener(newChannelListener: (channel: string) => void) {
    this.newChannelListener = newChannelListener;
  }

  setOnEmptyChannelListener(emptyChannelListener: (channel: string) => void) {
    this.emptyChannelListener = emptyChannelListener;
  }

  setOnNewMessageListener(messageListener: (msg: Message) => void) {
    this.messageListener = messageListener;
  }

  @decorators.log('WSS', { logArguments: false })
  @decorators.intercept({
    before: (obj: WSS, args: any[]) => console.log(`WSS: Closing client ${args[0].id}`),
    after: (obj: WSS) => console.log(`WSS: ${Object.keys(obj.clients).length} clients left`)
  })
  onClientClose(client: ClientManager) {
    client.subscribedChannels.forEach(ch => {
      this.onClientUnsubscribe(client, ch);
    });
    delete this.clients[client.id];
  }

  @decorators.intercept({ before: (obj: WSS, args: any[]) => console.log(`WSS: Client ${args[0].id} subscription ${args[1]}`) })
  onClientSubscribe(client: ClientManager, channel: string) {
    let newChannel = false;
    if (!(channel in this.channels)) {
      this.channels[channel] = new Channel(channel);
      newChannel = true;
    }
    this.channels[channel].addClient(client);
    if (newChannel && this.newChannelListener) {
      this.newChannelListener(channel);
    }
  }

  @decorators.intercept({
    before: (obj: WSS, args: any[]) => console.log(`WSS: Client ${args[0].id} unsubscription ${args[1]}`),
    after: (obj: WSS) => console.log(`WSS: ${Object.keys(obj.channels).length} alive`)
  })
  onClientUnsubscribe(client: ClientManager, channel: string) {
    if (channel in this.channels) {
      this.channels[channel].removeClient(client);
      if (this.channels[channel].isEmpty) {
        delete this.channels[channel];
        // If channel is empty, notifies the listener
        if (this.emptyChannelListener) {
          this.emptyChannelListener(channel);
        }
      }
    }
  }

  @decorators.intercept({ before: () => console.log(`WSS: Notifying all`) })
  notifyAll(data: any) {
    Object.values(this.clients).forEach((cli: ClientManager) => cli.send(data));
  }

  notify(channel: string) {
    return (data: any) => {
      if (this.channels[channel]) {
        this.channels[channel].notify(data);
      }
    };
  }
}

export default WSS;
