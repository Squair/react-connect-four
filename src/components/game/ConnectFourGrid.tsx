import { Grid } from "@mui/material";
import { useState } from "react";
import { Counter } from "../../type/GridItem";
import ConnectFourGridItem from "./ConnectFourGridItem";

interface ConnectFourGridProps {
    columns: number;
    rows: number;
}

const ConnectFourGrid = ({ columns, rows }: ConnectFourGridProps) => {
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
    //const [grid, setGrid] = useState<Counter[][]>(foo);

    const addCounter = (counter: Counter, column: number) => {        
        const gridCopy = [...grid];
        
        //Start at the bottom of the grid and loop backwards as connect four pieces drop down to the bottom
        for (let row = rows - 1; row >= 0; row--) {            
            if (gridCopy[row][column] === '⚪') {
                gridCopy[row][column] = counter;
                break;
            }
        }
        setGrid(gridCopy);
    }

    return (
        <Grid container columns={columns} sx={{ width: '75%', boxSizing: 'border-box' }}>
            {grid.map((rowGridItem, rowIndex) => rowGridItem.map((columnGridItem, columnIndex) => <ConnectFourGridItem key={`${rowIndex}${columnIndex}`} gridItem={columnGridItem} size={1} column={columnIndex} addCounter={addCounter} />))}
        </Grid>
    )
}

export default ConnectFourGrid;