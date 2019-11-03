import React from 'react';
import './App.css';

const wssURI = 'ws://localhost:3001/ws';

const App = () => {

  const ws = new WebSocket(wssURI);
  ws.onopen = () => {
    console.log('WS: Connected');
    ws.send('stellars');
  };
  ws.onclose = () => console.log('WS: Closed');
  ws.onerror = (err) => console.log('WS: Error', err);
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    console.log(`WS: Message ${JSON.stringify(msg)}`);
  }

  return (
    <div className="App">
    </div>
  );
}

export default App;
