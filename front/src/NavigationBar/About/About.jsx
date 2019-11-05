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
          The name comes frome the sound of <i>quyllur</i> from Quechuan language that stands for star.
          We want to popularize native languages with amazing words!
        </span>
      </div>
      <div>
        <span>The project</span>
        <span>
          Initially this project starts as a University project for ISIS-3710 Web development.
          However, we want to power this tool up to explore things in the sky beyond our sight.
        </span>
      </div>
      <div>
        <span>What we use?</span>
        <span>
          We are using <a target="_blank" rel="noopener noreferrer" href="https://www.n2yo.com/">N2YO</a> for accessing satellites location in real time, 
          our own database in Mongo to store around 3K stars coordinates in the space and some maths to paint them in a canvas
        </span>
      </div>
      <div>
        <span>Who are we?</span>
        <span>
          We are <a target="_blank" rel="noopener noreferrer" href="http://pedrito.dev">Pedro Salazar</a> & <a target="_blank" href="https://dnarvaez27.github.io/" rel="noopener noreferrer">David Narvaez</a>
          <span>. Two students who start projects until the last minute since 90's</span>
        </span>
      </div>
    </div>
  );
};

About.propTypes = {
  close: PropTypes.func.isRequired
};

export default About;