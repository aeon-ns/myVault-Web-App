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
    },
    type: {
        type: String,
        default: 'password'
    }
});

var Card = new Schema({
    title: String,
    cardNo: [],
    exp: Date,
    cvv: Number,
    pinned: {
        type: Boolean,
        default: false
    },
    account: {
        type: Boolean,
        default: true
    },
    hasCustom: {
        type: Boolean,
        default: false
    },
    customFields: [customSchema],
    forUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Card', Card);