// This file is used to handle passport configurations and authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');

// Load user model
const User = require('../models/User');

module.exports = function (passport)
{
    // define the strategy
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true // when we deploy an application it will use https
        }, (accessToken, refreshToken, profile, done) => {
            // the callback function gives us some information
            // console.log(accessToken);
            // console.log(profile);
            // const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

            // add the new user to db
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            }

            // Check for existing user
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if(user)
                {
                    // done is a callback for any strategy (1st is error, we don't have error, so we pass null)
                    // Return User
                    done(null, user);
                }
                else
                {
                    // Create User 
                    new User(newUser)
                    .save()
                    .then(user => {
                        done(null, user);
                    });
                }
            })
        })
    );

    // we need to add these
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            done(null, user);
        });
    });
}