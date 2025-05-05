const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  
  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.json({ success: true, message: 'Login successful' });
});

module.exports = router;

