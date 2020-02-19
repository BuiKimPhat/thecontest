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
            isReveal: [],
            ask: "",
            image: "",
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
        if (this.state.timer <= 0) {
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
        document.getElementById( 'hidden' ).scrollIntoView();
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.socket.emit("leaveroom", {room: this.state.title, name: "Admin"});
        this.socket.close();
    }
    handleClick(title,timer,id,image,index,e){
        if (id === "next") {
            //Press next button in chosen game
            clearInterval(this.timerID);
            this.setState({
                play: [],
                i: index
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
                timer: timer,
                image: image
            }, () => {
                this.socket.emit('room', {room: this.state.title, name: "Admin"});
                axios.post('http://localhost:6969/questions', {id :this.state.id})
                    .then(res => {
                        if (this._isMounted) {
                            this.setState({
                                questions: res.data.filter(quest => quest.game === title)
                            },() => {
                                this.setState({
                                    isReveal: new Array(this.state.questions.length).fill(false)
                                })
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
                            gameList: res.data.filter(game => (game.form === "Input-text" && game.active)),
                            questions: [],
                            play: [],
                            title: "",
                            timer: 0,
                            status: [],
                            isReveal: [],
                            ask: "",
                            image: "",
                            connections: 1,
                            i: -1                
                        })    
                    }                
                })
                .catch(err => console.log(err));      
            }
        }
    }
    renderSquare(ans, isReveal){
        let ansArray = [];
        for (var i=0;i < ans.replace(/\s/g,'').length;i++){
            ansArray.push(ans.replace(/\s/g,'').charAt(i))
        };
    return ansArray.map((letter, index) => (<button type="button" key={index} style={{marginRight: "0.5em", borderRadius: "30px", fontWeight: "bold", fontSize: "1.8vw"}} className="btn btn-primary">{isReveal ? letter : (<>&nbsp;&nbsp;&nbsp;&nbsp;</>)}</button>))
    }
    reveal(index){
        var array = [...this.state.isReveal];
        array.splice(index,1,true);
        this.setState({isReveal: array});
    }
    makeCover(reveal){
        var length = reveal.length;
        var rowsLength = Math.floor(Math.sqrt(length));
        var left = length - rowsLength*rowsLength;
        var add = (length%rowsLength===0) ? 0 : Math.ceil(left/rowsLength);
        var row = 0;
        var col = (length%rowsLength===0) ? length/rowsLength : rowsLength + add;
        var next = col;
        var item;
        // for (var i=0;i<rowsLength;i++){
        //     for (var j=0;j<(rowsLength + add);j++){
        //         return (<div className="btn" style={{
        //                     height: String(Number(document.getElementById("gameImage").style.height.split("vh")[0]) / rowsLength) + "vh", 
        //                     width: String(Number(document.getElementById("gameImage").style.width.split("%")[0]) / (rowsLength + add)) + "%", 
        //                     position:"absolute", 
        //                     visibility: reveal[i*j+add] ? "hidden" : "visible", 
        //                     backgroundColor:"white",
        //                     left: String((Number(document.getElementById("gameImage").style.width.split("%")[0]) / (rowsLength + add))*(index%(rowsLength+add))) + "%",
        //                     top: String((Number(document.getElementById("gameImage").style.height.split("vh")[0]) / rowsLength)*(Math.floor(index/(rowsLength + add)))) + "vh"
        //                     }}>
        //                     <h1 className="text-center" style={{lineHeight: String(Number(document.getElementById("gameImage").style.height.split("vh")[0]) / rowsLength) + "vh"}}>{index+1}</h1>
        //                 </div>)
        //     }
        //     left--;
        //     add = Math.ceil(left/rowsLength);
        // }
        return reveal.map((piece, index) => {
            if (index===next) {
                if (left > 0) left-=add;
                if (add > 0) {
                    add = Math.ceil(left/rowsLength);
                    col = (length%rowsLength===0) ? length/rowsLength : rowsLength + add;
                }
                if ((next+col) < length) {
                    next += col;
                }
                row++;
            }
            item = (<div className="btn" key={index} style={{
                height: String(Number(document.getElementById("gameImage").style.height.split("vh")[0]) / rowsLength) + "vh", 
                width: String(Number(document.getElementById("gameImage").style.width.split("%")[0]) / col) + "%", 
                position:"absolute", 
                visibility: piece ? "hidden" : "visible", 
                backgroundColor:"white",
                left: String((Number(document.getElementById("gameImage").style.width.split("%")[0]) / col)*(index%col)) + "%",
                top: String((Number(document.getElementById("gameImage").style.height.split("vh")[0]) / rowsLength) * row) + "vh"
                }}>
                <h1 className="text-center" style={{lineHeight: String(Number(document.getElementById("gameImage").style.height.split("vh")[0]) / rowsLength) + "vh"}}>{index+1}</h1>
            </div>);
        return item})
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
                        <div className="modal-content"  style={{minHeight: "115vh"}}>
                            <div className="modal-header">
                                <h4 className="modal-title">{this.state.title}</h4>
                                <button type="button" className="close" data-dismiss="modal" onClick={(e) => this.handleClick(0,0,"leave","", e)}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Connections</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Questions</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Answers</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="hidden-tab" data-toggle="tab" href="#hidden" role="tab" aria-controls="hidden" aria-selected="false">Hidden image</a>
                                </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <h5>Connections: {this.state.connections}</h5>  
                                    <strong>Status:</strong><br/>
                                    <div className="container status">
                                        {this.state.status ? this.state.status.map((stat,index) => (<h6 key={index}>{stat}</h6>)) : ""}
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                    <br/>
                                    {/* <button type="button" className="btn btn-success float-right" onClick={(e) => this.handleClick(0,0,"next","", e)}>Next</button> */}
                                    {this.state.questions ? this.state.questions.map((each,index) => (<div key={index}>
                                        <button type="button" className="btn btn-success" onClick={(e) => this.handleClick(0,0,"next","",index,e)} style={{marginRight: "2em", fontWeight: "bold", fontSize: "1.8vw", borderRadius: "10px"}}>{index+1}</button>
                                        {this.renderSquare(each.ans, this.state.isReveal[index])}
                                        <button type="button" className="btn btn-warning float-right" onClick={() => this.reveal(index)} style={{fontSize: "1vw"}}>Reveal</button>
                                        <br/><br/>
                                    </div>)) : "Not found question list"}
                                    <br/>
                                    {this.state.questions[this.state.i] ? (
                                        <div>
                                            <h1 className="sticky-top float-right text-white">{this.state.timer} s</h1>
                                            <h3 className="text-white bg-dark" style={{padding: "1vw"}}><b>Question {this.state.i + 1} :</b><br/> {this.state.questions[this.state.i].ask}</h3>
                                        </div>
                                    ) : "Current question not found"}
                                </div>
                                <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
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
                                <div className="tab-pane fade" id="hidden" role="tabpanel" aria-labelledby="hidden-tab" style={{position: "relative"}}>
                                    <div id="gameImage" style={{height: "95vh", width: "100%", position:"absolute"}}>
                                        {this.makeCover(this.state.isReveal)}
                                    </div>
                                    <img src={this.state.image} alt="Not found, please reupload" style={{height: "95vh", width: "100%"}} /><br/>
                                </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => this.handleClick(0,0,"leave","", e)}>Close</button>
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
                        {this.state.gameList.map((game,index) => (<tr onClick={(e) => this.handleClick(game.title, game.timer,game._id,game.image, e)} data-toggle="modal" data-target="#watchGame" className="adminList" key={index}><td>{game.title}</td><td>{game.timer}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}