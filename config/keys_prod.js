const randomUUID = require('crypto').randomUUID;

module.exports = {
    mongoURI: process.env.MONGO_URI,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    secretID: randomUUID()
}