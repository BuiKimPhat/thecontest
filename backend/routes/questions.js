const router = require('express').Router();
const Question = require('../models/question.model');
const User = require('../models/users.model');

// router.route('/').get((req,res) => {
//     Question.find()
//     .then(questions => {
//         const userGet = questions.map(question => ({_id: question._id, ask: question.ask, a:question.a, b:question.b, c:question.c, d:question.d}))
//         if (userGet) res.json(userGet);
//         else res.json('Questions not found!');
//     })
//     .catch(err => res.status(400).json('Error: ' + err));
// });
router.route('/').post((req,res) => {
    User.findById(req.body.id)
    .then(user => {
        if (user) {
            if (user.isAdmin) {
                Question.find()
                    .then(questions => {
                        if (questions) res.json(questions);
                        else res.json('Questions not found!');
                    })
                    .catch(err => res.status(400).json('Error: ' + err));        
            } else {
                if (user.play.length) {
                    res.json('You cannot change your answer after submission!');
                } else {
                        Question.find()
                            .then(questions => {
                                const userGet = questions.map(question => ({_id: question._id, ask: question.ask, a:question.a, b:question.b, c:question.c, d:question.d}))
                                if (userGet) res.json(userGet);
                                else res.json('Questions not found!');
                            })
                            .catch(err => res.status(400).json('Error: ' + err));
                }
            };    
        } else res.json('You need to log in to access!'); 
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/add').post((req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin.isAdmin) {
            let newQues = new Question({
                ask: req.body.ask,
                a: req.body.a,
                b: req.body.b,
                c: req.body.c,
                d: req.body.d,
                ans: req.body.ans,
            });
            newQues.save((err) => {
                if (err) res.status(400).json('Error: ' + err);
                else res.json("Question added successfully!");
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
                ask: req.body.ask,
                a: req.body.a,
                b: req.body.b,
                c: req.body.c,
                d: req.body.d,
                ans: req.body.ans,
            }    
            Question.findByIdAndUpdate(req.body.editid, update)
                .then(ques => {
                    if (ques) res.json("Question edited successfully!");
                    else res.json('Question not found!');
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
            Question.findByIdAndDelete(req.body.editid)
            .then(ques => {
                if (ques) res.json("Question deleted successfully!");
                else res.json('Question not found!');
            })
            .catch(err => res.status(400).json('Error: ' + err));        
        } else res.json('You are not an admin!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;