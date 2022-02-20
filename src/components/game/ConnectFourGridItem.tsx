import { Grid, Typography } from "@mui/material";
import { GridItem } from "../../type/GridItem";

interface IConnectFourGridItemProps {
    gridItem: GridItem;
    size: number;
}

const ConnectFourGridItem = ({ gridItem, size }: IConnectFourGridItemProps) => {
    return (
        <Grid item xs={size} sx={{backgroundColor: 'blue', height: '', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box'}}>
            <Typography fontSize='6em'>{gridItem}</Typography>
        </Grid>
    )
}

export default ConnectFourGridItem;