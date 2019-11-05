import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './NavigationBar.css';
import ChangeLocation from './ChangeLocation/ChangeLocation';
import About from './About/About';

const NavigationBar = ({ openModal, changeLocation }) => {

  const [position, setPosition] = useState({ latitude: 0, longitude: 0, accuracy: 0 });

  useEffect(() => changeLocation(position), [position]);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(p => {
      setPosition({ latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy });
    });
  }

  const showChangeLocation = () => {
    openModal(true, <ChangeLocation
      currentLocation={position}
      changeLocation={(position) => {
        changeLocation(position);
        openModal(false, undefined);
      }}
      cancel={() => openModal(false, undefined)} />);
  };

  const showAbout = () => {
    openModal(true, <About close={() => openModal(false, undefined)} />);
  };

  return (
    <div id="nav-bar">
      <div id="search-container">
        <button onClick={showChangeLocation}>
          <i className="fas fa-search" />
          <span>Change Location</span>
        </button>
        <button onClick={showAbout}>
          <i className="fas fa-question-circle" />
          <span>About</span>
        </button>
      </div>
    </div>
  );
};

NavigationBar.propTypes = {
  openModal: PropTypes.func.isRequired,
  changeLocation: PropTypes.func.isRequired
};

export default NavigationBar;