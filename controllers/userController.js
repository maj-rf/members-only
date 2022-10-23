const User = require('../models/userSchema');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.get_login = (req, res) => res.render('log-in');

exports.get_signup = (req, res) => res.render('sign-up');

exports.post_signup = [
  body('username', 'Username is required')
    .trim()
    .isLength({ min: 6 })
    .escape()
    .custom(async (username) => {
      try {
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
          throw new Error('username already in use');
        }
      } catch (err) {
        throw new Error(err);
      }
    }),
  body('email', 'Email is required')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (email) => {
      try {
        const usedEmail = await User.findOne({ email: email });
        if (usedEmail) throw new Error('Email is already in use.');
      } catch (err) {
        throw new Error(err);
      }
    }),
  body('password').isLength(6).withMessage('Minimum length of 6 characters'),
  body('confirm-pass').custom((value, { req }) => {
    if (value !== req.body.password) {
      return next('Passwords do not match.');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('sign-up', {
        username: req.body.username,
        email: errors.array(),
      });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });

        newUser.save((err) => {
          if (err) {
            return next(err);
          }
        });
        return res.redirect('/log-in');
      });
    }
  },
];

exports.post_login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
});

exports.get_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/log-in');
  });
};
