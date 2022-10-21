const User = require('../models/userSchema');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
exports.get_signup = (req, res) => res.render('sign-up');

exports.get_login = (req, res) => res.render('log-in');

exports.post_signup = (req, res) => [
  body('firstname', 'First Name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('surname', 'Surname is required').trim().isLength({ min: 1 }).escape(),
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
  body('password'.isLength(6).withMessage('Minimum length of 6 characters')),
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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: errors.array(),
      });
      return;
    }
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
      }).save((err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  },
];
