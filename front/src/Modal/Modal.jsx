import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ open, content }) => {
  return (
    <div id="modal" className={!open ? 'hidden' : ''}>
      <div id="modal-bg" />
      <div id="modal-content">{content}</div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  content: PropTypes.object
}

export default Modal;