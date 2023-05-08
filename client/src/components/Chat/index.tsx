import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { User } from "../../@types/user";


interface ChatProps {
  selectedUser: null | User;
  currentUser: null | User;
}

interface Message {
  _id: string;
  text: string;
  sender: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

const useStyles = makeStyles({
  root: {
    backgroundColor: '#FFF',
    height: 'calc(100vh - 80px)',
    position: 'relative',
  },
  input: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
  },
  messageContainer: {
    overflowY: 'scroll',
    maxHeight: 'calc(100vh - 200px)',
  },
  message: {
    margin: '5px 0',
    padding: '5px',
    backgroundColor: '#F0F0F0',
    borderRadius: '5px',
  },
});

const Chat = ({ selectedUser, currentUser }: ChatProps) => {
  const classes = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setReadyState(ws.current ? ws.current.readyState : WebSocket.CLOSED);
    };

    ws.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
      setReadyState(WebSocket.CLOSED);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        text: messageInput,
        senderId: currentUser?._id,
        receiverId: selectedUser?._id,
      };
      ws.current?.send(JSON.stringify(message));
      setMessageInput('');
    }
  };


  console.log(messages)


  return (
    <Box className={classes.root} sx={{ border: '1px dashed grey', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">{selectedUser?.email}</Typography>
      <Box className={classes.messageContainer}>
        {messages.map((message) => (
          <Box key={message._id} className={classes.message}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{message.sender.username}</Typography>
            <Typography variant="body1">{message.text}</Typography>
          </Box>
        ))}
      </Box>
      <form onSubmit={handleSendMessage}>
        <TextField
          className={classes.input}
          label="Type a message"
          variant="outlined"
          size="small"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ m: 1 }}>Send</Button>
      </form>
    </Box>
  );
};

export default Chat;