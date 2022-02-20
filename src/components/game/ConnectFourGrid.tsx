import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Counter } from "../../type/GridItem";
import ConnectFourGridItem from "./ConnectFourGridItem";

interface ConnectFourGridProps {
    columns: number;
    rows: number;
    winningContiguousCounters: number;
}

const ConnectFourGrid = ({ columns, rows, winningContiguousCounters }: ConnectFourGridProps) => {
    const initaliseGrid = (cols: number, rows: number) => {
        const emptyGrid: Counter[][] = [];

        for (let row = 0; row < rows; row++) {
            emptyGrid[row] = new Array<Counter>(columns).fill('⚪');
        }

        return emptyGrid;
    }

    const foo: Counter[][] = [
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🟡'],
    ]

    const [grid, setGrid] = useState<Counter[][]>(initaliseGrid(columns, rows));
    const [counterWon, setCounterWon] = useState<Counter>();
    const [currentPlayer, setCurrentPlayer] = useState<Counter>('🔴');
    //const [grid, setGrid] = useState<Counter[][]>(foo);

    useEffect(() => {
        if (currentPlayer === '🔴') return setCurrentPlayer('🟡');

        return setCurrentPlayer('🔴');
    }, [grid])

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

    return (
        <>
            <Grid container columns={columns} sx={{ width: '75%', boxSizing: 'border-box' }}>
                {grid.map((rowGridItem, rowIndex) => rowGridItem.map((columnGridItem, columnIndex) => <ConnectFourGridItem key={`${rowIndex}${columnIndex}`} gridItem={columnGridItem} size={1} column={columnIndex} addCounter={addCounter} currentPlayer={currentPlayer} />))}
            </Grid>
            {counterWon && <Typography>{counterWon} has won!</Typography>}
        </>
    )
}

export default ConnectFourGrid;