const Post = require('../models/postSchema');

exports.get_index = async (req, res, next) => {
  try {
    const post_list = await Post.find({})
      .sort({ date_posted: -1 })
      .populate('user')
      .populate('title')
      .populate('message')
      .populate('date_posted');
    res.render('index', {
      title: 'Members Only',
      post_list: post_list,
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
};
