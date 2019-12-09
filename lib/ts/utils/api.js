"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importStar(require("./db"));
const utils_1 = require("./utils");
const node_fetch_1 = __importDefault(require("node-fetch"));
const N2YO_KEY = utils_1.getEnvVar('N2YO_KEY');
const N2YO_HOST = 'https://www.n2yo.com/rest/v1/satellite/above';
const N2YO_ALT = 0;
const N2YO_DEG = 70;
const N2YO_CATEGORY = 32;
const URL = (latitude, longitude) => `${N2YO_HOST}/${latitude}/${longitude}/${N2YO_ALT}/${N2YO_DEG}/${N2YO_CATEGORY}/&apiKey=${N2YO_KEY}`;
;
const sideralTime = {
    deltaJ: 86400000,
    L0: 99.967794687,
    L1: 360.98564736628603,
    L2: 0.0000002907879,
    calculate(longitude) {
        const time = new Date().getDate();
        return (this.L0 + this.L1 * this.deltaJ * time + this.L2 * Math.pow(this.deltaJ * time, 2) - longitude) % 360;
    }
};
async function getSatellites(latitude, longitude) {
    const mySideral = sideralTime.calculate(longitude);
    const req = await node_fetch_1.default(URL(latitude, longitude));
    const satellites = await req.json();
    return satellites.above.map((s) => {
        const ra = sideralTime.calculate(s.satlng);
        return {
            ...s,
            canvasPosition: {
                x: ra - mySideral,
                y: s.satlat - latitude
            }
        };
    });
}
exports.getSatellites = getSatellites;
async function getStars(latitude, longitude) {
    const mySideral = sideralTime.calculate(longitude);
    const filteredStars = await db_1.default.execQuery(db_1.Functions.get, 'stars', {
        $where: function () {
            return Math.sqrt(Math.pow(this.ra - mySideral, 2) + Math.pow(this.dec - latitude, 2)) <= 70;
        }
    });
    return filteredStars.map((s) => ({
        ...s,
        canvasPosition: {
            x: s.ra - mySideral,
            y: s.dec - latitude
        }
    }));
}
exports.getStars = getStars;
