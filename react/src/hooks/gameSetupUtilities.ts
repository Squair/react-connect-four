import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IGame } from "../interface/IGame";
import { PreGameState } from "../type/PreGameState";
import { createSocket } from "../utils/createSocket";
import { getSocketHost } from "../utils/getSocketHost";

const useGameSetupUtilities = (username: string | undefined) => {
  const [socket, setSocket] = useState<Socket>();
  const [gameState, setGameState] = useState<PreGameState>('PreLobby');
  const [foundGame, setFoundGame] = useState<IGame>();

  // Listen for socket.io to broadcast a game was found
  useEffect(() => {
    if (!socket) return;

    socket.on("found game", (game: IGame) => {
      setGameState('Found game');
      setFoundGame(game);
    });

    // Disconnect socket when component unmounts
    return () => { socket?.disconnect() }
  }, [socket]);

  const beginFindingGame = () => {
    if (!username) return;

    const socketHost = getSocketHost();
    if (!socketHost) {
      console.error("No configuration provided for socket.io host.");
      return;
    }

    setGameState('Finding game');
    setSocket(createSocket(socketHost, username));
  };

  const endGame = () => {
    setGameState('PreLobby');
    setFoundGame(undefined);
    socket?.disconnect();
  }

  return { beginFindingGame, endGame, gameState, foundGame, socket }
}

export default useGameSetupUtilities;