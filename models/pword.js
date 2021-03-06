var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

var Pwords = new Schema({
    title: String,
    username: String,
    password: String,
    pinned: {
        type: Boolean,
        default: false
    },
    account: {
        type: Boolean,
        default: true
    },
    customFields: [customSchema],
    forUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Pword', Pwords);