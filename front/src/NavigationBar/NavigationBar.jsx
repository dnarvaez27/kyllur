import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './NavigationBar.css';
import ChangeLocation from './ChangeLocation/ChangeLocation';
import About from './About/About';
import DataShow from './DataShow/DataShow';
import Queries from './Queries/Queries';

const NavigationBar = ({ openModal, openFullModal, changeLocation, data, queries }) => {

  const [position, setPosition] = useState({ latitude: 0, longitude: 0, accuracy: 0 });
  const [state, setState] = useState(-1);

  useEffect(() => {
    if (state === 2) {
      openFullModal(true, <Queries queries={queries} />);
    }
  }, [queries]);

  useEffect(() => {
    changeLocation(position);
  }, [position]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        setPosition({ latitude: p.coords.latitude, longitude: p.coords.longitude });
      });
    } else {
      console.error('No geolocation');
    }
  }, []);

  useEffect(() => {
    if (state === 3) {
      openFullModal(true, <DataShow data={data} />);
    }
  }, [state, data]);

  const showChangeLocation = () => {
    openModal(true, <ChangeLocation
      currentLocation={position}
      changeLocation={(p) => {
        setPosition(p);
        openModal(false, undefined);
      }}
      cancel={() => openModal(false, undefined)} />);
  };

  const showAbout = () => {
    setState(1);
    openFullModal(true, <About close={() => openModal(false, undefined)} />);
  };

  const showData = () => {
    setState(3);
    openFullModal(true, <DataShow data={data} />);
  };

  const showQueries = () => {
    setState(2);
    openFullModal(true, <Queries queries={queries} />);
  };

  const closeFullModal = () => {
    setState(-1);
    openFullModal(false, undefined);
  }

  const closeOr = (st, or) => {
    return (state !== st
      ? (or)
      : (<><i className="fas fa-times-circle" /><span>Close</span></>)
    );
  };

  return (
    <div id="nav-bar">
      <div id="search-container">
        <button onClick={showChangeLocation}>
          <i className="fas fa-search" />
          <span>Change Location</span>
        </button>
        <button onClick={state !== 1 ? showAbout : closeFullModal} className={state === 1 ? 'active' : ''}>
          {closeOr(1, (
            <>
              <i className="fas fa-question-circle" />
              <span>About</span>
            </>
          ))}
        </button>
      </div>
      <div id="footer-container">
        <button onClick={state !== 2 ? showQueries : closeFullModal} className={state === 2 ? 'active' : ''}>
          {closeOr(2, (
            <>
              <i className="fas fa-stream" />
              <span>Queries</span>
            </>
          ))}
        </button>
        <button onClick={state !== 3 ? showData : closeFullModal} className={state === 3 ? 'active' : ''}>
          {closeOr(3, (
            <>
              <i className="fas fa-info-circle" />
              <span>Data</span>
            </>
          ))}
        </button>
      </div>
    </div >
  );
};

NavigationBar.propTypes = {
  openModal: PropTypes.func.isRequired,
  openFullModal: PropTypes.func.isRequired,
  changeLocation: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  queries: PropTypes.array.isRequired
};

export default NavigationBar;