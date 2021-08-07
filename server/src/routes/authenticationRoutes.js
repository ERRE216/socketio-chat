const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express();

//Models
const User = require('../model/userSchema');

router.get('/', (req, res) => {
  res.redirect('login');
});

router.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chat.html'));
});

router
  .route('/register')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
  })
  .post(async (req, res) => {
    const { username, password, email } = req.body;

    //Validation
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.json({ msg: 'User Already exist with this email.' });

    //Salt and Hash password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name: username, password: hashPassword, email });

    try {
      await newUser.save();
    } catch (error) {
      console.log(error);
    }

    res.redirect('/login');
  });

router
  .route('/login')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  })
  .post((req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.cookie('username', username, { sameSite: true }).redirect('/chat');
  });
module.exports = router;
