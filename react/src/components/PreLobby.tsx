import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IGameboardSize } from "../interface/IGameboardSize";
import BoardSizeSelector from "./BoardSizeSelector";
import UsernameInput from "./UsernameInput";

interface IPreLobbyProps {
    gameboardSize: IGameboardSize;
    setGameboardSize: React.Dispatch<React.SetStateAction<IGameboardSize>>;
    username: string | undefined;
    setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
    onStartClick: () => void;
}

const PreLobby = ({ gameboardSize, setGameboardSize, username, setUsername, onStartClick }: IPreLobbyProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 'fit-content' }}>
            <Typography textAlign='left' variant='h2'>Connect Four 🔴🟡</Typography>

            <UsernameInput username={username} setUsername={setUsername} />

            <hr style={{width: '100%'}} />

            <Typography variant='caption' textAlign='center'>Rows x Columns</Typography>
            <BoardSizeSelector gameboardSize={gameboardSize} setGameboardSize={setGameboardSize} />

            <hr style={{width: '100%'}} />

            <Button variant='contained' onClick={onStartClick}>Find Game</Button>
        </Box>
    )
}

export default PreLobby;