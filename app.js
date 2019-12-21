const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const port = process.env.PORT || 5000;

// Passport Config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth')
app = express();

app.get('/', (req, res) => {
    res.send('Test');
})

// Use Routes
app.use('/auth', auth);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});