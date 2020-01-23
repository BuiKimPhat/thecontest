import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './components/home.component'
import Navbar from './components/navbar.component'
import Game from './components/game.component'
import Admin from './components/admin.component'

function App() {
  return (
      <Router>
        <Navbar/>
        <Route path="/" exact component={Home} />
        <Route path="/game" component={Game} />
        <Route path="/admin" component={Admin} />
      </Router>
    );
}

export default App;
