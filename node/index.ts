import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Counter } from "./src/type/Counter";

const io = new Server(3001, { cors: { origin: 'http://localhost:3000' } });

interface IPlayer {
    username: string;
    socket: Socket;
}

interface IGame {
    id: string;
    players: string[];
}

interface IMove {
    gameId: string;
    counter: Counter;
    column: number;
}

let matchQueue: IPlayer[] = [];

const beginGame = () => {
    // Retrieve the players that joined the queue first (FIFO)
    const players = matchQueue.slice(-2);
    const gameId = uuidv4();

    const game: IGame = {
        id: gameId,
        players: players.map(x => x.username)
    }

    players.map(player => {
        player.socket.join(gameId);
        io.to(gameId).emit("found game", game);
    });
}

io.on("connection", (socket) => {
    // Add new players to start of array
    matchQueue = [{ username: socket.handshake.query.username as string, socket }, ...matchQueue];

    if (matchQueue.length >= 2) {
        beginGame();
    }
});

io.on("disconnect", (socket) => matchQueue = matchQueue.filter(x => x !== socket.id));