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
    cardNo: [String],
    expMonth: Number,
    expYear: Number,
    pinned: {
        type: Boolean,
        default: false
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