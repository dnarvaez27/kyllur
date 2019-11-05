import React from 'react';
import PropTypes from 'prop-types';
import './Queries.css';

const Queries = ({ queries }) => {

  return (
    <div id="queries-container">
      {queries.reverse().map((q, i) => (
        <div key={`cord_${i}`}>
          <span>({q.latitude}, {q.longitude})</span>
        </div>
      ))}
    </div>
  );
};

Queries.propTypes = {
  queries: PropTypes.array.isRequired
}

export default Queries;