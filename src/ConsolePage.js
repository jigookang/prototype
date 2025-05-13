import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

function ChatConsole() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input.trim();
    let result = '';

    try {
      if (command === 'help') {
        result = '사용 가능한 명령어:\n- help: 도움말 표시\n- clear: 화면 지우기\n- echo [text]: 텍스트 출력';
      } else if (command === 'clear') {
        setOutput([]);
        setInput('');
        return;
      } else if (command.startsWith('echo ')) {
        result = command.slice(5);
      } else {
        result = `알 수 없는 명령어: ${command}`;
      }
    } catch (error) {
      result = `오류 발생: ${error.message}`;
    }

    setOutput([...output, { type: 'input', text: command }, { type: 'output', text: result }]);
    setInput('');
  };

  return (
    <>
      <IconButton 
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          bgcolor: '#4CAF50',
          color: 'white',
          '&:hover': {
            bgcolor: '#45a049',
          },
          width: 56,
          height: 56,
        }}
      >
        <ChatIcon />
      </IconButton>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>콘솔 대화</DialogTitle>
        <DialogContent>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              bgcolor: '#1e1e1e', 
              color: '#fff',
              fontFamily: 'monospace',
              height: '300px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              mb: 2,
              '& > div': { mb: 1 }
            }}>
              {output.map((item, index) => (
                <Box key={index} sx={{ 
                  color: item.type === 'input' ? '#4CAF50' : '#fff',
                  '&::before': {
                    content: item.type === 'input' ? '"$ "' : '""',
                    color: '#4CAF50'
                  }
                }}>
                  {item.text}
                </Box>
              ))}
            </Box>
            <form onSubmit={handleCommand} style={{ display: 'flex', gap: '8px' }}>
              <TextField
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="명령어를 입력하세요..."
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#666' },
                    '&.Mui-focused fieldset': { borderColor: '#4CAF50' }
                  }
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="small"
                sx={{ 
                  bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#45a049' }
                }}
              >
                실행
              </Button>
            </form>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChatConsole; 