const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    ask: { type: String, require: true, unique: true },
    a: {type: String},
    b: {type: String},
    c: {type: String},
    d: {type: String},
    ans: {type: String, trim: true}
}, {
    timestamps: true
});

const Question = mongoose.model('Question',questionSchema);
module.exports = Question;