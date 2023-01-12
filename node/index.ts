import { config } from 'dotenv';
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Counter } from "./src/type/Counter";

// Load variables from .env into process
config();

const allowedOrigins = process.env.ALLOWED_ORIGINS;
const port = process.env.PORT;

const io = new Server(parseInt(port), { cors: { origin: allowedOrigins } });

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
    boardSizeId: string;
}

interface IMove {
    opposingPlayerId: string;
    counter: Counter;
    column: number;
}

export interface IGameboardSize {
    id: string;
    rows: number;
    columns: number;
}

const matchQueues: { [key: string]: IServerPlayer[] } = {}

const beginGame = (boardSizeId: string) => {
    // Retrieve the players that joined the queue first (FIFO)
    const players = matchQueues[boardSizeId].slice(-2);
    const gameId = uuidv4();

    const clientPlayers: IClientPlayer[] = players.map(p => ({
        id: p.socket.id,
        username: p.username,
        counter: '⚪'
    }));

    // Randomly assign players to a colour 
    const randomNumber = Math.round(Math.random());
    clientPlayers[0].counter = randomNumber ? '🔴' : '🟡';
    clientPlayers[1].counter = clientPlayers[0].counter == '🔴' ? '🟡' : '🔴';

    const randomPlayer = clientPlayers[Math.floor(Math.random() * clientPlayers.length)];

    const game: IGame = {
        id: gameId,
        players: clientPlayers,
        firstPlayerToMove: randomPlayer,
        boardSizeId: boardSizeId
    }

    players.map(player => player.socket.join(gameId));
    io.to(gameId).emit("found game", game);

    //Remove players from queue
    matchQueues[boardSizeId] = matchQueues[boardSizeId].filter(x => !players.map(p => p.socket.id).includes(x.socket.id));
}

const registerEvents = (socket: Socket, boardSizeId: string) => {
    // Remove player from queue on disconnect
    socket.on("disconnect", () => matchQueues[boardSizeId] = matchQueues[boardSizeId].filter(x => x.socket.id !== socket.id));
    socket.on("send move", (move: IMove) => socket.to(move.opposingPlayerId).emit("recieve move", move));
}

io.on("connection", (socket) => {
    const boardSizeId = socket.handshake.query.boardSizeId as string;

    const existingPlayers = matchQueues[boardSizeId] ?? [];
    const newPlayer: IServerPlayer = { username: socket.handshake.query.username as string, socket };

    matchQueues[boardSizeId] = [newPlayer, ...existingPlayers];
    registerEvents(socket, boardSizeId);

    if (matchQueues[boardSizeId].length >= 2) {
        beginGame(boardSizeId);
    }
});