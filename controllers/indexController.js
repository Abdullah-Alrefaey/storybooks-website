const Story = require('../models/Story');

const index = (req, res) => {
    res.render('index/welcome');
};

const index_dashboard = (req, res) => {
    // get all the stories
    Story.find({
        user: req.user.id
    })
    .then(stories => {
        res.render('index/dashboard', {
            stories: stories
        });
    });
};

const index_welcome = (req, res) => {
    res.render('index/about');
};

module.exports = {
    index,
    index_dashboard,
    index_welcome
}