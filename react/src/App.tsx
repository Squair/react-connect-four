import React, { useState } from 'react';
import ConnectFour from './components/game/ConnectFour';
import Lobby from './components/Lobby';
import PreLobby from './components/PreLobby';
import useGameSetupUtilities from './hooks/gameSetupUtilities';

const App = () => {
  const [username, setUsername] = useState<string>();
  const { beginFindingGame, endGame, foundGame, gameState, socket } = useGameSetupUtilities(username);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {gameState === 'PreLobby' && <PreLobby username={username} setUsername={setUsername} onStartClick={beginFindingGame} />}
      {gameState === 'Finding game' && username && <Lobby username={username} cancelFindingGame={endGame} />}
      {gameState === 'Found game' && foundGame && socket && <ConnectFour socket={socket} game={foundGame} finishGame={endGame} columns={7} rows={6} contiguousCountersToWin={4} />}
    </div>
  );
}

export default App;
