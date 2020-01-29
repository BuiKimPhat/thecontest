const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean },
    game: { type: String, required: true },
    time: {type: Number},
    score: {type: Number},
    hasDone: {type: Boolean},
    play: [
        {
            time: {type: Number},
            askID: {type: String},
            ans: {type: String},
        }
    ]
}, {
    timestamps: true
});

//Model
const User = mongoose.model('User', userSchema);
//Export
module.exports = User;