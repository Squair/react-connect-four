import { TextField } from "@mui/material";

interface IUsernameInput {
    username: string | undefined;
    setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const UsernameInput = ({ username, setUsername }: IUsernameInput) => {
    const onUsernameChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setUsername(e.target.value);
    return <TextField value={username ?? ''} onChange={onUsernameChange} placeholder='Enter username...' />
}

export default UsernameInput;