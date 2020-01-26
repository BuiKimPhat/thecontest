import React from 'react'
import axios from 'axios'
import Answer from './answer.component'

export default class editUser extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            userList: [],
            isEdit: false,
            editid: "",
            username: "",
            password: "",
            isAdmin: false,
            play: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAnsChange = this.handleAnsChange.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }
    componentDidMount(){
        this._isMounted = true; 
        if (!this.state.id) {
            alert("You need to log in as admin to access this page");
            this.props.history.push({ pathname: "/login" })
        }
        if (this._isMounted){
            if (this.state.id) {
                axios.post('http://localhost:6969/users', {id: this.state.id})
                .then(res => {
                    if (this._isMounted) {
                        this.setState({
                            userList: res.data
                        })    
                    }
                })
                .catch(err => console.log(err));          
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    handleChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({
            [name] : value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        var update = {
            id: this.state.id,
            editid: this.state.editid,
            username: this.state.username,
            password: this.state.password,
            isAdmin: this.state.isAdmin,
            play: this.state.play
        }
        var uplink;
        if (this.state.isEdit === true) uplink = "http://localhost:6969/users/edit";
        else uplink = "http://localhost:6969/users/add";
        axios.post(uplink, update)
            .then(res => {
                alert(res.data);
                axios.post('http://localhost:6969/users', {id :this.state.id})
                .then(res2 => {
                    this.setState({
                        userList: res2.data
                    })
                })
                .catch(err => console.log(err));          
            })
            .catch(err => console.log(err));
    }
    handleClick(id,username,password,isAdmin,play, e){
        if (id) {
            if (id === "del") {
                let confirmDel = window.confirm("Are you sure want to delete this user?");
                if (confirmDel) {
                    axios.post("http://localhost:6969/users/delete", {id: this.state.id, editid: this.state.editid})
                        .then(res => {
                            alert(res.data);
                            axios.post('http://localhost:6969/users', {id :this.state.id})
                                .then(res2 => {
                                    this.setState({
                                        userList: res2.data
                                    })
                                })
                                .catch(err => console.log(err));                      
                        })
                        .catch(err => console.log(err));    
                }
            } else {
                this.setState({
                    editid: id,
                    username: username,
                    password: password,
                    isAdmin: isAdmin,
                    play: play,
                    isEdit: true
                })        
            }
        } else {
            this.setState({
                editid: "",
                username: "",
                password: "",
                isAdmin: false,
                play: [],
                isEdit: false
            })
        }
    }
    handleAnsChange(eachAns){
        if (eachAns && this.state){
            this.setState(prevState => {
                let now = prevState.play.filter(el => el.askID === eachAns.askID).length;
                if (!now) {
                    return ({ 
                        play: [...prevState.play, eachAns] 
                    })
                }
                return ({ 
                    play: prevState.play.map(el => el.askID === eachAns.askID ? eachAns : el) 
                })
            })
        }
    }
    handleReload(){
        if (this._isMounted){
            if (this.state.id) {
                axios.post('http://localhost:6969/users', {id: this.state.id})
                .then(res => {
                    if (this._isMounted) {
                        this.setState({
                            userList: res.data
                        })    
                    }
                })
                .catch(err => console.log(err));          
            }
        }
    }
    render(){
        return(
            <div className="container-fluid">
                <div className="container">
                    <button type="button" className="btn btn-success" data-toggle="modal" data-target="#addUser" onClick={(e) => this.handleClick(0, e)}>
                        Add a user
                    </button>
                    <button type="button" className="btn btn-success float-right" onClick={this.handleReload}>
                        Reload
                    </button>
                </div>
                <br/>
                <form method="post" onSubmit={this.handleSubmit}>
                <div className="modal" id="addUser">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h4 className="modal-title">{this.state.isEdit ? "Edit user" : "Add a user"}</h4>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid form-group">
                                <label htmlFor="askForm">Username:</label>
                                <input type="text" name="username" id="userForm" className="form-control" placeholder="Username" value={this.state.username} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="AForm">Password:</label>
                                <input type="text" name="password" id="passForm" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="BForm">Who:</label>
                                <select id="ansForm" className="form-control" name="isAdmin" value={this.state.isAdmin} onChange={this.handleChange}> 
                                    <option value={false}>Candidate</option>
                                    <option value={true}>Admin</option>
                                </select>
                            </div>
                            {(!this.state.isAdmin && this.state.isEdit) ? (<div className="container-fluid form-group"><label>Answer:</label><div className="row">{this.state.play.map((item1,index) => (<Answer askID={item1.askID} ans={item1.ans} key={index} onAnsChange={this.handleAnsChange}/>))}</div></div>) : ""}
                        </div>
                        <div className="modal-footer">
                        {this.state.isEdit ? (<button type="button" className="btn btn-danger" onClick={(id, e) => this.handleClick("del", e)}>Delete</button>) : ""}
                        <input type="submit" className="btn btn-success" value={this.state.isEdit ? "Edit" : "Add"} />
                        </div>
                    </div>
                    </div>
                </div>
                </form>
                <table className="table table-hover">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Password</th>
                        <th>Who</th>
                        <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.userList.map((user,index) => (<tr onClick={(e) => this.handleClick(user._id, user.username,user.password, user.isAdmin, user.play, e)} data-toggle="modal" data-target="#addUser" className="adminList" key={index}><td>{user._id}</td><td>{user.username}</td><td>{user.password}</td><td>{user.isAdmin ? "Admin" : "Candidate"}</td><td>{user.score ? user.score : ""}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}