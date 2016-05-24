/**
 * Created by asistent on 13.05.2016.
 */

var mongoose = require('../mongooseDB'),
    UserSchema = mongoose.Schema;

var User = new UserSchema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true,
        rounds: 2
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.plugin(require('mongoose-bcrypt'));

var UserModel = mongoose.model('User', User);

module.exports.UserModel = UserModel;