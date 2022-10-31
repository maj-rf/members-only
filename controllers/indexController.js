const Post = require('../models/postSchema');

exports.get_index = (req, res, next) => {
  Post.find({})
    .sort({ date_posted: 1 })
    .populate('user')
    .populate('title')
    .populate('message')
    .populate('date_posted')
    .exec(function (err, list) {
      if (err) return next(err);
      res.render('index', { title: 'Members Only', post_list: list });
    });
};
