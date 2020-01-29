import React from 'react'
import axios from 'axios'

export default class editGame extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            gameList: [],
            isEdit: false,
            editid: "",
            title: "",
            timer: 0,
            form: "",
            active: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }
    componentDidMount(){
        this._isMounted = true;
        if (!this.state.id) {
            alert("You need to log in as admin to access this page");
            this.props.history.push({ pathname: "/login" })
        }
        if (this._isMounted) {
            if (this.state.id) {
                axios.post('http://localhost:6969/games', {id :this.state.id})
                .then(res => {
                    if (this._isMounted) {
                        this.setState({
                            gameList: res.data
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
        var target = e.target;
        var name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name] : value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        var update = {
            id: this.state.id,
            editid: this.state.editid,
            title: this.state.title,
            timer: Number(this.state.timer),
            form: this.state.form,
            active: this.state.active
        }
        var uplink;
        if (this.state.isEdit === true) uplink = "http://localhost:6969/games/edit";
        else uplink = "http://localhost:6969/games/add";
        axios.post(uplink, update)
            .then(res => {
                alert(res.data);
                axios.post('http://localhost:6969/games', {id :this.state.id})
                .then(res2 => {
                    this.setState({
                        gameList: res2.data
                    })
                })
                .catch(err => console.log(err));          
            })
            .catch(err => console.log(err));
    }
    handleClick(id,title,form,timer,active,e){
        if (id) {
            if (id === "del") {
                let confirmDel = window.confirm("Are you sure want to delete this game?");
                if (confirmDel) {
                    axios.post("http://localhost:6969/games/delete", {id: this.state.id, editid: this.state.editid})
                        .then(res => {
                            alert(res.data);
                            axios.post('http://localhost:6969/games', {id :this.state.id})
                            .then(res2 => {
                                this.setState({
                                    gameList: res2.data
                                })
                            })
                            .catch(err2 => console.log(err2));                      
                        })
                        .catch(err => console.log(err));    
                }
            } else {
                this.setState({
                    editid: id,
                    title: title,
                    timer: timer,
                    form: form ? form : "Multi-choice",
                    active: active,
                    isEdit: true
                })        
            }
        } else {
            this.setState({
                editid: "",
                title: "",
                form: form ? form : "Multi-choice",
                timer: 0,
                active: false,
                isEdit: false
            })
        }
    }
    handleReload(){
        if (this._isMounted) {
            if (this.state.id) {
                axios.post('http://localhost:6969/games', {id :this.state.id})
                .then(res => {
                    if (this._isMounted) {
                        this.setState({
                            gameList: res.data
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
                <h2 className="container">Game</h2>
                <div className="container">
                    <button type="button" className="btn btn-success" data-toggle="modal" data-target="#addGame" onClick={(e) => this.handleClick(0, e)}>
                        Add a game
                    </button>
                    <button type="button" className="btn btn-primary float-right" onClick={this.handleReload}>
                        Reload
                    </button>
                </div>
                <br/>
                <form method="post" onSubmit={this.handleSubmit}>
                <div className="modal" id="addGame">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h4 className="modal-title">{this.state.isEdit ? "Edit game" : "Add a game"}</h4>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid form-group">
                                <label htmlFor="titleForm">Title:</label>
                                <input type="text" name="title" id="titleForm" placeholder="Game title (Không trùng với tên game khác)" className="form-control" value={this.state.title} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="formForm">Form:</label>
                                <select id="formForm" className="form-control" name="form" value={this.state.form} onChange={this.handleChange}> 
                                    <option value="Multi-choice">Multi-choice</option>
                                    <option value="Input-text">Input-text</option>
                                </select>
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="timerForm">Timer <i> (leave it 0 if not use timer) </i>:</label>
                                <input type="number" min="0" name="timer" id="timerForm" className="form-control" value={this.state.timer} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid custom-control custom-switch">
                                <input type="checkbox" name="active" checked={this.state.active} onChange={this.handleChange} className="custom-control-input" id="activeForm" />
                                <label className="custom-control-label" htmlFor="activeForm">Active </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                        {this.state.isEdit ? (<button name="deleteQues" type="button" className="btn btn-danger" onClick={(id, e) => this.handleClick("del", e)}>Delete</button>) : ""}
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
                        <th>Title</th>
                        <th>Form</th>
                        <th>Timer</th>
                        <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.gameList.map((game,index) => (<tr onClick={(e) => this.handleClick(game._id, game.title, game.form, game.timer, game.active, e)} data-toggle="modal" data-target="#addGame" className="adminList" key={index}><td>{game._id}</td><td>{game.title}</td><td>{game.form}</td><td>{game.timer}</td><td>{game.active ? "Active" : "Not active"}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}