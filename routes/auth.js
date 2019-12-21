const express = require('express');
const router = express.Router();
const passport = require('passport');

// Auth router
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Callback router
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        // Successful authentication, redirect dashboard.
        res.redirect('/dashboard');
});

// Verify User
router.get('/verify', (req, res) => {
    if(req.user)
    {
        console.log(req.user);
    }
    else
    {
        console.log('Not Auth');
    }
});

// Logout User
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;