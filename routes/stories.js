const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Stories Index
router.get('/', (req, res) => {
    // fetch the public stories only from the db to show it
    Story.find({
        status: 'public'
    })
    // This will populate the user with all its fields from the User Collection
    .populate('user')
    .sort({
        date: 'desc'
    })
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
        // if the story is public, just show it.
        if (story.status == 'public')
        {
            res.render('stories/show', {
                story: story
            });
        }
        // in case of a private story, we need some checks
        else
        {
            // check if user is logged in, check if he is the story owner
            if (req.user)
            {
                if (req.user.id == story.user._id)
                {
                    res.render('stories/show', {
                        story: story
                    });
                }
                else
                {
                    res.redirect('/stories');
                }
            }
            else
            {
                res.redirect('/stories');
            }
            
        }
        
    });
});

// List stories from a user
router.get('/user/:userId/', (req, res) => {
    Story.find({
        user: req.params.userId,
        status: 'public'
    })
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        })
    })
});

// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id
    })
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        })
    })
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        // we want to make sure that the logged user is the owner of story
        if (story.user != req.user.id)
        {
            res.redirect('/stories');
        }
        else
        {
            res.render('stories/edit', {
                story: story
            });
        }
        
    });
});

// Process Add Story
router.post('/', (req, res) => {
    let allowComments;

    if (req.body.allowComments)
    {
        allowComments = true;
    }
    else
    {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    // Create Story
    new Story(newStory)
    .save()
    .then(story => {
        res.redirect(`/stories/show/${story.id}`);
    })
});


// Edit Form Process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        let allowComments;

        if (req.body.allowComments)
        {
            allowComments = true;
        }
        else
        {
            allowComments = false;
        }

        // New values
        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComments = allowComments;

        story.save()
        .then(story => {
            res.redirect('/dashboard');
        });
    });
});

// Delete story
router.delete('/:id', (req, res) => {
    Story.remove({
        _id: req.params.id
    })
    .then(() => {
        res.redirect('/dashboard');
    });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }

        // add to comments array
        // unshift adds to the beginning
        story.comments.unshift(newComment);

        story.save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        })
    })
})


module.exports = router;