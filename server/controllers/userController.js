const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

exports.fetchUsers = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    const users = await User.find({ _id: { $ne: currentUser._id } });

    res.locals.users = users;
    res.locals.currentUser = { ...currentUser.toObject(), isCurrent: true };
    next();
  } catch (err) {
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};