const router = require('express').Router();
const Game = require('../models/game.model');
const User = require('../models/users.model');

router.route('/').post((req,res) => {
    User.findById(req.body.id)
    .then(user => {
        if (user.isAdmin) {
            Game.find()
                .then(games => {
                    if (games) res.json(games);
                    else res.json('Games not found!');
                })
                .catch(err => res.status(400).json('Error: ' + err));        
        } else {
            if (!user.hasDone) {
                Game.findOne({title: user.game})
                .then(game => {
                    if (game) {
                        if (game.active) res.json(game);
                        else res.json('Game is not active!');
                    } else res.json('Game not found!');
                })
                .catch(err => res.status(400).json('Error: ' + err)); 
            } else res.json("You've already done this game!");
        };
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/add').post((req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {
            var newGame = new Game(req.body);
            newGame.save((err, newg) => {
                if (err) res.status(400).json('Error: ' + err);
                else res.json(newg.title + " added successfully!");
            });        
        } else res.json('You are not an admin!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/edit').post((req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {
            let update = {
                title: req.body.title,
                timer: req.body.timer,
                form: req.body.form,
                active: req.body.active
            }    
            Game.findByIdAndUpdate(req.body.editid, update)
                .then(game => {
                    if (game) res.json(game.title + " edited successfully!");
                    else res.json('Game not found!');
                })
                .catch(err => res.status(400).json('Error: ' + err));        
        } else res.json('You are not an admin!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/delete').post((req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {    
            Game.findByIdAndDelete(req.body.editid)
            .then(game => {
                if (game) res.json("Game deleted successfully!");
                else res.json('Game not found!');
            })
            .catch(err => res.status(400).json('Error: ' + err));        
        } else res.json('You are not an admin!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;