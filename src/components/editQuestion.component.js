import React from 'react'
import axios from 'axios'

export default class editQuiz extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            quizList: [],
            isEdit: false,
            editid: "",
            ask: "",
            a: "",
            b: "",
            c: "",
            d: "",
            ans: ""    
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
        this._isMounted = true;
        if (!this.state.id) {
            alert("You need to log in as admin to access this page");
            this.props.history.push({ pathname: "/login" })
        }
        if (this._isMounted) {
            if (this.state.id) {
                axios.post('http://localhost:6969/questions', {id :this.state.id})
                .then(res => {
                    if (this._isMounted) {
                        this.setState({
                            quizList: res.data
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
            ask: this.state.ask,
            a: this.state.a,
            b: this.state.b,
            c: this.state.c,
            d: this.state.d,
            ans: this.state.ans,
        }
        var uplink;
        if (this.state.isEdit === true) uplink = "http://localhost:6969/questions/edit";
        else uplink = "http://localhost:6969/questions/add";
        axios.post(uplink, update)
            .then(res => {
                alert(res.data);
                axios.post('http://localhost:6969/questions', {id :this.state.id})
                .then(res2 => {
                    this.setState({
                        quizList: res2.data
                    })
                })
                .catch(err => console.log(err));          
            })
            .catch(err => console.log(err));
    }
    handleClick(id,ask,a,b,c,d,ans, e){
        if (id) {
            if (id === "del") {
                let confirmDel = window.confirm("Are you sure want to delete this question?");
                if (confirmDel) {
                    axios.post("http://localhost:6969/questions/delete", {id: this.state.id, editid: this.state.editid})
                        .then(res => {
                            alert(res.data);
                            axios.post('http://localhost:6969/questions', {id :this.state.id})
                            .then(res2 => {
                                this.setState({
                                    quizList: res2.data
                                })
                            })
                            .catch(err => console.log(err));                      
                        })
                        .catch(err => console.log(err));    
                }
            } else {
                this.setState({
                    editid: id,
                    ask: ask,
                    a: a,
                    b: b,
                    c: c,
                    d: d,
                    ans: ans ? ans : "a",
                    isEdit: true
                })        
            }
        } else {
            this.setState({
                editid: "",
                ask: "",
                a: "",
                b: "",
                c: "",
                d: "",
                ans: "",
                isEdit: false
            })
        }
    }
    render(){
        return(
            <div className="container-fluid">
                <div className="container">
                    <button type="button" className="btn btn-success" data-toggle="modal" data-target="#addQues" onClick={(e) => this.handleClick(0, e)}>
                        Add a question
                    </button>
                </div>
                <br/>
                <form method="post" onSubmit={this.handleSubmit}>
                <div className="modal" id="addQues">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h4 className="modal-title">{this.state.isEdit ? "Edit question" : "Add a question"}</h4>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid form-group">
                                <label htmlFor="askForm">Question:</label>
                                <input type="text" name="ask" id="askForm" placeholder="Question" className="form-control" value={this.state.ask} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="AForm">A:</label>
                                <input type="text" name="a" id="AForm" placeholder="Option A" className="form-control" value={this.state.a} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="BForm">B:</label>
                                <input type="text" name="b" id="BForm" placeholder="Option B" className="form-control" value={this.state.b} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="CForm">C:</label>
                                <input type="text" name="c" id="CForm" placeholder="Option C" className="form-control" value={this.state.c} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="DForm">D:</label>
                                <input type="text" name="d" id="DForm" placeholder="Option D" className="form-control" value={this.state.d} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="ansForm">Answer:</label>
                                <select id="ansForm" className="form-control" name="ans" value={this.state.ans} onChange={this.handleChange}> 
                                    <option value="a">A</option>
                                    <option value="b">B</option>
                                    <option value="c">C</option>
                                    <option value="d">D</option>
                                </select>
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
                        <th>Question</th>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                        <th>Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.quizList.map((quest,index) => (<tr onClick={(e) => this.handleClick(quest._id, quest.ask ? quest.ask : "", quest.a ? quest.a : "", quest.b ? quest.b : "", quest.c ? quest.c : "", quest.d ? quest.d : "", quest.ans ? quest.ans : "", e)} data-toggle="modal" data-target="#addQues" className="adminList" key={index}><td>{quest._id}</td><td>{quest.ask}</td><td>{quest.a}</td><td>{quest.b}</td><td>{quest.c}</td><td>{quest.d}</td><td>{quest.ans}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}