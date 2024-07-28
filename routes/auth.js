const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { OAuth2Client } = require('google-auth-library');
const authenticateToken = require('../middlewares/authenticator')


const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT
const client = new OAuth2Client(CLIENT_ID);


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

//google login

router.post ('/google', async (req,res)=>{
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email } = payload;
    
        if (email) {
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }
    
          // Generate JWT token
          const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SCRET, { expiresIn: '1h' });
    
          res.status(200).json({ token: jwtToken });
        }
      } catch (error) {
        res.status(401).json({ message: 'Authentication failed', error });
      }
})

//google sign up
router.post ('/google/signup', async (req,res)=>{
  const { token } = req.body;
  try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, given_name, family_name } = payload;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      //random 
    const placeholderPassword = 'random-placeholder-password';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(placeholderPassword, salt);

    user = new User({
      email,
      password: hashedPassword,
      firstName: given_name,
      lastName: family_name,
    });
  
      await user.save();
  
      // Generate a token
      const payloads = { userId: user.id };
      const jwttoken = jwt.sign(payloads, process.env.JWT_SCRET, { expiresIn: '1h' });
  
      res.status(201).json({ jwttoken });
  
     
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed', error });
    }
})

module.exports = router;
