import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './StarMap.css';
import Pin from './Pin';

const settings = {
  user: {
    radius: 8,
    color: '#ea4335'
  },
  satellite: {
    radius: 3,
    color: '#06ABC2',
    size: 25
  },
  star: {
    radius: 1,
    color: '#FFFFFF'
  }
};

const SatInfo = ({ sat }) => {
  return (
    <div>
      <span><b>Satellite</b></span>
      <span><b>Name:</b> {sat.satname}</span>
      <span><b>Designator:</b> {sat.intDesignator}</span>
      <span><b>Launch:</b> {sat.launchDate}</span>
      <span><b>Altitude:</b> {sat.satalt}</span>
    </div>
  );
}

const StarInfo = ({ star }) => {
  return (
    <div>
      <span><b>Star</b></span>
      <span><b>HD:</b> {star.hd}</span>
      <span><b>BF:</b> {star.bf}</span>
      <span><b>GL:</b> {star.gl}</span>
      <span><b>BF:</b> {star.bf}</span>
      <span><b>Constelation:</b> {star.con}</span>
      <span><b>Distance:</b> {star.dist}</span>
      <span><b>HR:</b> {star.hr}</span>
      <span><b>Magnitude:</b> {star.mag}</span>
      <span><b>Name:</b> {star.proper}</span>
      <span><b>Spetrum:</b> {star.spect}</span>
      <span><b>RA:</b> {star.ra}</span>
      <span><b>DEC:</b> {star.dec}</span>
    </div>
  );
}

const StarMap = ({ satelites, stars }) => {
  const canvasRef = useRef(null);
  const [constellation, setConstellation] = useState(undefined);
  const [starStore] = useState([]);
  const [satsStore] = useState([]);
  const [lastClicked, setLastClicked] = useState(undefined);

  const drawCenter = (context, center) => {
    // setTimeout(() => {
    //   context.beginPath();
    //   context.fillStyle = settings.user.color;
    //   context.arc(center, center, settings.user.radius, 0, 2 * Math.PI);
    //   context.fill();
    // }, 2500)

    // const img = document.getElementById("img-pin");
    // context.drawImage(img, center, center, settings.satellite.size, settings.satellite.size);
  }
  const drawSatelite = (context, center, xcoord, ycoord, data) => {
    const img = document.getElementById("img-sat");
    context.shadowColor = '#FFF';

    const x = xcoord + center;
    const y = ycoord + center;
    const s = settings.satellite.size;

    if (lastClicked && (data.satname === lastClicked.satname)) {
      context.shadowBlur = 8;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowColor = "white";
    }

    satsStore.push({ x, y, w: s, h: s, data });
    context.drawImage(img, x, y, s, s);

    context.globalAlpha = 1;
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowColor = "white";
  }
  const drawStar = (context, center, xcoord, ycoord, color, magnitude, data) => {
    context.beginPath();
    context.fillStyle = color;

    const x = xcoord + center;
    const y = ycoord + center;
    const r = Math.ceil(6 - magnitude);

    if (data.con === constellation) {
      context.shadowBlur = 8;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowColor = "white";
    }
    else {
      context.globalAlpha = 0.50;
    }

    starStore.push({ x, y, r, data })
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fill();

    context.globalAlpha = 1;
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowColor = "white";
  }

  const redrawAll = (_stars, _satelites, paint = true) => {
    while (starStore.length > 0) {
      starStore.pop();
    }
    while (satsStore.length > 0) {
      satsStore.pop();
    }

    const scaleCoordinate = (coord, center) => (coord / 70) * center;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const center = (window.innerHeight - 40) / 2;
    ctx.clearRect(0, 0, center * 2, center * 2);

    if (paint) {
      drawCenter(ctx, center);
      _stars.forEach(point => drawStar(ctx, center, scaleCoordinate(point.canvasPosition.x, center), scaleCoordinate(point.canvasPosition.y, center), point.ci, point.mag, point));
      _satelites.forEach(point => drawSatelite(ctx, center, scaleCoordinate(point.canvasPosition.x, center), scaleCoordinate(point.canvasPosition.y, center), point));
    }
  };

  const addClickListener = (e) => {
    const x = e.clientX - (e.target.width / 2) - 44;
    const y = e.clientY - 20;

    let isStar = false;

    let found = satsStore.filter(sat => (x >= sat.x && x <= (sat.x + sat.w) && y >= sat.y && y <= (sat.y + sat.h)));

    if (found.length === 0) {
      found = starStore.filter(star => Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2) <= star.r * 2);
      isStar = found.length > 0;
    }

    if (found.length > 0) {
      if (isStar) {
        if (JSON.stringify(lastClicked) === JSON.stringify(found[0].data)) {
          setLastClicked(undefined);
          setConstellation(undefined);
        } else {
          setLastClicked(found[0].data);
          setConstellation(found[0].data.con);
        }
      } else {
        setConstellation(undefined);
        if (JSON.stringify(lastClicked) === JSON.stringify(found[0].data)) {
          setLastClicked(undefined);
        } else {
          setLastClicked(found[0].data);
        }
      }
    }
  };

  useEffect(() => {
    redrawAll(JSON.parse(JSON.stringify(stars)), JSON.parse(JSON.stringify(satelites)));
  }, [satelites, stars, constellation]);

  return (
    <>
      <img id="img-sat" src="./assets/images/Satelite.png" alt="satellite-icon" />
      <Pin />
      <canvas
        id="star-canvas"
        ref={canvasRef}
        width={window.innerHeight - 40}
        height={window.innerHeight - 40}
        onClick={addClickListener} />
      <div className={stars.length === 0 ? 'loader-on' : 'loader-off'}>
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
      <div id="info" className={lastClicked ? 'show' : ''}>
        {lastClicked &&
          (lastClicked.satname ? <SatInfo sat={lastClicked} /> : <StarInfo star={lastClicked} />)
        }
      </div>
    </>
  );
}

StarMap.propTypes = {
  satelites: PropTypes.array,
  stars: PropTypes.array
}

export default StarMap;