const express = require('express')
const jwt = require('jsonwebtoken');
var router = express.Router()
const mongoose = require('mongoose')

const User = mongoose.model('User')


// Login API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      // User not found
      return res.status(401).send({ success: false, message: 'Invalid email or password' });
    }

    // User found, check password
    const passwordString = password.toString();
    const isMatch = await user.checkPassword(passwordString);

    if (!isMatch) {
      // Password does not match
      return res.status(401).send({ success: false, message: 'Invalid email or password' });
    }

    // Login successful, generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).send({ success: true, message: 'Login successful', token });
  } catch (err) {
    // Error occurred
    console.log(err);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
});

// Signup API
router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = new User({
      email: email,
      password: password
    });
    // Save the new user to the database
    user.save()
      .then(() => {
        // Signup successful
        res.status(200).send({ success: true, message: 'Signup successful' });
      })
      .catch((err) => {
        // Error while saving user
        res.status(500).send({ success: false, message: 'Internal server error' });
      });
  } else {
    // Signup failed
    res.status(400).send({ success: false, message: 'Invalid email or password' });
  }
});


module.exports = router