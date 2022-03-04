import React, { useState } from 'react';
import ConnectFour from './components/game/ConnectFour';
import Lobby from './components/Lobby';
import PreLobby from './components/PreLobby';
import useGameSetupUtilities from './hooks/gameSetupUtilities';
import { IGameboardSize } from './interface/IGameboardSize';
import { defaultGameboardSize } from './utils/gameboardSizes';

const App = () => {
  const [username, setUsername] = useState<string>();
  const [gameboardSize, setGameboardSize] = useState<IGameboardSize>(defaultGameboardSize);

  const { beginFindingGame, endGame, foundGame, gameState, socket } = useGameSetupUtilities(username);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {gameState === 'Idle' && (
        <PreLobby username={username}
          setUsername={setUsername}
          gameboardSize={gameboardSize}
          setGameboardSize={setGameboardSize}
          onStartClick={beginFindingGame}
        />
      )}

      {gameState === 'Finding game' && username && <Lobby username={username} cancelFindingGame={endGame} />}

      {gameState === 'Found game' && foundGame && socket && (
        <ConnectFour socket={socket}
          game={foundGame}
          finishGame={endGame}
          columns={gameboardSize.columns}
          rows={gameboardSize.rows}
          contiguousCountersToWin={4}
        />
      )}
    </div>
  );
}

export default App;
