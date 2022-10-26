const Post = require('../models/postSchema');
const { body, validationResult } = require('express-validator');

exports.message_get = function (req, res, next) {
  res.render('messageForm', { title: 'Send a Message' });
};

exports.message_post = [
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('message', 'Message must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('index', {
        title: req.body.username,
        message: req.body.email,
        errors: errors.array(),
      });
      return;
    }
    const post = new Post({
      user: req.user._id,
      title: req.body.title,
      message: req.body.message,
    });
    post.save((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  },
];
