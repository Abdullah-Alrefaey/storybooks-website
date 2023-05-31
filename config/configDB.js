require('dotenv').config();

// import mongoose (MongoDB Object Modeling) to connect to our mongoDB
const mongoose = require('mongoose');

const keys = require('./keys');

module.exports = async function connectDB() {
    try {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(keys.mongoURI, dbOptions);
        console.log(`Connected to DB successfully!!`);

    } catch (error) {
        console.log('Failed to Connect to DB!!!!!!', error);
    }
};