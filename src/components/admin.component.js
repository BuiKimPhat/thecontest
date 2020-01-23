import React from 'react'
import axios from 'axios'

export default class Admin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            username: this.props.location.username,
            userList: []
        }
    }
    componentDidMount(){
        axios.post('http://localhost:5000/admin', {id: this.state.id})
        .then(res => {
            this.setState({
                userList: res.data
            })
        })
        .catch(err => console.log(err));
    }
    render(){
        return(
            <div>
                Welcome {this.state.username}!
                <table class="table table-hover">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Password</th>
                    <th>Who</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.userList.map(user => (<tr><td>{user._id}</td><td>{user.username}</td><td>{user.password}</td><td>{user.isAdmin ? "Admin" : "Candidate"}</td></tr>))}
                </tbody>
                </table>
            </div>
        )
    }
}