import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DataShow.css';

const DataShow = ({ data }) => {
  const [state, setState] = useState({ state: 0, view: data.satellites });

  useEffect(() => {
    setState(prev => {
      return {
        state: prev.state,
        view: prev.state === 0 ? data.satellites : data.stars
      }
    })
  }, [data]);

  const changeView = (state, attr) => {
    return () => setState({ state, view: data[attr] });
  };

  const mapView = (e, key) => {
    if (state.state === 0) {
      return (
        <div key={`sat_${key}`}>
          <span>{`Satelite ${e.satname}`}</span>
          <span>
            <i className="fas fa-globe-americas" />
            <span>{e.intDesignator}</span>
          </span>
          <span>
            <i className="fas fa-rocket" />
            <span>{e.launchDate}</span>
          </span>
        </div>
      );
    } else {
      return (
        <div key={`star_${key}`}>
          <span>{`Star ${e.nombre}`}</span>
          <span>{`Mass ${e.masa}`}</span>
          <span>{e.descubrimiento}</span>
          <span>{e.tipo_deteccion}</span>
          <div>
            <button>
              <i className="fas fa-heart" />
              <i className="far fa-heart" />
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div id="datashow-container">
      <div>
        <div>
          <button className={state.state === 0 ? 'active' : ''} onClick={changeView(0, 'satellites')}>Satellites</button>
          <button className={state.state === 1 ? 'active' : ''} onClick={changeView(1, 'stars')}>Stars</button>
        </div>
      </div>
      <div>
        {state.view.map((e, i) => mapView(e, i))}
      </div>
    </div>
  );
};

DataShow.propTypes = {
  data: PropTypes.object.isRequired
}

export default DataShow;