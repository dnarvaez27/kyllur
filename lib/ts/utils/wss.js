"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const api_1 = require("./api");
const db_1 = __importStar(require("./db"));
const utils_1 = require("./utils");
const DELTA_INTERVAL = +(utils_1.getEnvVar('DELTA_INTERVAL', Infinity));
var PROTOCOL;
(function (PROTOCOL) {
    PROTOCOL["LOCATION"] = "LOCATION";
    PROTOCOL["SUBSCRIBE"] = "SUBSCRIBE";
    PROTOCOL["LIVE"] = "LIVE";
    PROTOCOL["INFO"] = "INFO";
    PROTOCOL["SEPARATOR"] = ";";
    PROTOCOL["CHANNEL_SEPARATOR"] = "@";
})(PROTOCOL || (PROTOCOL = {}));
class Message {
    constructor(msg) {
        const data = msg.split(PROTOCOL.SEPARATOR);
        this.type = data[0];
        this.args = data.slice(1);
    }
    isLocation() {
        return this.type === PROTOCOL.LOCATION;
    }
    getLocation() {
        if (this.isLocation()) {
            return { latitude: +this.args[0], longitude: +this.args[1] };
        }
        throw Error(`Message is not LOCATION ${this.type}: ${this.args}`);
    }
    isSubscription() {
        return this.type === PROTOCOL.SUBSCRIBE;
    }
    getSubscriptionChannel() {
        return this.args;
    }
}
class ClientManager {
    constructor(ws, id, onClose, onSubscribe, onUnsubscribe, onMessage) {
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
    onNewMessage(strmessage) {
        const message = new Message(strmessage);
        if (this.onMessage) {
            this.onMessage(message);
        }
        if (message.isLocation()) {
            this.onLocationReceived(message);
        }
        else if (message.isSubscription()) {
            this.onSubscriptionReceived(message);
        }
    }
    onSubscriptionReceived(protocol) {
        const channel = protocol.getSubscriptionChannel().join(PROTOCOL.CHANNEL_SEPARATOR);
        const msg = {};
        msg[PROTOCOL.INFO] = { msg: `Subscribed to ${channel}` };
        this.send(msg);
        this.subscribedChannels.push(channel);
        this.onSubscribe(channel);
    }
    onLocationReceived(protocol) {
        const coordinates = protocol.getLocation();
        this.addLocationToDB(coordinates);
        this.initInterval(coordinates);
    }
    initInterval(coordinates) {
        this.clearClientInterval();
        this.sendResponseLocation(coordinates);
        this.clientInterval = setInterval(() => this.sendResponseLocation(coordinates), DELTA_INTERVAL);
    }
    sendResponseLocation({ latitude, longitude }) {
        (async () => {
            const satellites = await api_1.getSatellites(latitude, longitude);
            const stars = await api_1.getStars(latitude, longitude);
            const msg = {};
            msg[PROTOCOL.LIVE] = { satellites, stars };
            this.send(msg);
        })();
    }
    // NOTE: Check if reallocate into another component
    addLocationToDB({ latitude, longitude }) {
        (async () => {
            await db_1.default.execQuery(db_1.Functions.createOne, 'locations', {}, { data: { latitude, longitude } });
        })();
    }
    send(data) {
        if (typeof data === 'object') {
            this.ws.send(JSON.stringify(data));
        }
        else {
            this.ws.send(`${data}`);
        }
    }
    clearClientInterval() {
        if (this.clientInterval) {
            clearInterval(this.clientInterval);
        }
    }
    onClose(close) {
        return () => {
            if (this.clientInterval) {
                clearInterval(this.clientInterval);
            }
            close(this);
        };
    }
}
__decorate([
    utils_1.decorators.log('WS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientManager.prototype, "onNewMessage", null);
__decorate([
    utils_1.decorators.log('WS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Message]),
    __metadata("design:returntype", void 0)
], ClientManager.prototype, "onSubscriptionReceived", null);
__decorate([
    utils_1.decorators.log('WS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Message]),
    __metadata("design:returntype", void 0)
], ClientManager.prototype, "onLocationReceived", null);
__decorate([
    utils_1.decorators.log('WS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientManager.prototype, "sendResponseLocation", null);
__decorate([
    utils_1.decorators.log('WS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientManager.prototype, "addLocationToDB", null);
__decorate([
    utils_1.decorators.log('WS', { logArguments: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientManager.prototype, "send", null);
class Channel {
    constructor(name) {
        this.name = name;
        this.clients = {};
    }
    addClient(client) {
        this.clients[client.id] = client;
    }
    removeClient(client) {
        delete this.clients[client.id];
    }
    notify(data) {
        Object.values(this.clients).forEach(c => c.send(data));
    }
    get isEmpty() {
        return Object.values(this.clients).length === 0;
    }
}
__decorate([
    utils_1.decorators.intercept({ before: (obj) => console.log(`Channel: Notifying ${obj.name}`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Channel.prototype, "notify", null);
class WSS {
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
    setup(server) {
        this.wss = new ws_1.default.Server(server);
        this.wss.on('connection', this.onNewConnection);
    }
    onNewConnection(ws) {
        const client = new ClientManager(ws, this.clientsCount++, this.onClientClose, this.onClientSubscribe, this.onClientUnsubscribe, this.messageListener && this.messageListener.bind(this));
        this.clients[client.id] = client;
    }
    setOnNewChannelListener(newChannelListener) {
        this.newChannelListener = newChannelListener;
    }
    setOnEmptyChannelListener(emptyChannelListener) {
        this.emptyChannelListener = emptyChannelListener;
    }
    setOnNewMessageListener(messageListener) {
        this.messageListener = messageListener;
    }
    onClientClose(client) {
        client.subscribedChannels.forEach(ch => {
            this.onClientUnsubscribe(client, ch);
        });
        delete this.clients[client.id];
    }
    onClientSubscribe(client, channel) {
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
    onClientUnsubscribe(client, channel) {
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
    notifyAll(data) {
        Object.values(this.clients).forEach((cli) => cli.send(data));
    }
    notify(channel) {
        return (data) => {
            if (this.channels[channel]) {
                this.channels[channel].notify(data);
            }
        };
    }
}
__decorate([
    utils_1.decorators.log('WSS', { logArguments: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ws_1.default]),
    __metadata("design:returntype", void 0)
], WSS.prototype, "onNewConnection", null);
__decorate([
    utils_1.decorators.log('WSS', { logArguments: false }),
    utils_1.decorators.intercept({
        before: (obj, args) => console.log(`WSS: Closing client ${args[0].id}`),
        after: (obj) => console.log(`WSS: ${Object.keys(obj.clients).length} clients left`)
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClientManager]),
    __metadata("design:returntype", void 0)
], WSS.prototype, "onClientClose", null);
__decorate([
    utils_1.decorators.intercept({ before: (obj, args) => console.log(`WSS: Client ${args[0].id} subscription ${args[1]}`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClientManager, String]),
    __metadata("design:returntype", void 0)
], WSS.prototype, "onClientSubscribe", null);
__decorate([
    utils_1.decorators.intercept({
        before: (obj, args) => console.log(`WSS: Client ${args[0].id} unsubscription ${args[1]}`),
        after: (obj) => console.log(`WSS: ${Object.keys(obj.channels).length} alive`)
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClientManager, String]),
    __metadata("design:returntype", void 0)
], WSS.prototype, "onClientUnsubscribe", null);
__decorate([
    utils_1.decorators.intercept({ before: () => console.log(`WSS: Notifying all`) }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WSS.prototype, "notifyAll", null);
exports.default = WSS;
