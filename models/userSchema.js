const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  member: { type: Boolean, default: false },
  join_date: { type: Date, default: Date.now },
});

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('join_date_formatted').get(function () {
  return DateTime.fromJSDate(this.join_date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('User', UserSchema);
