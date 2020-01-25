import React from 'react'

export default class Admin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            username: this.props.location.username,
        }
        this.handleClick = this.handleClick.bind(this)
    }
    componentDidMount(){
        if (!this.state.id) {
            alert("You need to log in as admin to access this page");
            this.props.history.push({ pathname: "/login" })
        }
    }
    handleClick(e){
        var value = e.target.value;
        if (value === "Users") this.props.history.push({pathname: '/admin/users', id: this.state.id});
        else this.props.history.push({pathname: '/admin/questions', id: this.state.id});
    }
    render(){
        return(
            <div className="container">
                Welcome {this.state.username}! <br />
                <button className="btn btn-warning" value="Users" onClick={this.handleClick}>Users</button>
                <button className="btn btn-warning" value="Quiz" onClick={this.handleClick}>Questions</button>
                <a href="/login" className="btn btn-primary">Log out</a>
            </div>
        )
    }
}