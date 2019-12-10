import React from 'react';
import PropTypes from 'prop-types';
import './About.css';

const About = ({ close }) => {
  return (
    <div id="about">
      <span>Kyllur</span>
      <div>
        <span>Why Kyllur?</span>
        <span>
          The name comes frome the sound of the Quechuan word for star: <i>quyllur</i>.
        </span>
      </div>
      <div>
        <span>The project</span>
        <span>

          We want you to explore the sky above you, explore the stars and satellites above a location 
          in real <small>ish</small> time.
        </span>
        <ul style="list-style-type:none">
          <li>Interact with the objects in the sky! Click on them for more details.</li>
          <li>Don't like your sky? Change the your location to see a new sky</li>
        </ul>
      </div>
      <div>
        <span>How do we do it?</span>
        <span>
          We use <a target="_blank" rel="noopener noreferrer" href="https://www.n2yo.com/">N2YO</a> to access satellite locations in real time.
          We also use data from the <a target="_blank" rel="noopener noreferrer" href="http://www.astronexus.com/hyg">HYG star database</a> in conjunction with some maths in order to calculate your sky in real time.
        </span>
      </div>
      <div>
        <span>Who are we?</span>
        <span>
          We are <a target="_blank" rel="noopener noreferrer" href="http://pedrito.dev">Pedro Salazar</a> & <a target="_blank" href="https://dnarvaez27.github.io/" rel="noopener noreferrer">David Narvaez</a>
          <span>. Two students that have been starting projects at the last possible minute since 90's</span>
        </span>
      </div>
    </div>
  );
};

About.propTypes = {
  close: PropTypes.func.isRequired
};

export default About;
