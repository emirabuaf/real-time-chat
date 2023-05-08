const Message = require('../models/message.model');

exports.fetchMessages = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .send({ success: false, message: 'Missing required query parameters' });
    }
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).populate('sender', 'username').populate('receiver', 'username');

    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

exports.saveMessage = async (req, res, next) => {
  try {
    const { text, sender, receiver } = req.body;
    const message = await Message.create({
      text: text,
      sender: sender,
      receiver: receiver,
    });
    res.status(201).send({ success: true, message: message });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};