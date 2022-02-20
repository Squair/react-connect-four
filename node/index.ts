import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Counter } from "./src/type/Counter";

const io = new Server(3001, { cors: { origin: 'http://localhost:3000' } });

interface IServerPlayer {
    username: string;
    socket: Socket;
}

interface IClientPlayer {
    username: string;
    id: string;
}

interface IGame {
    id: string;
    players: IClientPlayer[];
}

interface IMove {
    opposingPlayerId: string;
    counter: Counter;
    column: number;
}

let matchQueue: IServerPlayer[] = [];

const beginGame = () => {
    // Retrieve the players that joined the queue first (FIFO)
    const players = matchQueue.slice(-2);
    const gameId = uuidv4();

    const game: IGame = {
        id: gameId,
        players: players.map(p => ({id: p.socket.id, username: p.username}))
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

    socket.on("send move", (move: IMove) => io.to(move.opposingPlayerId).emit("recieve move", move));
});

io.on("disconnect", (socket) => matchQueue = matchQueue.filter(x => x !== socket.id));