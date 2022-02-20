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
        <Grid item xs={size} sx={{ zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={handleColumnClick}>
                <Typography fontSize='8vmin' sx={{ textShadow: '0px 4px 4px #1F1F1F', transition: 'margin 200ms'}}>{gridItem}</Typography>
            </Button>
        </Grid>
    )
}

export default ConnectFourGridItem;