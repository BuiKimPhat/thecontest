import React from 'react'
import axios from 'axios'

export default class editGame extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            id: this.props.location.id,
            gameList: [],
            isEdit: false,
            editid: "",
            title: "",
            timer: 0,
            form: "",
            image: "",
            uploading: "",
            active: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }
    componentDidMount(){
        this._isMounted = true;
        if (!this.state.id) {
            alert("You need to log in as admin to access this page");
            this.props.history.push({ pathname: "/login" })
        }
        if (this._isMounted) {
            if (this.state.id) {
                axios.post('http://localhost:6969/games', {id :this.state.id})
                .then(res => {
                    if (this._isMounted) {
                        this.setState({
                            gameList: res.data
                        })    
                    }
                })
                .catch(err => console.log(err));      
            }
        }
        // const script = document.createElement("script");
        // script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        // script.async = true;
        // document.body.appendChild(script);

        // this.myWidget = window.cloudinary.createUploadWidget({
        //     cloudName: 'leonardothesecond', 
        //     uploadPreset: 'contest'}, (error, result) => { 
        //       if (!error && result && result.event === "success") { 
        //         console.log('Done! Here is the image info: ', result.info); 
        //       }
        //     }
        //   )
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    handleChange(e){
        var target = e.target;
        var name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name] : value
        })    
    }
    handleSubmit(e){
        e.preventDefault();
        this.setState({uploading: "Uploading..."});
        //upload image
        // const formData = new FormData();
        // const imagefile = document.querySelector('#file');
        // formData.append("gameImage", imagefile.files[0]);
        // axios.post('http://localhost:6969/upload', formData, {
        //     headers: {
        //     'Content-Type': 'multipart/form-data'
        //     }
        // })
        //     .then(res => {
        //         axios.post('http://localhost:6969/games', {id :this.state.id})
        //         .then(res2 => {
        //             this.setState({
        //                 gameList: res2.data,
        //                 image: res.data.image
        //             })
        //         })
        //         .catch(err2 => console.log(err2));
        //     })
        //     .catch(err => console.log(err))
        const formData = new FormData();
        const imagefile = document.querySelector('#file');
        formData.append("gameImage", imagefile.files[0]);
        formData.append("id", this.state.id);
        formData.append("editid", this.state.editid);
        formData.append("title", this.state.title);
        formData.append("timer", Number(this.state.timer));
        formData.append("form", this.state.form);
        formData.append("active", this.state.active);
        var uplink;
        if (this.state.isEdit === true) uplink = "http://localhost:6969/games/edit";
        else uplink = "http://localhost:6969/games/add";
        axios.post(uplink, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log(res);
                alert(res.data.mess ? res.data.mess : res.data);
                axios.post('http://localhost:6969/games', {id :this.state.id})
                .then(res2 => {
                    console.log(res2);
                    this.setState({
                        gameList: res2.data,
                        image: res.data.image,
                        uploading: "Done!"
                    })
                })
                .catch(err2 => console.log(err2));          
            })
            .catch(err => console.log(err));
    }
    handleClick(id,title,form,timer,active,image, e){
        if (id) {
            if (id === "del") {
                let confirmDel = window.confirm("Are you sure want to delete this game?");
                if (confirmDel) {
                    axios.post("http://localhost:6969/games/delete", {id: this.state.id, editid: this.state.editid})
                        .then(res => {
                            alert(res.data);
                            axios.post('http://localhost:6969/games', {id :this.state.id})
                            .then(res2 => {
                                this.setState({
                                    gameList: res2.data
                                })
                            })
                            .catch(err2 => console.log(err2));                      
                        })
                        .catch(err => console.log(err));    
                }
            } else {
                this.setState({
                    editid: id,
                    title: title,
                    timer: timer,
                    form: form ? form : "Multi-choice",
                    active: active,
                    isEdit: true,
                    image: image,
                    uploading: ""
                });        
            }
        } else {
            this.setState({
                editid: "",
                title: "",
                form: form ? form : "Multi-choice",
                timer: 0,
                active: false,
                isEdit: false,
                image: "",
                uploading: ""
            });
        }
    }
    handleReload(){
        if (this._isMounted) {
            if (this.state.id) {
                axios.post('http://localhost:6969/games', {id :this.state.id})
                .then(res => {
                    if (this._isMounted) {
                        this.setState({
                            gameList: res.data
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
                <h2 className="container">Game</h2>
                <div className="container">
                    <button type="button" className="btn btn-success" data-toggle="modal" data-target="#addGame" onClick={(e) => this.handleClick(0, e)}>
                        Add a game
                    </button>
                    <button type="button" className="btn btn-primary float-right" onClick={this.handleReload}>
                        Reload
                    </button>
                </div>
                <br/>
                <form method="post" onSubmit={this.handleSubmit}>
                <div className="modal" id="addGame">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h4 className="modal-title">{this.state.isEdit ? "Edit game" : "Add a game"}</h4>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid form-group">
                                <label htmlFor="titleForm">Title:</label>
                                <input type="text" name="title" id="titleForm" placeholder="Game title (Không trùng với tên game khác)" className="form-control" value={this.state.title} onChange={this.handleChange} />
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="formForm">Form:</label>
                                <select id="formForm" className="form-control" name="form" value={this.state.form} onChange={this.handleChange}> 
                                    <option value="Multi-choice">Multi-choice</option>
                                    <option value="Input-text">Input-text</option>
                                </select>
                            </div>
                            <div className="container-fluid form-group">
                                <label htmlFor="timerForm">Timer <i> (leave it 0 if not use timer) </i>:</label>
                                <input type="number" min="0" name="timer" id="timerForm" className="form-control" value={this.state.timer} onChange={this.handleChange} />
                            </div>
                            {this.state.form === "Input-text" ? (
                                <div className="container-fluid form-group">
                                    {/* <button type="button" id="upload_widget" className="cloudinary-button" onClick={(e) => this.handleClick("upload")}>Upload files</button>                                 */}
                                    <input name="image" type="file" style={{display: "none"}}
                                        className="file-upload" data-cloudinary-field="image_id" id="file"
                                        data-form-data="{ 'transformation': {'crop':'limit','tags':'samples','width':3000,'height':2000}}" onChange={this.handleChange}/>
                                        <label className="btn btn-primary" htmlFor="file">Upload image</label>
                                <label htmlFor="imgUrl">Image Url:</label>
                                <input type="text" name="" id="imgUrl" placeholder="No image" className="form-control" value={this.state.image ? this.state.image : "No image"} disabled/>
                                </div>
                            ) : ""}
                            <div className="container-fluid custom-control custom-switch">
                                <input type="checkbox" name="active" checked={this.state.active} onChange={this.handleChange} className="custom-control-input" id="activeForm" />
                                <label className="custom-control-label" htmlFor="activeForm">Active </label>
                            </div>
                            {this.state.uploading ? (<div className="alert alert-primary" role="alert">
                            {this.state.uploading === "Uploading..." ? (<>{this.state.uploading}<img src="/img/loading.gif" alt="loading gif" width="35" height="35"/></>) : this.state.uploading}
                            </div>) : ""}
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
                        <th>Title</th>
                        <th>Form</th>
                        <th>Timer</th>
                        <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.gameList.map((game,index) => (<tr onClick={(e) => this.handleClick(game._id, game.title, game.form, game.timer, game.active,game.image, e)} data-toggle="modal" data-target="#addGame" className="adminList" key={index}><td>{game._id}</td><td>{game.title}</td><td>{game.form}</td><td>{game.timer}</td><td>{game.active ? "Active" : "Not active"}</td></tr>))}
                    </tbody>
                </table>
            </div>
        )
    }
}