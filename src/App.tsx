import React, { useState } from 'react';
import './App.css';
import Lobby from './components/Lobby';
import PreLobby from './components/PreLobby';

const App = () => {
  const [username, setUsername] = useState<string>();
  const [findingGame, setFindingGame] = useState<boolean>(false);

  const beginFindingGame = () => setFindingGame(true);
  const cancelFindingGame = () => setFindingGame(false);

  const onStartClick = () => {
    // Emit to socket.io, join queue
    if (!username) return;

    beginFindingGame();

  }

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {!findingGame && <PreLobby username={username} setUsername={setUsername} onStartClick={onStartClick} /> }
      {findingGame && username && <Lobby username={username} cancelFindingGame={cancelFindingGame} />}
    </div>
  );
}

export default App;
