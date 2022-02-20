import { Box, Button, Container } from '@mui/material';
import React, { useState } from 'react';
import './App.css';
import UsernameInput from './components/UsernameInput';

const App = () => {
  const [username, setUsername] = useState<string>();

  const onStartClick = () => {
    // Emit to socket.io, join queue
  }

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
        <UsernameInput username={username} setUsername={setUsername} />
        <Button variant='contained' onClick={onStartClick}>Find Game</Button>
      </Box>
    </div>
  );
}

export default App;
