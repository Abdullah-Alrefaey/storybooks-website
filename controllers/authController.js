const passport = require('passport');

const auth_google = passport.authenticate('google',
        {scope: ['profile', 'email']},
        ()=>{});

const auth_google_callback =
    passport.authenticate('google',
        { failureRedirect: '/', failureMessage: true },
    );

// const auth_google_callback =
//     passport.authenticate('google',
//         { failureRedirect: '/', failureMessage: true },
//         (req, res) => {
//             // auth_google_callback_redirect()
//             res.redirect('/dashboard');
//         }
//     );

const auth_google_callback_redirect = (req, res) => {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
};

const auth_verify = (req, res) => {
    // if we are authenticated we should have access to req.user
    if(req.user)
    {
        console.log(req.user);
    }
    else
    {
        console.log('Not Auth');
    }
};

const auth_logout = (req, res) => {
    req.logout(() => {
        console.log("logged out!");
    });
    res.redirect('/');
};

module.exports = {
    auth_google,
    auth_google_callback,
    auth_google_callback_redirect,
    auth_verify,
    auth_logout

}


// const auth_google = (req, res, next) => {
//     passport.authenticate('google',
//         {scope: ['profile', 'email']},
//         ()=>{}) (req, res, next);
// };
//
// const auth_google_callback = (req, res, next) => {
//     passport.authenticate('google',
//         { failureRedirect: '/', failureMessage: true },
//     ) (req, res, next);
// };