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
    const socketHost = import.meta.env.VITE_SOCKET_HOST;

    if (!socketHost) {
      console.error("No configuration provided for socket.io host.");
      return;
    }
    const socket = io(socketHost, { query: { username } });

    setSocket(socket);
  };

  const stopFindingGame = () => setFindingGame(false);

  const endGame = () => {
    stopFindingGame();
    setFoundGame(undefined);
    socket?.disconnect();
  }

  useEffect(() => {
    if (!socket) return;

    const beginGame = (game: IGame) => {
      setFoundGame(game);
      stopFindingGame();
    }

    socket.on("found game", beginGame);

    return () => {
      socket?.disconnect();
    }
  }, [socket])


  const onStartClick = () => {
    if (!username) return;
    beginFindingGame();
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {!findingGame && !foundGame && <PreLobby username={username} setUsername={setUsername} onStartClick={onStartClick} />}
      {findingGame && username && <Lobby username={username} cancelFindingGame={endGame} />}

      {foundGame && socket && <ConnectFour socket={socket} game={foundGame} finishGame={endGame} columns={7} rows={6} contiguousCountersToWin={4} />}
    </div>
  );
}

export default App;
