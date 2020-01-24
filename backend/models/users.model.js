const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean },
    hasAnswered: { type: Boolean },
    play: [
        {
            askID: {type: String},
            ans: {type: String},
            time: {type: Number}
        }
    ]
}, {
    timestamps: true
});

//Model
const User = mongoose.model('User', userSchema);
//Export
module.exports = User;