const router = require('express').Router();
const User = require('../models/users.model');

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
            User.findByIdAndUpdate(req.body.updateUser.id, req.body.updateUser)
                .then(user => {
                    if (user) res.json(user.username + " edited successfully!");
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