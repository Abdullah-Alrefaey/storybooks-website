// This file is used to help us to restrict routes
// we need to make sure if the user is authenticated or not. (used as a middleware)
const ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
    {
        return next();
    }
    else
    {
        res.redirect('/');
    }
}

const ensureGuest = function (req, res, next) {
    if (req.isAuthenticated())
    {
        res.redirect('/dashboard')
    }
    else
    {
        return next();
    }
}

module.exports = {
    ensureAuthenticated,
    ensureGuest
}