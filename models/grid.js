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

var GridCard = new Schema({
    title: String,
    grid: [Number],
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

module.exports = mongoose.model('GridCard', GridCard);