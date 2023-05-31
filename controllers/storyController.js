const Story = require('../models/Story');
const { validationResult, checkSchema } = require('express-validator');

// These function names are like MDN convention
// story_index, story_details, story_create_get, story_create_post, story_delete

/*
  * Fetch all the public stories from the database then render the story index page
  * @param {Object} req - the request object sent from the browser to the server
  * @param {Object} res - the response object sent from the server to the browser
  * @return {}          - render the story index page with all the retrieved stories
 */

const story_index = (req, res) => {
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
};

const story_show = (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
        // if the story is public, just show it.
        if (story.status === 'public')
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
                if (req.user.id === story.user.id)
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
};

const story_user_list = (req, res) => {
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
};

const story_my_list = (req, res) => {
    Story.find({
        user: req.user.id
    })
    .populate('user')
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        })
    })
};

const story_add_get = (req, res) => {
    res.render('stories/add');
};

const story_add_post = async (req, res, next) => {
    // if (req.body.allowComments)
    // {
    //     allowComments = true;
    // }
    // else
    // {
    //     allowComments = false;
    // }

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        let allowComments = !!req.body.allowComments;

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
    }
    catch (err) {
        next(err);
    }
};

const story_edit_get = (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(story => {
        // we want to make sure that the logged user is the owner of story
        if (story.user.id !== req.user.id)
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
};

const story_edit_put = (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        let allowComments = !!req.body.allowComments;

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
};

const story_delete = (req, res) => {
    Story.remove({
        _id: req.params.id
    })
    .then(() => {
        res.redirect('/dashboard');
    });
};

const story_comment_post = (req, res, next) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

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
    } catch (err) {
        next(err);
    }
};

module.exports = {
    story_index,
    story_show,
    story_user_list,
    story_my_list,
    story_add_get,
    story_add_post,
    story_edit_get,
    story_edit_put,
    story_delete,
    story_comment_post,
}