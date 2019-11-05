import React from 'react';
import PropTypes from 'prop-types';
import './About.css';

const About = ({ close }) => {
  return (
    <div id="about">
      <button onClick={close}>&times;</button>
      <span>Kyllur</span>
      <div>
        <span>Why Kyllur?</span>
        <span></span>
      </div>
      <div>
        <span>About us</span>
        <span>
          We are <a target="_blank" href="http://pedrito.dev">Pedrito</a> & <a target="_blank" href="https://dnarvaez27.github.io/">David</a>
        </span>
      </div>
    </div>
  );
};

About.propTypes = {
  close: PropTypes.func.isRequired
};

export default About;