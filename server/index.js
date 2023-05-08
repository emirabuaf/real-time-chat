require('./models/db');

const { authenticateToken } = require('./middlewares/authMiddleware');
const webSocket = require('./middlewares/websocket');


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const messageController = require('./controllers/messageController');

const app = express();
const server = http.createServer(app);


webSocket.init(server); // Call the init function to start the WebSocket servr

// Load environment variables
dotenv.config();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up auth and user routes
app.use('/auth', authController);
app.get('/users', authenticateToken, userController.fetchUsers, (req, res) => {
  res.send({ users: res.locals.users, currentUser: res.locals.currentUser });
});

// Serve React app
app.use(express.static(path.join(__dirname, '../client/public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

// Set up messages routes
app.get('/messages', authenticateToken, messageController.fetchMessages);
app.post('/messages', authenticateToken, messageController.saveMessage);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));