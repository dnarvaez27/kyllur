import DB, { Functions } from './db';
import { getEnvVar } from './utils';
import fetch from 'node-fetch';


const N2YO_KEY = getEnvVar('N2YO_KEY');
const N2YO_HOST = 'https://www.n2yo.com/rest/v1/satellite/above';
const N2YO_ALT = 0;
const N2YO_DEG = 70;
const N2YO_CATEGORY = 32;
const URL = (latitude: number, longitude: number) => `${N2YO_HOST}/${latitude}/${longitude}/${N2YO_ALT}/${N2YO_DEG}/${N2YO_CATEGORY}/&apiKey=${N2YO_KEY}`;


interface SatelliteResponseInfo {
  category: string;
  transactionscount: number;
  satcount: number;
}
interface SatelliteResponseData {
  satid: number;
  satname: string;
  intDesignator: string;
  launchDate: string;
  satlat: number;
  satlng: number;
  satalt: number;
}
interface SatelliteResponse {
  info: SatelliteResponseInfo;
  above: SatelliteResponseData[];
};
interface CanvasData {
  canvasPosition: {
    x: number,
    y: number
  };
}
interface Satellite extends SatelliteResponseData, CanvasData { }

interface StarData {
  nombre: string;
  estado: string;
  masa: number;
  descubrimiento: number;
  actualizacion: string;
  estado_publicacion: string,
  tipo_deteccion: string;
  ra: number;
  dec: number;
  distancia_estrella: number;
  masa_estrella: number;
}
interface Star extends StarData, CanvasData { }


const sideralTime = {
  deltaJ: 86400000,
  L0: 99.967794687,
  L1: 360.98564736628603,
  L2: 0.0000002907879,
  calculate(longitude: number) {
    const time = new Date().getDate();
    return (this.L0 + this.L1 * this.deltaJ * time + this.L2 * Math.pow(this.deltaJ * time, 2) - longitude) % 360;
  }
}

export async function getSatellites(latitude: number, longitude: number): Promise<Satellite[]> {
  const mySideral = sideralTime.calculate(longitude);

  const req = await fetch(URL(latitude, longitude));
  const satellites: SatelliteResponse = await req.json();

  return satellites.above.map<Satellite>((s: SatelliteResponseData) => {
    const ra: number = sideralTime.calculate(s.satlng);
    return {
      ...s,
      canvasPosition: {
        x: ra - mySideral,
        y: s.satlat - latitude
      }
    };
  });
}

export async function getStars(latitude: number, longitude: number): Promise<Star[]> {
  const mySideral: number = sideralTime.calculate(longitude);

  const filteredStars = await DB.execQuery<Star[]>(Functions.get, 'stars', {
    $where:
      function () {
        return Math.sqrt(Math.pow(this.ra - mySideral, 2) + Math.pow(this.dec - latitude, 2)) <= 70;
      }
  });

  return filteredStars.map<Star>((s: Star) => ({
    ...s,
    canvasPosition: {
      x: s.ra - mySideral,
      y: s.dec - latitude
    }
  }));
}
