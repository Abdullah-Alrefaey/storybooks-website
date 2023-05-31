const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../middlewares/auth');
const storyController = require('../controllers/storyController');
const { storyDataValidationChainMethod } = require('../validations/storyValidation');
const { storyCommentValidation} = require('../validations/storyCommentValidation');

// Stories Index
router.get('/', storyController.story_index);
router.get('/show/:id', storyController.story_show);
router.get('/user/:userId', storyController.story_user_list);
router.get('/my', ensureAuthenticated, storyController.story_my_list);
router.get('/add', ensureAuthenticated, storyController.story_add_get);
router.post("/", ensureAuthenticated,
    storyDataValidationChainMethod,
    storyController.story_add_post);

router.get('/edit/:id', ensureAuthenticated, storyController.story_edit_get);
router.put('/:id', ensureAuthenticated, storyController.story_edit_put);
router.delete('/:id', ensureAuthenticated, storyController.story_delete);
router.post('/comment/:id', ensureAuthenticated, storyCommentValidation, storyController.story_comment_post);

module.exports = router;