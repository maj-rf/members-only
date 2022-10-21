const User = require('../models/userSchema');

exports.get_signup = (req, res) => res.render('sign-up');

exports.get_login = (req, res) => res.render('log-in');
