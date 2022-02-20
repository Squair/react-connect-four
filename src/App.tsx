import React, { useState } from 'react';
import './App.css';
import PreLobby from './components/PreLobby';

const App = () => {
  const [username, setUsername] = useState<string>();

  const onStartClick = () => {
    // Emit to socket.io, join queue
  }

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <PreLobby username={username} setUsername={setUsername} onStartClick={onStartClick} />
    </div>
  );
}

export default App;
