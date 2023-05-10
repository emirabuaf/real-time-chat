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
  sender: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  roomId: string;
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
      if (message.type === 'message') {
        const { roomId } = message;
        const isCurrentChat = roomId === getRoomId(currentUser!._id, selectedUser!._id);

        if (isCurrentChat) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      }
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
  }, [currentUser, selectedUser]);

  const getRoomId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join(':');
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (readyState === WebSocket.OPEN) {
      const roomId = getRoomId(currentUser!._id, selectedUser!._id);
      const message = {
        type: 'message',
        text: messageInput,
        senderId: currentUser?._id,
        receiverId: selectedUser?._id,
        roomId: roomId,
      };

      ws.current?.send(JSON.stringify(message));
      setMessageInput('');
    }
  };

  return (
    <Box className={classes.root} sx={{ border: '1px dashed grey', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">{selectedUser?.email}</Typography>
      <Box className={classes.messageContainer}>
        {messages
          .filter((message) => {
            const roomId = getRoomId(currentUser!._id, selectedUser!._id);
            return message.roomId === roomId;
          })
          .map((message, index) => (
            <Box key={index} className={classes.message}>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}></Typography>
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