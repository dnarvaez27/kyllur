import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './StarMap.css';

const settings = {
  user: {
    radius: 8,
    color: '#F25A38'
  },
  satellite: {
    radius: 3,
    color: '#06ABC2'
  },
  star: {
    radius: 1,
    color: '#FFFFFF'
  }
};

const StarMap = ({ satelites, stars }) => {
  const canvasRef = useRef(null)

  const drawCenter = (context, center) => {
    context.beginPath();
    context.fillStyle = settings.user.color;
    context.arc(center, center, settings.user.radius, 0, 2 * Math.PI);
    context.fill();
  }
  const drawSatelite = (context, center, xcoord, ycoord) => {
    context.beginPath();
    context.fillStyle = settings.satellite.color;
    context.arc(xcoord + center, ycoord + center, settings.satellite.radius, 0, 2 * Math.PI);
    context.fill();
  }
  const drawStar = (context, center, xcoord, ycoord) => {
    context.beginPath();
    context.fillStyle = settings.star.color;
    context.arc(xcoord + center, ycoord + center, settings.star.radius, 0, 2 * Math.PI);
    context.fill();
  }

  useEffect(() => {
    function scaleCoordinate(coord, center) {
      return (coord/70) * center;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const center = (window.innerHeight - 40) / 2;
    ctx.clearRect(0, 0, center * 2, center * 2);
    drawCenter(ctx, center);

    satelites.forEach(point => drawSatelite(ctx, center, scaleCoordinate(point.canvasPosition.x, center),scaleCoordinate(point.canvasPosition.y, center)));
    stars.forEach(point => drawStar(ctx, center, scaleCoordinate(point.canvasPosition.x, center), scaleCoordinate(point.canvasPosition.y, center)));

  }, [satelites, stars]);

  return (
    <canvas
    id="star-canvas"
      ref={canvasRef}
      width={window.innerHeight - 40}
      height={window.innerHeight - 40} />
  );
}

StarMap.propTypes = {
  satelites: PropTypes.array,
  stars: PropTypes.array
}

export default StarMap;