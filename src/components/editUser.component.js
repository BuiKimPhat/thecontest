import React from 'react'
import axios from 'axios'

export default class editUser extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            userList: [] 
        }
    }
    componentDidMount(){
        axios.post('http://localhost:5000/users', {id: this.state.id})
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
                <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Password</th>
                        <th>Who</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.userList.map((user,index) => (<tr key={index}><td>{user._id}</td><td>{user.username}</td><td>{user.password}</td><td>{user.isAdmin ? "Admin" : "Candidate"}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}