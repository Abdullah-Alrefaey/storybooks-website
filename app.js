const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Used to handle google oauth
const passport = require('passport');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');

// Used to set up port number either in dev or production mode
const port = process.env.PORT || 5000;

app = express();

// Import function exported by newly installed node modules.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

// Load User Model
require('./models/User');
require('./models/Story');

// Load Keys
const keys = require('./config/keys');

// Passport Configuration
require('./config/passport')(passport);

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Handlebars Helpers
const { truncate, 
        stripTags, 
        formatDate, 
        select, 
        editIcon } = require('./helpers/hbs');
const handlebars = require('handlebars');

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
})

// body-parser Setup 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout:'main',
    // ...implement newly added insecure prototype access
    handlebars: allowInsecurePrototypeAccess(handlebars)
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

// Set Static Folders
// app.use(express.static(path.join(__dirname, 'public')));
// Using Static Middleware to allow the browser to view the static files (css, images, etc.)
app.use(express.static('public'));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

// Listen the app to the given port
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});