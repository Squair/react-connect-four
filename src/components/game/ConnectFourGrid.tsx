import { Grid } from "@mui/material";
import { useState } from "react";
import { GridItem } from "../../type/GridItem";
import ConnectFourGridItem from "./ConnectFourGridItem";

interface ConnectFourGridProps {
    gridX: number;
    gridY: number;
}

const ConnectFourGrid = ({ gridX, gridY }: ConnectFourGridProps) => {
    const initaliseGrid = (xBounds: number, yBounds: number) => {
        const emptyGrid: GridItem[][] = [];

        for (let x = 0; x < xBounds; x++) {
            emptyGrid[x] = [];
            for (let y = 0; y < yBounds; y++) {
                emptyGrid[x][y] = '⚪';
            }
        }

        return emptyGrid;
    }

    const foo: GridItem[][] = [
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴'],
        ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🟡'],
    ]

    //const [grid, setGrid] = useState<GridItem[][]>(initaliseGrid(gridX, gridY));
    const [grid, setGrid] = useState<GridItem[][]>(foo);

    return (
        <Grid container columns={gridX} sx={{width: '75%', boxSizing: 'border-box'}}>
            {grid.map(xAxis => xAxis.map(gridItem => <ConnectFourGridItem gridItem={gridItem} size={1} />))}
        </Grid>
    )
}

export default ConnectFourGrid;