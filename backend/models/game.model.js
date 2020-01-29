const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    title: { type: String, required: true, unique: true },
    timer: { type: Number },
    form: { type: String, required: true },
    i: {type: Number},
    active: { type: Boolean }
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;