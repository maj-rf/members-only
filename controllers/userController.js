const User = require('../models/userSchema');
const Post = require('../models/postSchema');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const async = require('async');

exports.get_login = (req, res) => {
  if (res.locals.currentUser) return res.redirect('/');
  res.render('log-in');
};

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
  body('password')
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage('Minimum length of 6 characters'),
  body('confirm-pass')
    .notEmpty()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage('Passwords do not match'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('sign-up', {
        username: req.body.username,
        email: req.body.email,
        errors: errors.array(),
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
          avatar: req.body.avatar,
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
    res.redirect('/');
  });
};

exports.get_member_form = (req, res, next) => {
  res.render('memberForm');
};

exports.post_member_form = [
  body('secretcode', 'Please type a secret code.')
    .trim()
    .notEmpty()
    .escape()
    .custom((code) => {
      if (code === 'member') {
        return true;
      }
      return false;
    })
    .withMessage('Incorrect Secret Code. Try again.'),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('memberForm', {
          secretcode: req.body.secretcode,
          errors: errors.array(),
        });
        return;
      } else {
        const update = {
          member: true,
        };
        await User.findOneAndUpdate(
          { _id: res.locals.currentUser._id },
          update,
          {
            new: true,
          }
        );
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.get_profile = async (req, res, next) => {
  async.parallel(
    {
      user: function (callback) {
        User.findById(req.params.id)
          .populate('username')
          .populate('email')
          .populate('avatar')
          .populate('member')
          .populate('admin')
          .exec(callback);
      },
      posts: function (callback) {
        Post.find({ user: req.params.id }, 'title message')
          .sort({ date: -1 })
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      res.render('profile', {
        username: results.user.username,
        email: results.user.email,
        avatar: results.user.avatar,
        member: results.user.member,
        admin: results.user.admin,
        post_list: results.posts,
        id: req.params.id,
      });
    }
  );
};
