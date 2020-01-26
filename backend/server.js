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

//Router
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
const questionsRouter = require('./routes/questions');
app.use('/questions', questionsRouter);

//Model for other router
const User = require('./models/users.model');
const Question = require('./models/question.model');
//Other router
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

app.post('/submit', (req,res) => {
    var thisAns = req.body.play;
    var thisScore = 0;
    User.findByIdAndUpdate(req.body.id,{play: thisAns})
        .then(user => {
            if (user) {
                Question.find()
                    .then(questions => {
                        if (questions) {
                            for (var i=0;i<thisAns.length;i++) {
                                if (questions.find(quest => quest._id == thisAns[i].askID).ans == thisAns[i].ans) thisScore++;
                            }
                            res.json('Answer submitted!\nYour Score is: ' + thisScore + ' / ' + questions.length);  
                        }
                        else res.json('Questions not found!');
                    })
                    .catch(err => res.status(400).json('Error: ' + err));              
            }
            else res.json('User not found!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

//Run
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});