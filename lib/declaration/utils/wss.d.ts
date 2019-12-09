/// <reference types="node" />
import WebSocket from 'ws';
declare class Message {
    type: string;
    args: string[];
    constructor(msg: string);
    isLocation(): boolean;
    getLocation(): {
        latitude: number;
        longitude: number;
    };
    isSubscription(): boolean;
    getSubscriptionChannel(): string[];
}
declare class ClientManager {
    id: number;
    ws: WebSocket;
    subscribedChannels: string[];
    clientInterval?: NodeJS.Timeout;
    onSubscribe: (channel: string) => void;
    onUnsubscribe: (channel: string) => void;
    onMessage?: (message: Message) => void;
    constructor(ws: WebSocket, id: number, onClose: (client: ClientManager) => void, onSubscribe: (client: ClientManager, channel: string) => void, onUnsubscribe: (client: ClientManager, channel: string) => void, onMessage?: (message: Message) => void);
    onNewMessage(strmessage: string): void;
    onSubscriptionReceived(protocol: Message): void;
    onLocationReceived(protocol: Message): void;
    initInterval(coordinates: {
        latitude: number;
        longitude: number;
    }): void;
    sendResponseLocation({ latitude, longitude }: {
        latitude: number;
        longitude: number;
    }): void;
    addLocationToDB({ latitude, longitude }: {
        latitude: number;
        longitude: number;
    }): void;
    send(data: any): void;
    clearClientInterval(): void;
    onClose(close: (client: ClientManager) => void): () => void;
}
declare class Channel {
    name: string;
    clients: {
        [cliendId: number]: ClientManager;
    };
    constructor(name: string);
    addClient(client: ClientManager): void;
    removeClient(client: ClientManager): void;
    notify(data: any): void;
    get isEmpty(): boolean;
}
declare class WSS {
    wss?: WebSocket.Server;
    clients: {
        [clientId: string]: ClientManager;
    };
    channels: {
        [channelId: string]: Channel;
    };
    clientsCount: number;
    newChannelListener?: (channel: string) => void;
    emptyChannelListener?: (channel: string) => void;
    messageListener?: (channel: Message) => void;
    constructor();
    setup(server: WebSocket.ServerOptions): void;
    onNewConnection(ws: WebSocket): void;
    setOnNewChannelListener(newChannelListener: (channel: string) => void): void;
    setOnEmptyChannelListener(emptyChannelListener: (channel: string) => void): void;
    setOnNewMessageListener(messageListener: (msg: Message) => void): void;
    onClientClose(client: ClientManager): void;
    onClientSubscribe(client: ClientManager, channel: string): void;
    onClientUnsubscribe(client: ClientManager, channel: string): void;
    notifyAll(data: any): void;
    notify(channel: string): (data: any) => void;
}
export default WSS;
