// This router is used to handle auth routes (google routes)

const express = require('express');
const router = express.Router();
const passport = require('passport');

// Auth router
// Scope is the permissions that we ask the user to share when we authenticate
router.get('/google', passport.authenticate('google',
    {scope: ['profile', 'email']}));

// Callback router
// Google Auth redirect the browser to this page automatically after logging in
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
    req.logout(() => {
        console.log("logged out!");
    });
    res.redirect('/');
})

module.exports = router;