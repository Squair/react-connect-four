import { Button, Container, Typography } from "@mui/material";
import { Socket } from "socket.io-client";
import useConnectFourUtilities from "../../hooks/connectFourUtilities";
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
    const { gameboard, makeMove, winningPlayer, draw, GameInformationText } = useConnectFourUtilities(socket, game, columns, rows, contiguousCountersToWin);

    const player = game.players.filter(x => x.id === socket?.id)[0];
    const opposingPlayer = game.players.filter(x => x.id !== socket.id)[0];

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography textAlign='center' variant='h5'>{player?.username}({player?.counter}) vs {opposingPlayer?.username}({opposingPlayer?.counter})</Typography>

            <ConnectFourGrid gameboard={gameboard} makeMove={makeMove} />

            <Container maxWidth='sm' sx={{display: 'flex', flexDirection: 'column'}}>
                <GameInformationText />
                {(winningPlayer || draw) && <Button variant='contained' onClick={finishGame}>Return to Lobby</Button>}
            </Container>
        </div>
    )
}

export default ConnectFour;