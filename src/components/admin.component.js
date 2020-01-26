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
                    <strong>Lưu ý!</strong>  Đây là trang admin. Vì lí do bảo mật, <b>hạn chế sử dụng nút Refresh, Forward, Back</b> trên trình duyệt. Khi đó sẽ phải đăng nhập lại để sử dụng tính năng admin. Nếu muốn reload, hãy <b>dùng nút Reload</b> có sẵn.
                </div>
                <h2>Welcome {this.state.username}!</h2><br />
                <button className="btn btn-warning" value="Users" onClick={this.handleClick}>Users</button>	&nbsp; &nbsp;
                <button className="btn btn-warning" value="Quiz" onClick={this.handleClick}>Questions</button>
                <a href="/login" className="btn btn-primary float-right">Log out</a>
                <hr/>
            </div>
        )
    }
}