const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../middlewares/auth');
const indexController = require('../controllers/indexController');

router.get('/', ensureGuest, indexController.index);
router.get('/dashboard', ensureAuthenticated, indexController.index_dashboard);
router.get('/about', indexController.index_welcome);

module.exports = router;