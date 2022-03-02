import { Box, Button, CircularProgress, Typography } from "@mui/material";

interface ILobbyProps {
    username: string;
    cancelFindingGame: () => void;
}

const Lobby = ({ username, cancelFindingGame }: ILobbyProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h2'>{username}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '17.5em' }}>
                <Typography variant='h5'>Searching for a game</Typography>
                <CircularProgress />
            </Box>
            <Button variant='contained' onClick={cancelFindingGame}>Cancel</Button>
        </Box>
    )
}

export default Lobby;