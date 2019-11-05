import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ChangeLocation.css';

const ChangeLocation = ({ currentLocation, changeLocation, cancel }) => {

  const [latitude, setLatitude] = useState(currentLocation.latitude);
  const [longitude, setLongitude] = useState(currentLocation.longitude);

  const getCurrent = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        setLatitude(p.coords.latitude);
        setLongitude(p.coords.longitude);
      });
    } else {
      console.error('No geolocation');
    }
  };

  return (
    <div id="changelocation-container">
      <div>
        <span>Change Location</span>
        <button title="Current Position" onClick={getCurrent}>
          <i className="fas fa-crosshairs" />
        </button>
      </div>
      <div>
        <label>
          <span>
            <i className="fas fa-map-marker-alt" />
            Latitude
          </span>
          <input type="number" placeholder="latitude" value={latitude} onChange={e => setLatitude(+e.target.value)} />
        </label>
        <label>
          <span>
            <i className="fas fa-map-marker-alt" />
            Longitude
          </span>
          <input type="number" placeholder="longitude" value={longitude} onChange={e => setLongitude(+e.target.value)} />
        </label>
      </div>
      <div>
        <button onClick={() => cancel()}>Cancel</button>
        <button onClick={() => changeLocation({ latitude, longitude })}>Change</button>
      </div>
    </div>
  );
};

ChangeLocation.propTypes = {
  currentLocation: PropTypes.object,
  changeLocation: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};

export default ChangeLocation;
