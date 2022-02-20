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
    const initializeGrid = (cols: number, rows: number) => {
        const emptyGrid: Counter[][] = [];

        for (let row = 0; row < rows; row++) {
            emptyGrid[row] = new Array<Counter>(columns).fill('⚪');
        }

        return emptyGrid;
    }

    const [grid, setGrid] = useState<Counter[][]>(initializeGrid(columns, rows));
    const [counterWon, setCounterWon] = useState<Counter>();

    const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(game.firstPlayerToMove);

    useEffect(() => {
        socket.on("recieve move", (move: IMove) => {
            addCounter(move.counter, move.column);
            setCurrentPlayer(game.players.filter(x => x.id === move.opposingPlayerId)[0]);
        });
    }, [socket]);

    const makeMove = (column: number) => {
        if (counterWon) return;

        // Only allow users to make moves when its their turn.
        if (socket.id !== currentPlayer.id) return;

        const counter = currentPlayer.counter;

        addCounter(counter, column);

        const opposingPlayerId = game.players.filter(x => x.id !== socket.id)[0].id;
        const move: IMove = { opposingPlayerId, counter, column };
        socket.emit("send move", move);
        setCurrentPlayer(game.players.filter(x => x.id === move.opposingPlayerId)[0]);
    }

    const addCounter = (counter: Counter, column: number) => {
        const gridCopy = [...grid];

        //Start at the bottom of the grid and loop backwards as connect four pieces drop down to the bottom
        for (let row = rows - 1; row >= 0; row--) {
            if (gridCopy[row][column] === '⚪') {
                gridCopy[row][column] = counter;

                if (hasCounterWon(gridCopy, counter, row, column)) setCounterWon(counter);

                break;
            }
        }

        setGrid(gridCopy);
    }

    const hasCounterWon = (gameboardToCheck: Counter[][], counter: Counter, rowLastPlayed: number, columnLastPlayed: number): boolean => {
        const rowMinBound = Math.max(0, rowLastPlayed - winningContiguousCounters);
        const rowMaxBound = Math.min(rows - 1, rowLastPlayed + winningContiguousCounters);

        const colMinBound = Math.max(0, columnLastPlayed - winningContiguousCounters);
        const colMaxBound = Math.min(columns - 1, columnLastPlayed + winningContiguousCounters);

        let contigousCounters = 0;
        let colCounter;

        // Check horizonal lines
        for (let column = colMinBound; column <= colMaxBound; column++) {
            contigousCounters = gameboardToCheck[rowLastPlayed][column] === counter ? contigousCounters + 1 : 0;
            if (contigousCounters === winningContiguousCounters) return true;
        }

        // Check vertical lines
        contigousCounters = 0;
        for (let row = rowMinBound; row <= rowMaxBound; row++) {
            contigousCounters = gameboardToCheck[row][columnLastPlayed] === counter ? contigousCounters + 1 : 0;
            if (contigousCounters === winningContiguousCounters) return true;
        }

        // Check line like: \
        contigousCounters = 0;
        colCounter = colMinBound;
        for (let row = Math.max(0, rowLastPlayed - columnLastPlayed); row <= rowMaxBound; row++) {
            contigousCounters = gameboardToCheck[row][colCounter] === counter ? contigousCounters + 1 : 0;
            if (contigousCounters === winningContiguousCounters) return true;

            colCounter++;
        }

        // Checking a line like: /
        contigousCounters = 0;
        colCounter = colMinBound;
        for (let row = rowMaxBound; row >= rowMinBound; row--) {
            contigousCounters = gameboardToCheck[row][colCounter] === counter ? contigousCounters + 1 : 0;

            if (contigousCounters === winningContiguousCounters) return true;

            colCounter++;
        }

        return false;
    }

    const firstMoveMade = grid.some(x => x.some(i => i !== '⚪'));

    return (
        <Container maxWidth='xl' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {counterWon && <Typography>{counterWon} has won!</Typography>}
            {!firstMoveMade && <Typography>{game.firstPlayerToMove.username} goes first!</Typography>}

            <Grid container columns={columns} sx={{ width: '75%', boxSizing: 'border-box' }}>
                {grid.map((rowGridItem, rowIndex) => rowGridItem.map((columnGridItem, columnIndex) => <ConnectFourGridItem key={`${rowIndex}${columnIndex}`} gridItem={columnGridItem} size={1} column={columnIndex} makeMove={makeMove} />))}
            </Grid>
        </Container>
    )
}

export default ConnectFourGrid;