import { Button } from "@mui/material";
import { Box } from "@mui/system";
import UsernameInput from "./UsernameInput";

interface IPreLobbyProps {
    username: string | undefined;
    setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
    onStartClick: () => void;
}

const PreLobby = ({ username, setUsername, onStartClick }: IPreLobbyProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
            <UsernameInput username={username} setUsername={setUsername} />
            <Button variant='contained' onClick={onStartClick}>Find Game</Button>
        </Box>
    )
}

export default PreLobby;