import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Counter } from "./src/type/Counter";
import { config } from 'dotenv';

// Load variables from .env into process
config();

const allowedOrigins = process.env.ALLOWED_ORIGINS;

const io = new Server(3001, { cors: { origin: allowedOrigins } });

interface IServerPlayer {
    username: string;
    socket: Socket;
}

interface IClientPlayer {
    username: string;
    id: string;
    counter: Counter;
}

interface IGame {
    id: string;
    players: IClientPlayer[];
    firstPlayerToMove: IClientPlayer;
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

    const clientPlayers: IClientPlayer[] = players.map(p => ({
        id: p.socket.id, 
        username: p.username, 
        counter: '⚪'
    }));

    clientPlayers[0].counter = '🔴';
    clientPlayers[1].counter = '🟡';

    const randomPlayer = clientPlayers[Math.floor(Math.random() * clientPlayers.length)];

    const game: IGame = {
        id: gameId,
        players: clientPlayers,
        firstPlayerToMove: randomPlayer
    }

    players.map(player => player.socket.join(gameId));
    io.to(gameId).emit("found game", game);
    
    //Remove players from queue
    matchQueue = matchQueue.filter(x => !players.map(p => p.socket.id).includes(x.socket.id));
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