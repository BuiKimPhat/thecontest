import React from 'react'
import axios from 'axios'

export default class editQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            quizList: [] 
        }
    }
    componentDidMount(){
        axios.get('http://localhost:5000/questions')
            .then(res => {
                this.setState({
                    quizList: res.data
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
                        <th>Question</th>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                        <th>Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.quizList.map((quest,index) => (<tr key={index}><td>{quest._id}</td><td>{quest.ask}</td><td>{quest.a}</td><td>{quest.b}</td><td>{quest.c}</td><td>{quest.d}</td><td>{quest.ans}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}