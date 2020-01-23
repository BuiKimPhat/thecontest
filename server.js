const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// .env
const PORT = 5000;
const uri = process.env.ATLAS_URL;

// middlewares
app.use(cors());
app.use(express.json());

//setup database
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
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
app.get('/questions', (req,res) => {
    Question.find()
    .then(questions => {
        if (questions) res.json(questions);
        else res.json('Questions not found!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
})
app.post('/submit', (req,res) => {
    User.findByIdAndUpdate(req.body.id,{play: req.body.play})
    .then(user => {
        if (user) res.json('Answer submitted!');
        else res.json(req.body);
    })
    .catch(err => res.status(400).json('Error: ' + err));
})
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


//Run
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});