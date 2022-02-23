import { Typography } from "@mui/material";
import { Socket } from "socket.io-client";
import { IGame } from "../../interface/IGame";
import ConnectFourGrid from "./ConnectFourGrid";

interface IConnectFourProps {
    socket: Socket;
    game: IGame;
    finishGame: () => void; 
    columns: number;
    rows: number;
    contiguousCountersToWin: number;
}

const ConnectFour = ({ socket, game, finishGame, columns, rows, contiguousCountersToWin }: IConnectFourProps) => {
    const player = game.players.filter(x => x.id === socket?.id)[0];
    const opposingPlayer = game.players.filter(x => x.id !== socket.id)[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography textAlign='center' variant='h5'>{player?.username}({player?.counter}) vs {opposingPlayer?.username}({opposingPlayer?.counter})</Typography>
            <ConnectFourGrid socket={socket} game={game} finishGame={finishGame} columns={columns} rows={rows} contiguousCountersToWin={contiguousCountersToWin} />
        </div>
    )
}

export default ConnectFour;