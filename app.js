const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Used to get info from the browser
// calling body-parser to handle the Request Object from POST requests
const bodyParser = require('body-parser');

// This allows us to make put and delete requests from simple HTML forms
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

// TODO: remove this and refactor models export function
// Load User Model
require('./models/User');
require('./models/Story');

// Load Keys for Mongo Connection
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

// Mongoose Connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
})

// TODO: Refactor this with the updated express.urlencoded
// body-parser Setup
// to get access to (req.body, req.title, req.status, etc.)
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
// body parser for html post form
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json, basically parse incoming Request Object as a JSON Object
// body parser for post request
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

// Cookie Parser Middleware
app.use(cookieParser());

// Session Middleware
// must be above passport middleware because passport uses session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
// Need to initialize passport and for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

// Set global Variables
// We need to access user variable in other files so we can handle views correctly
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Set Static Folders
// app.use(express.static(path.join(__dirname, 'public')));
// Using Static Middleware to allow the browser to view the static files (css, images, etc.)
app.use(express.static('public'));

// Use Routes
// auth routes needs to be below the middlewares of passport and session
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

// Listen the app to the given port
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});