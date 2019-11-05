import React, { useState, useEffect } from 'react';
import './App.css';
import NavigationBar from './NavigationBar/NavigationBar';
import Modal from './Modal/Modal';

const wssURI = 'ws://localhost:3001/ws';

const App = () => {
  useEffect(() => {
    const ws = new WebSocket(wssURI);
    ws.onopen = () => {
      console.log('WS: Connected');
      ws.send('satellites');
    };
    ws.onclose = () => console.log('WS: Closed');
    ws.onerror = (err) => console.log('WS: Error', err);
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data);
      console.log(`WS: Message ${JSON.stringify(msg)}`);
    }
  }, []);

  const [modalState, setModalState] = useState({ open: false, content: undefined });

  const openModal = (state, content) => {
    setModalState({ open: state, content });
  };

  const changeLocation = (position) => {
    // TODO: Verify multiple calls
    console.log(position);
  };

  return (
    <div id="main-container">
      <NavigationBar openModal={openModal} changeLocation={changeLocation} />
      <Modal open={modalState.open} content={modalState.content} />
    </div>
  );
}

export default App;
