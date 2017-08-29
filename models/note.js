var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notes = new Schema({
    title: String,
    note: String,
    pinned: {
        type: Boolean,
        default: false
    },
    account: {
        type: Boolean,
        default: true
    },
    forUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Note', Notes);