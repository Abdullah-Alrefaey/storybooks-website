const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;

app = express();


app.get('/', (req, res) => {
    res.send('Test');
})

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});