import React, { useState } from 'react';
import ConnectFourGrid from './components/game/ConnectFourGrid';
import Lobby from './components/Lobby';
import PreLobby from './components/PreLobby';

const App = () => {
  const [username, setUsername] = useState<string>();
  const [findingGame, setFindingGame] = useState<boolean>(false);
  const [foundGame, setFoundGame] = useState<boolean>(false);

  const beginFindingGame = () => setFindingGame(true);
  const cancelFindingGame = () => setFindingGame(false);

  const onStartClick = () => {
    // Emit to socket.io, join queue
    if (!username) return;

    beginFindingGame();
    cancelFindingGame();
    setFoundGame(true);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {!findingGame && !foundGame && <PreLobby username={username} setUsername={setUsername} onStartClick={onStartClick} />}
      {findingGame && username && <Lobby username={username} cancelFindingGame={cancelFindingGame} />}
      {foundGame && <ConnectFourGrid columns={7} rows={6} winningContiguousCounters={4} />}
    </div>
  );
}

export default App;
