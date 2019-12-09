"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const wss_1 = __importDefault(require("../utils/wss"));
class Mix {
    constructor(server) {
        this.wss = new wss_1.default();
        this.streams = {};
        this.wss.setup(server);
    }
    start() {
        this.wss.setOnNewChannelListener(channel => {
            (async () => {
                const stream = await db_1.default.listenToChanges(channel, []);
                this.streams[channel] = stream;
                stream.setOnDataChanged(data => {
                    const obj = {};
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
                }
                else {
                    console.log(`Channel ${channel} not in streams, ${Object.keys(this.streams)}`);
                }
            })();
        });
    }
}
exports.default = Mix;
