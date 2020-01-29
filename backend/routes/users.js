const router = require('express').Router();
const User = require('../models/users.model');
const Question = require('../models/question.model');

router.route('/').post((req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {
            User.find()
                .then(users => {
                    if (users) res.json(users);
                    else res.json('Users not found!');
                })
                .catch(err => res.status(400).json('Error: ' + err));        
        } else res.json('You are not an admin!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/add').post((req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {
            var newUser = new User(req.body);
            newUser.save((err, newu) => {
                if (err) res.status(400).json('Error: ' + err);
                else res.json(newu.username + " added successfully!");
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
                username: req.body.username,
                password: req.body.password,
                game: req.body.game,
                isAdmin: req.body.isAdmin,
                play: req.body.play,
                hasDone: req.body.hasDone
            }  
            var thisAns = update.play;
            var thisID = req.body.editid;
            var thisScore = 0;
            User.findByIdAndUpdate(thisID, update)
                .then(user => {
                    if (user) {
                        Question.find()
                            .then(questions => {
                                if (questions) {
                                    for (var i=0;i<thisAns.length;i++) {
                                        if (questions.find(quest => quest._id == thisAns[i].askID).ans == thisAns[i].ans) thisScore++;
                                    }
                                    User.findByIdAndUpdate(thisID,{score: thisScore})
                                        .then(thisUser => {
                                            if (thisUser) res.json(thisUser.username + " edited successfully!");
                                            else res.json('User not found!');
                                        })
                                        .catch(err => res.status(400).json('Error: ' + err));                    
                                }
                                else res.json('Questions not found!');
                            })
                            .catch(err => res.status(400).json('Error: ' + err));              
                    }
                    else res.json('User not found!');
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
            User.findByIdAndDelete(req.body.editid)
            .then(user => {
                if (user) res.json("User deleted successfully!");
                else res.json('User not found!');
            })
            .catch(err => res.status(400).json('Error: ' + err));        
        } else res.json('You are not an admin!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;