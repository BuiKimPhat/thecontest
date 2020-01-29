import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Home from './components/home.component'
import Navbar from './components/navbar.component'
import Game from './components/game.component'
import Admin from './components/admin.component'
import Login from './components/login.component'
import editUser from './components/editUser.component';
import editQuiz from './components/editQuestion.component';
import editGame from './components/editGame.component';
import Watch from './components/watch.component'

function App() {
  return (
      <Router>
        <Navbar/>
        <Route path="/" exact component={Home} />
        <Route path="/game" component={Game} />
        <Route path="/admin" component={Admin} />
        <Route path="/login" component={Login} />
        <Route path="/admin/users" component={editUser} />
        <Route path="/admin/questions" component={editQuiz} />
        <Route path="/admin/games" component={editGame} />
        <Route path="/admin/live" component={Watch} />
      </Router>
    );
}

export default App;
