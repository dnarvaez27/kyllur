import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ChangeLocation.css';

const ChangeLocation = ({ currentLocation, changeLocation, cancel }) => {

  const [latitude, setLatitude] = useState(currentLocation.latitude);
  const [longitude, setLongitude] = useState(currentLocation.longitude);

  return (
    <div id="changelocation-container">
      <div>Change Location</div>
      <div>
        <label>
          <span>
            <i className="fas fa-map-marker-alt" />
            Latitude
          </span>
          <input placeholder="latitude" defaultValue={latitude} />
        </label>
        <label>
          <span>
            <i className="fas fa-map-marker-alt" />
            Longitude
          </span>
          <input placeholder="longitude" defaultValue={longitude} />
        </label>
      </div>
      <div>
        <button onClick={() => cancel()} >Cancel</button>
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
