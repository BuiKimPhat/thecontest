const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const http = require('http').createServer(app);
const fileupload = require('express-fileupload');
const io = require('socket.io')(http);
// .env
const PORT = 6969;
const uri = process.env.ATLAS_URL;

// middlewares
app.use(cors());
app.use(express.json());
app.use(fileupload({
    useTempFiles: true
}))

// Real-time
const liveServer = io.of('/liveserver');
liveServer.on('connection', socket => {
    var room = "";
    socket.on('room', who => {
        room = who.room;
        socket.join(who.room);
        liveServer.in(who.room).clients((error, clients) => {
            if (error) throw error;
            socket.to(room).emit('checkConnect', {status: who.name + ' joined room ' + who.room, connections: clients.length});
        });
    });
    socket.on('leaveroom', who => {
        socket.leave(who.room);
        liveServer.in(who.room).clients((error, clients) => {
            if (error) throw error;
            socket.to(room).emit('checkConnect', {status: who.name + ' leaved room ' + who.room, connections: clients.length});
        });
    });

    socket.on('liveSubmit', submit => {
        socket.to(room).emit('submission', submit);
    })

    socket.on('sendControl', control => {
        socket.to(room).emit('adminControl', control);
    })
})

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
const gamesRouter = require('./routes/games');
app.use('/games', gamesRouter);

//Model for other router
const User = require('./models/users.model');
const Question = require('./models/question.model');
const Game = require('./models/game.model');

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
    var thisID = req.body.id;
    var thisScore = 0;
    User.findByIdAndUpdate(thisID,{play: thisAns, time: req.body.time, hasDone: true})
        .then(user => {
            if (user) {
                Game.findOne({title: req.body.game})
                    .then(game => {
                        Question.find()
                        .then(quests => {
                            var questions = quests.filter(quest => quest.game == game.title);
                            if (questions) {
                                for (var i=0;i<thisAns.length;i++) {
                                    if (questions.find(quest => quest._id == thisAns[i].askID).ans == thisAns[i].ans) thisScore++;
                                }
                                User.findByIdAndUpdate(thisID,{score: thisScore})
                                    .then(thisUser => {
                                        if (thisUser) res.json('Answer submitted!\nYour Score is: ' + thisScore + ' / ' + questions.length);
                                        else res.json('User not found!');
                                    })
                                    .catch(err => res.status(400).json('Error: ' + err));                    
                            }
                            else res.json('Questions not found!');
                        })
                        .catch(err3 => res.status(400).json('Error: ' + err3));                  
                    })
                    .catch(err2 => res.status(400).json('Error: ' + err2)); 
            }
            else res.json('User not found!');
        })
        .catch(err => res.status(400).json('Error: ' + err));    
})

// app.post('/check', (req,res) => {
//     User.findById(req.body.id)
//         .then(() => {
//             Game.findOne({title: req.body.game})
//                 .then(game => {

//                 })
//                 .catch(err2 => res.status(400).json('Error: ' + err2))
//         })
//         .catch(err => res.status(400).json('Error: '+ err))
// })

// app.post('/upload', (req,res) => {
    // const file = req.files.gameImage;
    // cloudinary.uploader.upload(file.tempFilePath)
    //     .then(result => {
    //         Game.findOneAndUpdate({title: req.body.title}, {image: result.secure_url})
    //             .then(game => {
    //                 if (game) res.status(200).json({image: result.secure_url});
    //                 else res.status(404).json('Game not found!');
    //             })
    //             .catch(err2 => res.status(400).json('Error: ' + err2));
    //     })
    //     .catch(err =>
    //         res.status(400).json(err)
    //     )
// })

//Run
http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});