import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import ConnectFourGrid from './components/game/ConnectFourGrid';
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

  useEffect(() => {
    if (!socket) return;

    socket.on("found game", (game: IGame) => {
      setFoundGame(game);
      stopFindingGame();
    });

  }, [socket])

  const stopFindingGame = () => setFindingGame(false);

  const onStartClick = () => {
    // Emit to socket.io, join queue
    if (!username) return;

    beginFindingGame();
  }

  const player = foundGame?.players.filter(x => x.id === socket?.id)[0];
  const opposingPlayer = foundGame?.players.filter(x => x.id !== socket?.id)[0];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {!findingGame && !foundGame && <PreLobby username={username} setUsername={setUsername} onStartClick={onStartClick} />}
      {findingGame && username && <Lobby username={username} cancelFindingGame={stopFindingGame} />}

      {foundGame && socket && foundGame && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography textAlign='center' variant='h3'>{player?.username}({player?.counter}) vs {opposingPlayer?.username}({opposingPlayer?.counter})</Typography>
          <ConnectFourGrid socket={socket} game={foundGame} columns={7} rows={6} winningContiguousCounters={4} />
        </div>
      )}
    </div>
  );
}

export default App;
