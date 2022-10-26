var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const indexController = require('../controllers/indexController');
const postController = require('../controllers/postController');
/* GET home page. */
router.get('/', indexController.get_index);

// Posts Routes
router.get('/messageForm', postController.message_get);
router.post('/messageForm', postController.message_post);
// User Routes
router.get('/sign-up', userController.get_signup);
router.get('/log-in', userController.get_login);
router.post('/sign-up', userController.post_signup);
router.post('/log-in', userController.post_login);
router.get('/log-out', userController.get_logout);
module.exports = router;
