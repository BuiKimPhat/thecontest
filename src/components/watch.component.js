import React from 'react'
import axios from 'axios'
import socketIOClient from 'socket.io-client'

export default class Watch extends React.Component {
    initTime = 0;
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            gameList: [],
            questions: [],
            play: [],
            title: "",
            timer: 0,
            status: [],
            ask: "",
            connections: 1,
            i: -1
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }
    UNSAFE_componentWillMount(){
        this.socket = socketIOClient("http://localhost:6969/liveserver");
        this.socket.on("submission", submit => {
            this.setState(prevState => {
                return ({ 
                    play: [...prevState.play, submit] 
                })
            })
         });
        this.socket.on("checkConnect", checker => {
            this.setState(prevState => {
                return ({ 
                    connections: checker.connections,
                    status: [...prevState.status, checker.status] 
                })
            })
        })
    }
    componentDidUpdate(){
        if (!this.state.timer) {
            clearInterval(this.timerID);
        }
    }
    tick(){
        this.setState({
            timer: this.state.timer - 1
        });    
    }
    componentDidMount(){
        this._isMounted = true;
        if (!this.state.id) {
            alert("You need to log in as admin to access this page");
            this.props.history.push({ pathname: "/login" })
        }
        if (this._isMounted) {
            if (this.state.id) {
                axios.post('http://localhost:6969/games', {id: this.state.id})
                .then(res2 => {
                    if (this._isMounted) {
                        this.setState({
                            gameList: res2.data.filter(game => (game.form === "Input-text" && game.active))
                        })    
                    }
                })
                .catch(err2 => console.log(err2));                 
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.socket.emit("leaveroom", {room: this.state.title, name: "Admin"});
        this.socket.close();
    }
    handleClick(title,timer,id,e){
        if (id === "next") {
            //Press next button in chosen game
            this.setState({
                play: [],
                i: this.state.i + 1
            }, () => {
                this.setState({
                    ask: this.state.questions[this.state.i] ? this.state.questions[this.state.i].ask : "Not found question",
                    timer: this.initTime
                }, () => {
                    this.socket.emit('sendControl', {i: this.state.i});
                    this.timerID = setInterval(
                        () => this.tick(),
                        1000
                    );
                })    
            })
        } else if (id === "leave") {
            this.socket.emit("leaveroom", {room: this.state.title, name: "Admin"});
        } else {
            // press game in game list
            this.initTime = timer;
            this.setState({
                title: title,
                timer: timer
            }, () => {
                this.socket.emit('room', {room: this.state.title, name: "Admin"});
                axios.post('http://localhost:6969/questions', {id :this.state.id})
                    .then(res => {
                        if (this._isMounted) {
                            this.setState({
                                questions: res.data.filter(quest => quest.game === title)
                            })    
                        }
                    })
                    .catch(err => console.log(err)); 
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
                            gameList: res.data.filter(game => (game.form === "Input-text" && game.active))
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
                <h2 className="container">Live</h2>
                <div className="container">
                    <button type="button" className="btn btn-primary" onClick={this.handleReload}>
                        Reload
                    </button>
                </div>
                <br/>
                <div className="modal" id="watchGame">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{this.state.title}</h4>
                                <button type="button" className="close" data-dismiss="modal" onClick={(e) => this.handleClick(0,0,"leave", e)}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <h5>Connections: {this.state.connections}</h5>  
                                <strong>Status:</strong><br/>
                                <div className="container status">
                                    {this.state.status ? this.state.status.map((stat,index) => (<h6 key={index}>{stat}</h6>)) : ""}
                                </div>
                                <button type="button" className="btn btn-success float-right" onClick={(e) => this.handleClick(0,0,"next", e)}>Next</button>
                                {this.state.questions[this.state.i] ? (
                                    <div>
                                        <h1><b>Question {this.state.i + 1} :</b> {this.state.questions[this.state.i].ask}</h1>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                <th>Name</th>
                                                <th>Answer</th>
                                                <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.play ? this.state.play.map((player,index) => (
                                                    <tr key={index}>
                                                        <td>{player.name}</td>
                                                        <td>{player.ans}</td>
                                                        <td>{player.time} s</td>
                                                    </tr>)
                                                ) : "No one has answered yet"}                                            
                                            </tbody>
                                        </table>
                                    </div>
                                ) : "Not found questions"}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => this.handleClick(0,0,"leave", e)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Timer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.gameList.map((game,index) => (<tr onClick={(e) => this.handleClick(game.title, game.timer,game._id, e)} data-toggle="modal" data-target="#watchGame" className="adminList" key={index}><td>{game.title}</td><td>{game.timer}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}