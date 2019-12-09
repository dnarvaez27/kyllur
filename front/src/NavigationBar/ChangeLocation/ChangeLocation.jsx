import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ChangeLocation.css';
import ReactMap from './ReactMap';


const ChangeLocation = ({ currentLocation, changeLocation, cancel }) => {

  const [position, setPosition] = useState({ lat: currentLocation.latitude, lng: currentLocation.longitude });

  // const [latitude, setLatitude] = useState(currentLocation.latitude);
  // const [longitude, setLongitude] = useState(currentLocation.longitude);

  const getCurrent = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
      });
    } else {
      console.error('No geolocation');
    }
  };

  return (
    <div id="changelocation-container">
      <div>
        <span>Change Location</span>
        <span>{position.lat}, {position.lng}</span>
        <button title="Your Location" onClick={getCurrent}>
          <i className="fas fa-crosshairs" />
        </button>
      </div>
      <div>
        <ReactMap
          center={position}
          onDragend={({ lat, lng }) => setPosition({ lat, lng })} />
      </div>
      <div>
        <button onClick={() => cancel()}>Cancel</button>
        <button onClick={() => changeLocation({ latitude: position.lat, longitude: position.lng })}>Change</button>
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
