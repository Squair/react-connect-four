import { Container, Grid, Typography } from "@mui/material";
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
    winningContiguousCounters: number;
}

const ConnectFourGrid = ({ socket, game, columns, rows, winningContiguousCounters }: ConnectFourGridProps) => {
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
            addCounter(move.counter, move.column);
            setCurrentPlayer(game.players.filter(x => x.id === move.opposingPlayerId)[0]);
        });
    }, [socket]);

    const makeMove = (column: number) => {
        if (winningPlayer) return;

        // Only allow users to make moves when its their turn.
        if (socket.id !== currentPlayer.id) return;

        const counter = currentPlayer.counter;

        // If counter couldn't be added, return early.
        if (!addCounter(counter, column)) return;

        const opposingPlayerId = game.players.filter(x => x.id !== socket.id)[0].id;
        const move: IMove = { opposingPlayerId, counter, column };
        socket.emit("send move", move);
        setCurrentPlayer(game.players.filter(x => x.id === move.opposingPlayerId)[0]);
    }

    const addCounter = (counter: Counter, column: number): boolean => {
        const gridCopy = [...gameboard];

        //Start at the bottom of the grid and loop backwards as connect four pieces drop down to the bottom
        for (let row = rows - 1; row >= 0; row--) {
            // If a column is full, prevent the move from happening.
            if (row === 0 && gridCopy[row][column] !== '⚪') {
                return false;
            }

            if (gridCopy[row][column] === '⚪') {
                gridCopy[row][column] = counter;

                if (isWinningMove(gridCopy, counter, row, column)) setWinningPlayer(game.players.filter(x => x.counter === counter)[0]);
                break;
            }
        }

        setGameBoard(gridCopy);
        return true;
    }

    const isWinningMove = (gameboardToCheck: Counter[][], counter: Counter, rowLastPlayed: number, columnLastPlayed: number): boolean => {
        const rowMinBound = Math.max(0, rowLastPlayed - winningContiguousCounters);
        const rowMaxBound = Math.min(rows - 1, rowLastPlayed + winningContiguousCounters);

        const colMinBound = Math.max(0, columnLastPlayed - winningContiguousCounters);
        const colMaxBound = Math.min(columns - 1, columnLastPlayed + winningContiguousCounters);

        let contiguousCounters = 0;
        let colCounter;

        // Check horizonal lines
        for (let column = colMinBound; column <= colMaxBound; column++) {
            contiguousCounters = gameboardToCheck[rowLastPlayed][column] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === winningContiguousCounters) return true;
        }

        // Check vertical lines
        contiguousCounters = 0;
        for (let row = rowMinBound; row <= rowMaxBound; row++) {
            contiguousCounters = gameboardToCheck[row][columnLastPlayed] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === winningContiguousCounters) return true;
        }

        // Check line like: \
        contiguousCounters = 0;
        colCounter = colMinBound;
        for (let row = Math.max(0, rowLastPlayed - columnLastPlayed); row <= rowMaxBound; row++) {
            contiguousCounters = gameboardToCheck[row][colCounter] === counter ? contiguousCounters + 1 : 0;
            if (contiguousCounters === winningContiguousCounters) return true;

            colCounter++;
        }

        // Checking a line like: /
        contiguousCounters = 0;
        colCounter = colMinBound;
        for (let row = rowMaxBound; row >= rowMinBound; row--) {
            contiguousCounters = gameboardToCheck[row][colCounter] === counter ? contiguousCounters + 1 : 0;

            if (contiguousCounters === winningContiguousCounters) return true;

            colCounter++;
        }

        return false;
    }

    return (
        <Container maxWidth='xl' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {winningPlayer && <Typography>{winningPlayer.username}({winningPlayer.counter}) has won!</Typography>}
            {!winningPlayer && <Typography>{currentPlayer.username}'s ({currentPlayer.counter}) turn!</Typography>}

            <Grid container columns={columns} sx={{ width: '95%', boxSizing: 'border-box' }}>
                {gameboard.map((rowGridItem, rowIndex) => rowGridItem.map((columnGridItem, columnIndex) => <ConnectFourGridItem key={`${rowIndex}${columnIndex}`} gridItem={columnGridItem} size={1} column={columnIndex} makeMove={makeMove} />))}
            </Grid>
        </Container>
    )
}

export default ConnectFourGrid;