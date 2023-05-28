// Import mongoose library (ODM) to create the model and the schema
const mongoose = require('mongoose');

// The Schema defines the structure of a type of data / document
// - properties & property types.
const Schema = mongoose.Schema;

// Create User Schema
const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    comments: [{
        commentBody: {
            type: String,
            require: true
        },
        commentDate: {
            type: Date,
            default: Date.now()
        },
        commentUser: {
            type: Schema.Types.ObjectId,
            // ref: 'users'
            ref: 'User'
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        // ref: 'users'
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

// Create collection and add schema
// create a model based on the Schema we defined. (The model wraps around the Schema)
// The model allows us to communicate with a particular database collection via an interface
// The model has both static and instance methods which we can use to save, update, delete, read, etc.

// Create collection and add schema
// mongoose.model('stories', StorySchema, 'stories');

const Story = mongoose.model('stories', StorySchema, 'stories');

module.exports = Story;

