import { Button, Grid, Typography } from "@mui/material";
import { Counter } from "../../type/Counter";

interface IConnectFourGridItemProps {
    gridItem: Counter;
    size: number;
    column: number;
    makeMove: (counter: Counter, column: number) => void;
    currentPlayer: Counter;
}

const ConnectFourGridItem = ({ gridItem, size, column, makeMove, currentPlayer }: IConnectFourGridItemProps) => {
    const handleColumnClick = () => makeMove(currentPlayer, column);

    return (
        <Grid item xs={size} sx={{ backgroundColor: 'blue', height: '', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <Button onClick={handleColumnClick}>
                <Typography fontSize='6em'>{gridItem}</Typography>
            </Button>
        </Grid>
    )
}

export default ConnectFourGridItem;