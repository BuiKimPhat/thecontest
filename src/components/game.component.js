import React from 'react'
import axios from 'axios'
import Question from './question.component'

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.location.id,
            username: this.props.location.username,
            questions: [],
            play: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAnsChange = this.handleAnsChange.bind(this);
    }
    componentDidMount(){
        if (!this.state.id) {
            alert("Bạn cần phải đăng nhập để tiếp tục!");
            this.props.history.push('/login');
        }
        axios.get('http://localhost:6969/questions')
        .then(res => {
            this.setState({
                questions: res.data
            })
        })
        .catch(err => console.log(err));
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

    // Logout function
    handleSubmit(e){
        e.preventDefault();
        const user = {
            id: this.state.id,
            play: this.state.play
        }
        axios.post('http://localhost:6969/submit', user)
            .then(res => {
                alert(res.data);
                this.props.history.push('/login')
            })
            .catch(err => console.log(err));
    }
    render() {
        return(
            <div>
                <h2>Welcome {this.state.username}!</h2>
                <form method="post" onSubmit={this.handleSubmit}>
                    {this.state.questions.map((question, index) => (<Question key={index} ask={question.ask} _id={question._id} a={question.a} b={question.b} c={question.c} d={question.d} onAnsChange={this.handleAnsChange}/>))}
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}