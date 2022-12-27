import { Button, Grid, GridSize, Typography } from "@mui/material";
import { Counter } from "../../type/Counter";

interface IConnectFourGridItemProps {
    gridItem: Counter;
    size: GridSize;
    column: number;
    row: number;
    makeMove: (column: number) => void;
}

const ConnectFourGridItem = ({ gridItem, size, column, row, makeMove }: IConnectFourGridItemProps) => {
    const handleColumnClick = () => makeMove(column);

    return (
        <Grid item xs={size} sx={{ zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button aria-label={`${row.toString()}:${column.toString()}`} onClick={handleColumnClick}>
                <Typography fontSize='8vmin' sx={{ textShadow: '0px 4px 4px #1F1F1F', transition: 'margin 200ms'}}>{gridItem}</Typography>
            </Button>
        </Grid>
    )
}

export default ConnectFourGridItem;