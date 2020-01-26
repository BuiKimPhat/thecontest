import React from 'react'

export default class Admin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            username: this.props.location.username,
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e){
        var value = e.target.value;
        if (value === "Users") this.props.history.push({pathname: '/admin/users', id: this.state.id});
        else this.props.history.push({pathname: '/admin/questions', id: this.state.id});
    }
    render(){
        return(
            <div className="container">
                <div className="alert alert-warning alert-dismissible">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    <strong>Lưu ý!</strong>  Đây là trang admin. Vì lí do bảo mật, <b>hạn chế Reload</b> trang admin hoặc sử dụng nút <b>Forward, Back</b> trên trang này. Khi đó sẽ phải đăng nhập lại để sử dụng tính năng admin.
                </div>
                <h2>Welcome {this.state.username}!</h2><br />
                <button className="btn btn-warning" value="Users" onClick={this.handleClick}>Users</button>
                <button className="btn btn-warning" value="Quiz" onClick={this.handleClick}>Questions</button>
                <a href="/login" className="btn btn-primary float-right">Log out</a>
                <hr/>
            </div>
        )
    }
}