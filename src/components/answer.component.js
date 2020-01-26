import React from 'react'

export default class Answer extends React.Component {
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
            <div className="col-md-4">
                <p>{this.state.askID} :</p>
                <select name="ans" className="form-control" value={this.state.ans} onChange={this.handleChange}> 
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                </select>
            </div>
        )
    }
}