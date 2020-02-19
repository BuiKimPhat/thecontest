import React from 'react'
import axios from 'axios'
import Question from './question.component'
import socketIOClient from 'socket.io-client'

class InputAns extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            askID: props.askID,
            ask: props.ask,
            ans: ""
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
    componentDidUpdate(prevProps) {
        if(prevProps.askID !== this.props.askID) {
            this.setState({ askID: this.props.askID, ask: this.props.ask, ans: "" });
        }
    }
    render(){
        return(
            <div className="container-fluid mt form-group">
                <label htmlFor="gameQues"><h1 className="text-center">{this.state.ask}</h1></label>
                <input type="text" name="ans" id="gameQues" placeholder="Answer" className="form-control" value={this.state.ans} onChange={this.handleChange} autoFocus/>
            </div>
        )
    }
}

export default class Game extends React.Component {
    initTime = 0;
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.location.id,
            username: this.props.location.username,
            questions: [],
            play: [],
            title: "",
            timer: 0,
            form: "",
            askID: "",
            ask: "",
            i: -1,
            wait: false
        }
        this.timeStart = 0;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAnsChange = this.handleAnsChange.bind(this);
    }
    UNSAFE_componentWillMount(){
        this.socket = socketIOClient("http://localhost:6969/liveserver");

        // On question change
        this.socket.on("adminControl", control => {
            this.setState({
                i: control.i,
                wait: false,
                timer: this.initTime
            }, () => {
                this.setState({
                    askID: this.state.questions[this.state.i]._id,
                    ask: this.state.questions[this.state.i].ask
                }, () => {
                    if (this.state.timer) {
                        this.timeStart = Date.now();
                        this.timerID = setInterval(
                            () => this.tick(),
                            1000
                        );
                    }     
                })   
            }) 
        });
    }
    componentDidMount(){
        this._isMounted = true;
        if (!this.state.id) {
            alert("Bạn cần phải đăng nhập để tiếp tục!");
            this.props.history.push('/login');
        }
        if (this._isMounted) {
            axios.post('http://localhost:6969/games', {id: this.state.id})
            .then(res => {
                if (res.data === 'Game is not active!' || res.data === "You've already done this game!") {
                    alert(res.data);
                    this.props.history.push('/login');
                } else {
                    this.setState(res.data, () => {
                        this.initTime = this.state.timer;
                        axios.post('http://localhost:6969/questions', {id: this.state.id, game: this.state.title})
                        .then(res2 => {
                            if (res2.data === 'You cannot change your answer after submission!') {
                                alert(res2.data);
                                this.props.history.push('/login');
                            } else {
                                if (this.state.form === "Input-text") {
                                    this.socket.emit('room', {room: this.state.title, name: this.state.username});
                                }
                                this.setState({
                                    questions: res2.data,
                                    wait: this.state.i < 0 ? true : false
                                }, () => {
                                    axios.post('http://localhost:6969/submit', {id: this.state.id, play: this.state.play, time: this.state.time, game: this.state.title})
                                        .then(() => console.log('Has done questions!'))
                                        .catch(err3 => console.log(err3));
                                    if (this.state.questions[this.state.i]) {
                                        this.setState({
                                            askID: this.state.questions[this.state.i]._id,
                                            ask: this.state.questions[this.state.i].ask
                                        })    
                                    }
                                    if (this.state.timer && !this.state.wait) {
                                        this.timeStart = Date.now();
                                        this.timerID = setInterval(
                                            () => this.tick(),
                                            1000
                                        );
                                    }             
                                })    
                            }
                        })
                        .catch(err2 => console.log(err2));
                    });    
                }
            })
            .catch(err => console.log(err));    
        }
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
        this.socket.emit("leaveroom", {room: this.state.title, name: this.state.username});
        this.socket.close();
        this._isMounted = false;
    }
    tick(){
        if (this.state.timer < 1) this.handleSubmit();
        else {
            this.setState({
                timer: this.state.timer - 1
            });    
        }
    }
    handleAnsChange(eachAns){
        if (eachAns && this.state){
            this.setState(prevState => {
                // let now = prevState.play.filter(el => el.askID === eachAns.askID).length;
                // if (!now) {
                //     return ({ 
                //         play: [...prevState.play, eachAns] 
                //     })
                // }
                // return ({ 
                //     play: prevState.play.map(el => el.askID === eachAns.askID ? eachAns : el) 
                // })
                let now = prevState.play;
                if (!now) {
                    return ({ 
                        play: new Array(this.state.questions.length).fill("") 
                    })
                }
                now[this.state.i] = eachAns;
                return ({ 
                    play: now 
                })
            })
        }
    }

    // Logout function
    handleSubmit(e){
        if (e) e.preventDefault();
        const rightNow = (Date.now() - this.timeStart)/1000;
        const user = {
            id: this.state.id,
            game: this.state.title,
            time: this.state.form === "Multi-choice" ? (this.initTime - this.state.timer) : (rightNow > this.initTime ? this.initTime : rightNow),
            play: this.state.play
        }
        if (this.state.form === "Multi-choice") {
            axios.post('http://localhost:6969/submit', user)
                .then(res => {
                    alert(res.data);
                    this.props.history.push('/login')
                })
                .catch(err => console.log(err));
        } else {
            if (!this.state.wait) {
                clearInterval(this.timerID);
                this.setState({timer: this.initTime, wait: true});
                this.socket.emit('liveSubmit', {name: this.state.username, time: user.time, ans: this.state.play[this.state.i] ? this.state.play[this.state.i].ans : ""}); 
                console.log({name: this.state.username, time: user.time, ans: this.state.play[this.state.i] ? this.state.play[this.state.i].ans : ""})  
            }
            if (this.state.i === (this.state.questions.length - 1)) {
                axios.post('http://localhost:6969/submit', user)
                .then(res => {
                    alert(res.data);
                    this.props.history.push('/login')
                })
                .catch(err => console.log(err));
            }
        }
    }
    handleChange(e){
        var target = e.target;
        var value = target.value;
        var name = target.name;
        this.setState({
            [name] : value
        })
    }
    render() {
        return(
            <div className="container">
                <div className="alert alert-danger alert-dismissible">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    <strong>Lưu ý!</strong>  Đây là trang game. Vì lí do bảo mật, tuyệt đối <b>không sử dụng nút Refresh, Forward, Back</b> trên trình duyệt hoặc thoát ra giữa game. Khi đó sẽ tính là bạn không nộp gì cả và không được làm bài lại.
                </div>
                <h2>Welcome {this.state.username}!</h2><h1 className="sticky-top float-right">{this.state.timer} s</h1>
                <hr className="w-75"/>
                <form method="post" onSubmit={this.handleSubmit}>
                    {this.state.form === "Multi-choice" ? (this.state.questions.map((question, index) => (<Question key={index} ask={question.ask} _id={question._id} a={question.a} b={question.b} c={question.c} d={question.d} onAnsChange={this.handleAnsChange}/>))) : (<InputAns askID={this.state.askID} onAnsChange={this.handleAnsChange} ask={this.state.ask}/>)}
                    <input type="submit" className="btn btn-success" value="Submit" />
                </form>
                {this.state.wait ? (<div className="alert alert-success"><strong>Waiting for response...</strong></div>) : ""}
            </div>
        )
    }
}