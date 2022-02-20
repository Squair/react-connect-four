import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import ConnectFour from './components/game/ConnectFour';
import Lobby from './components/Lobby';
import PreLobby from './components/PreLobby';
import { IGame } from './interface/IGame';

const App = () => {
  const [username, setUsername] = useState<string>();
  const [findingGame, setFindingGame] = useState<boolean>(false);
  const [foundGame, setFoundGame] = useState<IGame>();

  const [socket, setSocket] = useState<Socket>();

  const beginFindingGame = () => {
    if (!username) return;

    setFindingGame(true);
    const socket = io("http://localhost:3001", { query: { username } });
    setSocket(socket);
  };

  const stopFindingGame = () => setFindingGame(false);

  useEffect(() => {
    if (!socket) return;

    const beginGame = (game: IGame) => {
      setFoundGame(game);
      stopFindingGame();
    }

    socket.on("found game", beginGame);
  }, [socket])


  const onStartClick = () => {
    if (!username) return;
    beginFindingGame();
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {!findingGame && !foundGame && <PreLobby username={username} setUsername={setUsername} onStartClick={onStartClick} />}
      {findingGame && username && <Lobby username={username} cancelFindingGame={stopFindingGame} />}

      {foundGame && socket && <ConnectFour socket={socket} game={foundGame} columns={7} rows={6} contiguousCountersToWin={4} />}
    </div>
  );
}

export default App;
