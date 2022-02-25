import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Counter } from "../../type/Counter";
import ConnectFourGridItem from "./ConnectFourGridItem";

interface ConnectFourGridProps {
    gameboard: Counter[][];
    makeMove: (column: number) => void;
}

const ConnectFourGrid = ({ gameboard, makeMove }: ConnectFourGridProps) => {

    const getConnectForGridItems = () => {
        return gameboard.map((rowGridItem, rowIndex) => rowGridItem.map((columnGridItem, columnIndex) => (
            <ConnectFourGridItem key={`${rowIndex}${columnIndex}`}
                gridItem={columnGridItem}
                size={1}
                row={rowIndex}
                column={columnIndex}
                makeMove={makeMove}
            />
        )));
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Grid container columns={gameboard[0].length} sx={{ zIndex: 1, background: 'radial-gradient(circle, rgba(42,42,242,1) 83%, rgba(42,42,242,1) 98%, rgba(0,168,255,1) 100%, rgba(2,0,36,1) 100%, rgba(2,0,36,1) 100%, rgba(0,212,255,1) 100%)', width: '95%', boxShadow: '-5px 7px 25px 2px rgba(0,0,0,0.75)' }}>
                {getConnectForGridItems()}
            </Grid>

            <div style={{ backgroundColor: 'blue', border: '1px solid black', width: '97%', height: '3.5em', transform: 'skew(29deg, 0deg' }}>
                <Typography variant='h3' textAlign='center'><span style={{ WebkitTextStroke: '50px solid black', color: 'red' }}>Connect</span> <span style={{ color: 'yellow' }}>Four</span></Typography>
            </div>
        </Box>
    )
}

export default ConnectFourGrid;