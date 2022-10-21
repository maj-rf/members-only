var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Members Only' });
});

// User Routes
router.get('/sign-up', userController.get_signup);
router.get('/log-in', userController.get_login);
module.exports = router;
