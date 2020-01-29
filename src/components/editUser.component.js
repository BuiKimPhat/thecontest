import React from 'react'
import axios from 'axios'
import Answer from './answer.component'

class InputAns extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            askID: props.askID,
            ans: props.ans
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        var value = e.target.value;
        this.setState({
            ans: value
        }, () => {
            this.props.onAnsChange(this.state);
        })
    }
    render(){
        return(
            <div className="container-fluid form-group">
                <label htmlFor="ansForm">{this.state.askID} :</label>
                <input type="text" name="ans" id="userForm" className="form-control" placeholder="Answer" value={this.state.ans} onChange={this.handleChange} />
            </div>    
        )
    }
}

export default class editUser extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            userList: [],
            gameList: [],
            isEdit: false,
            editid: "",
            username: "",
            game: "",
            password: "",
            isAdmin: false,
            play: [],
            hasDone: false
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
                    axios.post('http://localhost:6969/games', {id: this.state.id})
                    .then(res2 => {
                        if (this._isMounted) {
                            this.setState({
                                gameList: res2.data
                            })    
                        }
                    })
                    .catch(err2 => console.log(err2));              
                })
                .catch(err => console.log(err));          
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    handleChange(e){
        var target = e.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        if (value === "true") value = true;
        if (value === "false") value = false;
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
            hasDone: this.state.hasDone,
            game: this.state.game,
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
                .catch(err2 => console.log(err2));          
            })
            .catch(err => console.log(err));
    }
    handleClick(id,username,password,isAdmin,play,game,hasDone, e){
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
                                .catch(err2 => console.log(err2));                      
                        })
                        .catch(err => console.log(err));    
                }
            } else {
                this.setState({
                    editid: id,
                    username: username,
                    password: password,
                    isAdmin: isAdmin,
                    hasDone: hasDone,
                    game: game ? game : this.state.gameList[0].title,
                    play: play,
                    isEdit: true
                })        
            }
        } else {
            this.setState({
                editid: "",
                username: "",
                password: "",
                hasDone: false,
                game: game ? game : this.state.gameList[0].title,
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
                    axios.post('http://localhost:6969/games', {id: this.state.id})
                    .then(res2 => {
                        if (this._isMounted) {
                            this.setState({
                                gameList: res2.data
                            })    
                        }
                    })
                    .catch(err2 => console.log(err2));              
                })
                .catch(err => console.log(err));          
            }
        }
    }
    render(){
        return(
            <div className="container-fluid">
                <h2 className="container">User</h2>
                <div className="container">
                    <button type="button" className="btn btn-success" data-toggle="modal" data-target="#addUser" onClick={(e) => this.handleClick(0, e)}>
                        Add a user
                    </button>
                    <button type="button" className="btn btn-primary float-right" onClick={this.handleReload}>
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
                                <label htmlFor="userForm">Username:</label>
                                <input type="text" name="username" id="userForm" className="form-control" placeholder="Username (Không trùng với tên user khác)" value={this.state.username} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="passForm">Password:</label>
                                <input type="text" name="password" id="passForm" className="form-control" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="whoForm">Who:</label>
                                <select id="whoForm" className="form-control" name="isAdmin" value={this.state.isAdmin} onChange={this.handleChange}> 
                                    <option value={false}>Candidate</option>
                                    <option value={true}>Admin</option>
                                </select>
                            </div>
                            {(!this.state.isAdmin && this.state.gameList.length) ? (        
                                <div>                    
                                    <div className="container-fluid form-group">
                                        <label htmlFor="gameForm">Game:</label>
                                        <select id="gameForm" className="form-control" name="game" value={this.state.game} onChange={this.handleChange}> 
                                            {this.state.gameList.map((game, index) => (<option value={game.title} key={index}>{game.title}</option>))}
                                        </select>
                                    </div>
                                    <div className="container-fluid custom-control custom-switch">
                                        <input type="checkbox" name="hasDone" checked={this.state.hasDone} onChange={this.handleChange} className="custom-control-input" id="doneForm" />
                                        <label className="custom-control-label" htmlFor="doneForm">Done </label>
                                    </div>
                                </div>
                            ) : ""}
                            {(!this.state.isAdmin && this.state.isEdit) ? (this.state.gameList.find(game => game.title === this.state.game).form !== "Multiple-choice" ?
                                (<div className="container-fluid form-group"><label>Answer:</label><div className="row">{this.state.play.map((item1,index) => (<InputAns askID={item1.askID} ans={item1.ans} key={index} onAnsChange={this.handleAnsChange}/>))}</div></div>) 
                            : (<div className="container-fluid form-group"><label>Answer:</label><div className="row">{this.state.play.map((item1,index) => (<Answer askID={item1.askID} ans={item1.ans} key={index} onAnsChange={this.handleAnsChange}/>))}</div></div>)) : ""}
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
                        <th>Game</th>
                        <th>Time</th>
                        <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.userList.map((user,index) => (<tr onClick={(e) => this.handleClick(user._id, user.username,user.password, user.isAdmin, user.play ? user.play : [], user.game, user.hasDone !== undefined ? user.hasDone : false,user.time, e)} data-toggle="modal" data-target="#addUser" className="adminList" key={index}><td>{user._id}</td><td>{user.username}</td><td>{user.password}</td><td>{user.isAdmin ? "Admin" : "Candidate"}</td><td>{user.game}</td><td>{user.time ? user.time : ""}</td><td>{user.score ? user.score : ""}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}