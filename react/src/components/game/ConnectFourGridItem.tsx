import { Button, Grid, Typography } from "@mui/material";
import { Counter } from "../../type/Counter";

interface IConnectFourGridItemProps {
    gridItem: Counter;
    size: number;
    column: number;
    addCounter: (counter: Counter, column: number) => void;
    currentPlayer: Counter;
}

const ConnectFourGridItem = ({ gridItem, size, column, addCounter, currentPlayer }: IConnectFourGridItemProps) => {
    const handleColumnClick = () => addCounter(currentPlayer, column);

    return (
        <Grid item xs={size} sx={{ backgroundColor: 'blue', height: '', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <Button onClick={handleColumnClick}>
                <Typography fontSize='6em'>{gridItem}</Typography>
            </Button>
        </Grid>
    )
}

export default ConnectFourGridItem;