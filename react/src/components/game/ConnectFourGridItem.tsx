import { Button, Grid, Typography } from "@mui/material";
import { Counter } from "../../type/Counter";

interface IConnectFourGridItemProps {
    gridItem: Counter;
    size: number;
    column: number;
    makeMove: (column: number) => void;
}

const ConnectFourGridItem = ({ gridItem, size, column, makeMove }: IConnectFourGridItemProps) => {
    const handleColumnClick = () => makeMove(column);

    return (
        <Grid item xs={size} sx={{ backgroundColor: 'blue', height: '', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
            <Button onClick={handleColumnClick}>
                <Typography fontSize='6em'>{gridItem}</Typography>
            </Button>
        </Grid>
    )
}

export default ConnectFourGridItem;