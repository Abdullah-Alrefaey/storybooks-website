const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../middlewares/auth');
const indexController = require('../controllers/indexController');

router.get('/', ensureGuest, indexController.index);
router.get('/dashboard', ensureAuthenticated, indexController.index_dashboard);
router.get('/about', indexController.index_welcome);

module.exports = router;



// Route to the Welcome Page
// we don't need the user to go back to the welcome page if he is logged in.
// router.get('/', ensureGuest, (req, res) => {
//     res.render('index/welcome');
// });

// Dashboard Route
// router.get('/dashboard', ensureAuthenticated, (req, res) => {
//     // get all the stories
//     Story.find({
//         user: req.user.id
//     })
//     .then(stories => {
//         res.render('index/dashboard', {
//             stories: stories
//         });
//     });
// });

// About Route
// router.get('/about', (req, res) => {
//     res.render('index/about');
// })
