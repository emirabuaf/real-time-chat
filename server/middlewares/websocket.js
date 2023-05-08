const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const Message = require('../models/message.model');
const mongoose = require('mongoose');

let wss;
let activeConnections = new Map();

exports.init = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const cookies = cookie.parse(req.headers.cookie || '');

    const token = cookies.token;

    if (!token) {
      ws.close(4001, 'Unauthorized');
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        ws.close(4001, 'Unauthorized');
        return;
      }

      console.log(`Client connected with user ID ${decodedToken.id}`);

      ws.on('message', async (message) => {
        console.log(`Received message: ${message}`);
        const data = JSON.parse(message);
        const { type, text, senderId, receiverId } = data;

        if (type === 'message') {
          const roomId = [senderId, receiverId].sort().join(':');
          activeConnections.set(ws, decodedToken.id);

          const otherWs = [...activeConnections.entries()]
            .find(([ws, userId]) => ws !== ws && userId === receiverId)?.[0];

          if (otherWs) {
            otherWs.send(JSON.stringify({
              ...data,
              sender: decodedToken.id,
            }));
          }

          const roomName = [senderId, receiverId].sort().join('_');
          const newMessage = new Message({ text, sender: senderId, receiver: receiverId });
          await newMessage.save();

          const messageCollection = mongoose.connection.collection(roomName);
          await messageCollection.insertOne(newMessage);
          console.log('New message saved to database');
        }
      });

      ws.on('close', () => {
        activeConnections.delete(ws);
        console.log(`Client disconnected with user ID ${decodedToken.id}`);
      });
    });
  });
};