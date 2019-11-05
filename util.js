const db = require('./db');
const fetch = require('node-fetch');


const N2YO_KEY = process.env.N2YO_KEY;

class SideralTime {
  constructor() {
    this.deltaJ = 86400000;
    this.L0 = 99.967794687;
    this.L1 = 360.98564736628603;
    this.L2 = 0.0000002907879;
  }

  calculate(longitude) {
    const time = new Date().getDate();
    return (this.L0 + this.L1 * this.deltaJ*time + this.L2 * Math.pow(this.deltaJ * time, 2) - longitude) % 360;
  }
}
const sideralTime = new SideralTime();


async function getSatellites(latitude, longitude) {
  const mySideral = sideralTime.calculate(longitude);

  const req = await fetch(`https://www.n2yo.com/rest/v1/satellite/above/${latitude}/${longitude}/0/70/32/&apiKey=${N2YO_KEY}`);
  const satellites = await req.json();

  return satellites.above.map(s => {

    return {
      ...s,
      canvasPosition: {
        x: sideralTime.calculate(s.satlng) - mySideral,
        y: s.satlat - latitude
      }
    };
  });
}

async function getStars(latitude, longitude) {
  const mySideral = sideralTime.calculate(longitude);

  const filteredStars = await db.execQuery(db.functions.get, 'stars', {
    $where:
      function () {
        return Math.sqrt(Math.pow(this.ra - mySideral, 2) + Math.pow(this.dec - latitude, 2)) <= 70;
      }
  });

  return filteredStars.map(s => ({
    ...s,
    canvasPosition: {
      x: s.ra - mySideral,
      y: s.dec - latitude
    }
  }));
}

module.exports = {
  getSatellites,
  getStars
};
