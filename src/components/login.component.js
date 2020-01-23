import React from 'react'
import axios from 'axios'

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: '',
            username: '',
            password: '',
            isAdmin: false
        }   
        this.handleChange = this.handleChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
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
    // Submit login form
    handleLoginSubmit(e){
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post('http://10.148.0.10/login', user)
            .then(res => {
                if (res.data === "User not found!") alert("Wrong username or password!");
                else {
                    this.setState({
                        id: res.data._id,
                        isAdmin: res.data.isAdmin,
                    });
                    if (!this.state.isAdmin) {
                        this.props.history.push({
                            pathname: '/game',
                            username: this.state.username,
                            id: this.state.id
                        })
                    } else {
                        this.props.history.push({
                            pathname: '/admin',
                            username: this.state.username,
                            id: this.state.id
                        })
                    }          
                }   
            })
            .catch(err => console.log(err));
    }
    render(){
        return (
            <div>
                    <div className="limiter">
                        <div className="container-login100">
                            <div className="wrap-login100 p-t-50 p-b-90">
                                <form className="login100-form validate-form flex-sb flex-w" method='post' onSubmit={this.handleLoginSubmit}>
                                    <span className="login100-form-title p-b-51">
                                        Login
                                    </span>

                                    
                                    <div className="wrap-input100 validate-input m-b-16" data-validate = "Username is required">
                                        <input className="input100"  type='text' name='username' onChange={this.handleChange} placeholder="Username" />
                                        <span className="focus-input100"></span>
                                    </div>
                                    
                                    
                                    <div className="wrap-input100 validate-input m-b-16" data-validate = "Password is required">
                                        <input className="input100" type='password' name='password' onChange={this.handleChange} placeholder="Password" />
                                        <span className="focus-input100"></span>
                                    </div>

                                    <div className="container-login100-form-btn m-t-17">
                                        <button className="login100-form-btn">
                                            Login
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                    
            </div>
        )
    }
}