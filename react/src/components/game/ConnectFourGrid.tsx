import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { IGame } from "../../interface/IGame";
import { IMove } from "../../interface/IMove";
import { IPlayer } from "../../interface/IPlayer";
import { Counter } from "../../type/Counter";
import ConnectFourGridItem from "./ConnectFourGridItem";

interface ConnectFourGridProps {
    socket: Socket;
    game: IGame;
    columns: number;
    rows: number;
    contiguousCountersToWin: number;
}

const ConnectFourGrid = ({ socket, game, columns, rows, contiguousCountersToWin }: ConnectFourGridProps) => {
    const initializeEmptyGameBoard = (cols: number, rows: number) => {
        const emptyGrid: Counter[][] = [];

        for (let row = 0; row < rows; row++) {
            emptyGrid[row] = new Array<Counter>(cols).fill('⚪');
        }

        return emptyGrid;
    }

    const [gameboard, setGameBoard] = useState<Counter[][]>(initializeEmptyGameBoard(columns, rows));
    const [winningPlayer, setWinningPlayer] = useState<IPlayer>();

    const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(game.firstPlayerToMove);

    useEffect(() => {
        socket.on("recieve move", (move: IMove) => {
            const counterAdded = addCounterToColumn(move.counter, move.column);
            setGameBoard(counterAdded.newGameboard);
            switchToPlayer(move.opposingPlayerId);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const switchToPlayer = (playerId: string) => setCurrentPlayer(game.players.filter(x => x.id === playerId)[0]);
    const getPlayerFromCounter = (counter: Counter) => game.players.filter(x => x.counter === counter)[0];
    const getOpposingPlayerId = (): string => game.players.filter(x => x.id !== socket.id)[0].id;

    const canMakeMove = (): boolean => !winningPlayer && socket.id === currentPlayer.id

    const makeMove = (column: number) => {
        if (!canMakeMove()) return;

        const counter = currentPlayer.counter;
        const counterAdded = addCounterToColumn(counter, column);
        setGameBoard(counterAdded.newGameboard);

        const opposingPlayerId = getOpposingPlayerId();
        const move: IMove = { opposingPlayerId: opposingPlayerId, counter, column };
        socket.emit("send move", move);

        if (counterAdded.rowAdded && isWinningMove(counterAdded.newGameboard, counter, counterAdded.rowAdded, column)) {
            return setWinningPlayer(getPlayerFromCounter(counter));
        }

        switchToPlayer(opposingPlayerId);
    }

    const addCounterToColumn = (counter: Counter, column: number): { rowAdded?: number, newGameboard: Counter[][] } => {
        if (isColumnFull(gameboard, column)) return { rowAdded: undefined, newGameboard: gameboard };

        const newGameboard = [...gameboard];

        let rowAdded;

        //Start at the bottom of the grid and loop backwards as connect four pieces drop down to the bottom
        for (let row = rows - 1; row >= 0; row--) {
            if (newGameboard[row][column] === '⚪') {
                newGameboard[row][column] = counter;
                rowAdded = row;
                break;
            }
        }

        return { rowAdded, newGameboard };
    }

    // Get if top row for column is not empty.
    const isColumnFull = (gameboard: Counter[][], column: number) => gameboard[0][column] !== '⚪';

    const isWinningMove = (gameboardToCheck: Counter[][], counter: Counter, rowLastPlayed: number, columnLastPlayed: number): boolean => {
        const rowMinBound = Math.max(0, rowLastPlayed - contiguousCountersToWin);
        const rowMaxBound = Math.min(rows - 1, rowLastPlayed + contiguousCountersToWin);

        const colMinBound = Math.max(0, columnLastPlayed - contiguousCountersToWin);
        const colMaxBound = Math.min(columns - 1, columnLastPlayed + contiguousCountersToWin);

        let contiguousCounters = 0;
        let colCounter;

        // Check horizonal lines
        for (let column = colMinBound; column <= colMaxBound; column++) {
            contiguousCounters = gameboardToCheck[rowLastPlayed][column] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === contiguousCountersToWin) return true;
        }

        // Check vertical lines
        contiguousCounters = 0;
        for (let row = rowMinBound; row <= rowMaxBound; row++) {
            contiguousCounters = gameboardToCheck[row][columnLastPlayed] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === contiguousCountersToWin) return true;
        }

        // Check line like: \
        contiguousCounters = 0;
        colCounter = colMinBound;
        for (let row = Math.max(0, rowLastPlayed - columnLastPlayed); row <= rowMaxBound; row++) {
            contiguousCounters = gameboardToCheck[row][colCounter] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === contiguousCountersToWin) return true;

            colCounter++;
        }

        // Checking a line like: /
        contiguousCounters = 0;
        colCounter = colMinBound;
        for (let row = rowMaxBound; row >= rowMinBound; row--) {
            contiguousCounters = gameboardToCheck[row][colCounter] === counter ? contiguousCounters + 1 : 0;

            if (contiguousCounters === contiguousCountersToWin) return true;

            colCounter++;
        }

        return false;
    }

    const getConnectForGridItems = () => {
        return gameboard.map((rowGridItem, rowIndex) => rowGridItem.map((columnGridItem, columnIndex) => (
            <ConnectFourGridItem key={`${rowIndex}${columnIndex}`}
                gridItem={columnGridItem}
                size={1}
                column={columnIndex}
                makeMove={makeMove}
            />
        )));
    }

    const getGameInformationText = () => {
        const message = winningPlayer ? `${winningPlayer.username}(${winningPlayer.counter}) has won!`
            : `${currentPlayer.username}'s (${currentPlayer.counter}) turn!`;

        return <Typography variant='overline'>{message}</Typography>
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Grid container columns={columns} sx={{ zIndex: 1, background: 'radial-gradient(circle, rgba(42,42,242,1) 83%, rgba(42,42,242,1) 98%, rgba(0,168,255,1) 100%, rgba(2,0,36,1) 100%, rgba(2,0,36,1) 100%, rgba(0,212,255,1) 100%)', width: '95%', boxShadow: '-5px 7px 25px 2px rgba(0,0,0,0.75)' }}>
                {getConnectForGridItems()}
            </Grid>

            <div style={{ backgroundColor: 'blue', border: '1px solid black', width: '97%', height: '3.5em', transform: 'skew(29deg, 0deg' }}>
                <Typography variant='h3' textAlign='center'><span style={{WebkitTextStroke: '50px solid black', color: 'red'}}>Connect</span> <span style={{color: 'yellow'}}>Four</span></Typography>
            </div>

            {getGameInformationText()}
        </Box>
    )
}

export default ConnectFourGrid; 