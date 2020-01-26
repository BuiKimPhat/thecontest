const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean },
    time: {type: Number},
    score: {type: Number},
    play: [
        {
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