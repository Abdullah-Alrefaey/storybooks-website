// Import mongoose library (ODM) to create the model and the schema
const mongoose = require('mongoose');

// The Schema defines the structure of a type of data / document
// - properties & property types.
const Schema = mongoose.Schema;

// Create User Schema
const UserSchema = new Schema({
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

// Create collection and add schema
// create a model based on the Schema we defined. (The model wraps around the Schema)
// The model allows us to communicate with a particular database collection via an interface
// The model has both static and instance methods which we can use to save, update, delete, read, etc.
// mongoose.model('users', UserSchema);
const User = mongoose.model('User', UserSchema);

// Export the User module to use in other files
module.exports = User;