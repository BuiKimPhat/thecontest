const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// .env
const PORT = 6969;
const uri = process.env.ATLAS_URL;

// middlewares
app.use(cors());
app.use(express.json());

//setup database
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
var connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connected to MongoDB database!");
});

//Model
const User = require('./models/users.model');
const Question = require('./models/question.model');


//Router
app.post('/login', (req,res) => {
    User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    .then(thisUser => {
        if (thisUser) res.json(thisUser);
        else res.json('User not found!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
})
// Edit questions
app.get('/questions', (req,res) => {
    Question.find()
    .then(questions => {
        const userGet = questions.map(question => ({_id: question._id, ask: question.ask, a:question.a, b:question.b, c:question.c, d:question.d}))
        if (userGet) res.json(userGet);
        else res.json('Questions not found!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
})
app.post('/questions', (req,res) => {
    User.findById(req.body.id)
    .then(admin => {
        if (admin) {
            if (admin.isAdmin) {
                Question.find()
                    .then(questions => {
                        if (questions) res.json(questions);
                        else res.json('Questions not found!');
                    })
                    .catch(err => res.status(400).json('Error: ' + err));        
            } else res.json('You are not an admin!');    
        } else res.json('You need to log in to access!'); 
    })
    .catch(err => res.status(400).json('Error: ' + err));
})
app.post('/questions/add', (req,res) => {
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
})
app.post('/questions/edit', (req,res) => {
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
app.post('/questions/delete', (req,res) => {
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
})




//Submit answer
app.post('/submit', (req,res) => {
    User.findByIdAndUpdate(req.body.id,{play: req.body.play})
    .then(user => {
        if (user) res.json('Answer submitted!');
        else res.json(req.body);
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

//Edit users
app.post('/users', (req,res) => {
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
})
app.post('/users/add', (req,res) => {
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
})
app.post('/users/edit', (req,res) => {
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
})
app.post('/users/delete', (req,res) => {
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
})

//Run
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});