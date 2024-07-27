const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const router = express.Router();


// Sign Up
router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
  
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
  
      await user.save();
  
      // Generate a token
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SCRET, { expiresIn: '1h' });
  
      res.status(201).json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SCRET, { expiresIn: '1h' });

        res.json({ token }); // Send token or any other response
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
