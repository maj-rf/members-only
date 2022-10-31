const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  member: { type: Boolean, default: false },
  join_date: { type: Date, default: Date.now },
  avatar: {
    type: String,
    required: true,
    enum: ['b1', 'b2', 'b3', 'b4', 'g1', 'g2', 'g3', 'g4', 'nb1', 'nb2', 'nb3'],
  },
});

UserSchema.virtual('join_date_formatted').get(function () {
  return DateTime.fromJSDate(this.join_date).toLocaleString(DateTime.DATE_MED);
});

UserSchema.virtual('url').get(function () {
  return '/profile/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
