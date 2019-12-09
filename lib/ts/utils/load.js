"use strict";
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
const fs_1 = __importDefault(require("fs"));
const db_1 = __importStar(require("./db"));
fs_1.default.readFile('../data/stars.csv', 'utf8', (err, content) => {
    if (err)
        throw Error(err);
    const separator = ';';
    let data = content.trim().split('\n');
    const keys = data[0]
        .toLowerCase()
        .trim()
        .split(separator);
    const stars = data
        .slice(1)
        .map(s => {
        return s
            .trim()
            .split(separator)
            .reduce((o, s, i) => {
            o[keys[i]] = isNaN(s) ? s : +s;
            return o;
        }, { likes: 0 });
    });
    (async () => {
        await db_1.default.execQuery(db_1.Functions.createMany, 'stars', stars);
        console.log('Loading done');
    })();
});
