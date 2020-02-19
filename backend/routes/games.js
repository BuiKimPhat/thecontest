const router = require('express').Router();
const Game = require('../models/game.model');
const User = require('../models/users.model');
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'leonardothesecond', 
    api_key: '528537812156453', 
    api_secret: 'zfukTWqGAElCqrbyXfWTPx7G1Hs' 
  });

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
    console.log(req.files);
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {            
            var temp = req.body;
            var file = req.files.gameImage;
                cloudinary.uploader.upload(file.tempFilePath, (err , result) => {
                    if (err) res.status(400).json(err);
                    temp.image = result.secure_url;
                    console.log(temp)
                }).then(() => {
                    var newGame = new Game(temp);
                    newGame.save((err, newg) => {
                        if (err) res.status(400).json('Error: ' + err);
                        else res.json({mess: newg.title + " added successfully!", image: newg.image});
                    });                
                })          
        } else res.json('You are not an admin!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/edit').post((req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {
            var update = {
                title: req.body.title,
                timer: req.body.timer,
                form: req.body.form,
                active: req.body.active
            }
            var file = req.files.gameImage;
                cloudinary.uploader.upload(file.tempFilePath, (err , result) => {
                    if (err) res.status(400).json(err);
                    update.image = result.secure_url;
                }).then(() => {
                    Game.findByIdAndUpdate(req.body.editid, update)
                    .then(game => {
                        if (game) res.json({mess: game.title + " edited successfully!", image: update.image});
                        else res.json('Game not found!');
                    })
                    .catch(err1 => res.status(400).json('Error: ' + err1));            
                })
                // .then(result => {
                //     update.image = result.secure_url;
                //     console.log("upp")
                // })
                // .catch(err2 => {
                //     res.status(400).json(err2);
                //     console.log("noo")
                // })            
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