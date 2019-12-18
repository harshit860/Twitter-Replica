import React from 'react'
import Axios from 'axios'

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
                username:'',
                email:'',
                password:'',
                profile:''

        }
    }
    onChangetext(e){
            console.log(e.target.value)
            this.setState({
                [e.target.name]:e.target.value
            })
    }
    onChangepic(e){
        console.log(e.target.files[0])
        this.setState({
            [e.target.name]:e.target.files[0]
        })
    }
    register(){
        const formdata = new FormData()
        formdata.append('picture',this.state.profile)
        formdata.append('username',this.state.username)
        formdata.append('password',this.state.password)
        formdata.append('email',this.state.email)
        
        Axios({
            method:'post',
            url:"http://127.0.0.1:5000/register",
            data:formdata
        })
        .then(resp=> console.log(resp))
        .catch(err=>console.log(err))
    }
    render(){
        return(
            <div>
                <div className="col-xl-4 container justify-content-left text-left">
                    <div className="">
                        <label>Username</label>
                        <input placeholder="username" name="username" onChange={(e) => this.onChangetext(e)}></input>
                    </div>
                    <div>
                        <label>Email</label>
                        <input placeholder="email" name="email" onChange={(e) => this.onChangetext(e)}></input>
                    </div>
                    <div>
                        <label>Password</label>
                        <input placeholder="passw***" name="password" onChange={(e) => this.onChangetext(e)} type="password"></input>
                    </div>
                    <div>
                        <label>Profilepicture(Choose from disk)</label>
                        <input placeholder="select the file" name="profile" onChange={(e) => this.onChangepic(e)} type="file"></input>
                    </div>
                    <div className="col-xl-1 offset-4">
                        <button onClick={() => this.register()} className="mt-3 btn btn-dark">Register</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default Register