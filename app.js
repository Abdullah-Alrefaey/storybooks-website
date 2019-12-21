const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 5000;
app = express();

// Load User Model
require('./models/User');

// Load Keys
const keys = require('./config/keys');

// Passport Config
require('./config/passport')(passport);

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
})

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout:'main'
 }));
app.set('view engine', 'handlebars');

// Cookie Parser
app.use(cookieParser());

// Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global Variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/', index);
app.use('/auth', auth);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});