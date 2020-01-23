import React from 'react'

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            askID: props._id,
            ans: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {
        const target = e.target;
        const value = target.checked ? target.value : 0;
        this.setState({
            ans: value
        }, () => {
            this.props.onAnsChange(this.state);
        })
    }
    render(){
        return(
            <div>
                <h4>{this.props.ask}</h4>
                <input type="radio" name={this.props._id} value="a" id={this.props._id + "a"} onChange={this.handleChange}/><label htmlFor={this.props._id + "a"}>{this.props.a}</label><br />
                <input type="radio" name={this.props._id} value="b" id={this.props._id + "b"} onChange={this.handleChange}/><label htmlFor={this.props._id + "b"}>{this.props.b}</label><br />
                <input type="radio" name={this.props._id} value="c" id={this.props._id + "c"} onChange={this.handleChange}/><label htmlFor={this.props._id + "c"}>{this.props.c}</label><br />
                <input type="radio" name={this.props._id} value="d" id={this.props._id + "d"} onChange={this.handleChange}/><label htmlFor={this.props._id + "d"}>{this.props.d}</label><br />
            </div>    
        )
    }
}