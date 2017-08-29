var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    oauthId: String,
    oauthToken: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);