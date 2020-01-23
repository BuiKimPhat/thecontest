import React from 'react'
import axios from 'axios'
import Question from './question.component'
import Admin from './admin.component'

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            username: '',
            password: '',
            questions: [],
            play: [],
            isLoggedIn: false,
            isAdmin: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleAnsChange = this.handleAnsChange.bind(this);
    }

    // Login input change handle
    handleChange(e){
        var target = e.target;
        var value = target.value;
        var name = target.name;
        this.setState({
            [name]: value
        })    
    }

    handleAnsChange(eachAns){
        if (eachAns && this.state){
            this.setState(prevState => {
                let now = prevState.play.filter(el => el.askID == eachAns.askID).length;
                if (!now) {
                    return ({ 
                        play: [...prevState.play, eachAns] 
                    })
                }
                return ({ 
                    play: prevState.play.map(el => el.askID == eachAns.askID ? eachAns : el) 
                })
            })
        }
    }

    // Submit login form
    handleLoginSubmit(e){
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post('http://localhost:5000/login', user)
            .then(res => {
                if (res.data == "User not found!") alert("Wrong username or password!");
                else this.setState({
                    id: res.data._id,
                    isAdmin: res.data.isAdmin,
                    isLoggedIn : true
                });
            })
            .catch(err => console.log(err));
    }

    // Logout function
    handleLogout(e){
        e.preventDefault();
        const user = {
            id: this.state.id,
            play: this.state.play
        }
        console.log(user);
        axios.post('http://localhost:5000/submit', user)
            .then(res => {
                console.log(res.data);
                this.setState({
                    id: '',
                    username: '',
                    password: '',
                    questions: [],
                    play: [],
                    isLoggedIn: false
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        const isAdmin = this.state.isAdmin;
        let view;
        if (!isLoggedIn) {
            view = (

                // Log In Page

                <div>
                    <form method='post' onSubmit={this.handleLoginSubmit}>
                        <input type='text' name='username' onChange={this.handleChange} />
                        <input type='password' name='password' onChange={this.handleChange} />
                        <input type='submit' value='Sign in' />
                    </form>
                </div>
            )
        }  else {
            if (!isAdmin) {
                axios.get('http://localhost:5000/questions')
                    .then(res => {
                        this.setState({
                            questions: res.data
                        })
                    })
                    .catch(err => console.log(err));
                view = (

                    // Game Play Page

                <div><h2>Welcome {this.state.username}!</h2>
                        <form method="post" onSubmit={this.handleLogout}>
                            {this.state.questions.map((question, index) => (<Question key={index} ask={question.ask} _id={question._id} a={question.a} b={question.b} c={question.c} d={question.d} onAnsChange={this.handleAnsChange}/>))}
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                )
            } else {
                this.props.history.push({
                    pathname: '/admin',
                    id: this.state.id,
                    username: this.state.username
                })
            }
        }
        return(
            <div>{view}</div>
        )
    }
}