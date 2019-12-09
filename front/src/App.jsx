import React, { useState, useEffect } from 'react';
import './App.css';
import NavigationBar from './NavigationBar/NavigationBar';
import Modal from './Modal/Modal';
import StarMap from './StarMap/StarMap';
import FullModal from './FullModal/FullModal';

const wssURI = 'ws://localhost:3001/ws';
console.log(`WSS URL ${wssURI}`);


const App = () => {

  const [modalState, setModalState] = useState({ open: false, content: undefined });
  const [fullModalState, setFullModalState] = useState({ open: false, content: undefined });
  const [state, setState] = useState({ stars: [], satellites: [] });
  const [position, setPosition] = useState({ stars: [], satellites: [] });
  const [ready, setReady] = useState(false);
  const [ws, setWs] = useState(null);
  const [queries, setQueries] = useState([]);

  let initialFetch = null;
  useEffect(() => {
    const nWs = new WebSocket(wssURI);
    setWs(nWs);
    window.particlesJS.load('particles-js', '/assets/scripts/particles.json', () => { });
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        setReady(true);
        console.log('WS: Connected');
        ws.send('SUBSCRIBE;locations');
        if (initialFetch) {
          initialFetch();
        }
      };
      ws.onclose = () => console.log('WS: Closed');
      ws.onerror = (err) => console.log('WS: Error', err);
      ws.onmessage = ev => {
        const msg = JSON.parse(ev.data);
        if ('LIVE' in msg) {
          setState(msg.LIVE);
        } else if ('CH_LOCATIONS' in msg) {
          setQueries(msg.CH_LOCATIONS);
        } else {
          console.log(msg);
        }
        // console.log(`WS: Message ${JSON.stringify(msg)}`);
      }
    }
  }, [ws, initialFetch]);

  const openModal = (state, content) => {
    setModalState({ open: state, content });
  };

  const openFullModal = (state, content) => {
    setFullModalState({ open: state, content });
  };

  const changeLocation = (position) => {
    if (ready) {
      setPosition(position);
      ws.send(`LOCATION;${position.latitude};${position.longitude}`);
    } else {
      initialFetch = () => {
        setPosition(position);
        ws.send(`LOCATION;${position.latitude};${position.longitude}`);
      }
    }
  };

  return (
    <div id="main-container">
      <NavigationBar openModal={openModal} openFullModal={openFullModal} changeLocation={changeLocation} data={state} queries={queries} />
      <StarMap satelites={state.satellites} stars={state.stars} coordinates={position} />
      <Modal open={modalState.open} content={modalState.content} />
      <FullModal open={fullModalState.open} content={fullModalState.content} />
    </div>
  );
}

export default App;
