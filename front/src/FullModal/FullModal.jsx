import React from 'react';
import PropTypes from 'prop-types';
import './FullModal.css';

const FullModal = ({ open, content }) => {
  return (
    <div id="fullmodal" className={!open ? 'hidden' : ''}>
      {content}
    </div>
  );
};

FullModal.propTypes = {
  open: PropTypes.bool.isRequired,
  content: PropTypes.object
}

export default FullModal;