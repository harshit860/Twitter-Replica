import React from 'react'
import Axios from 'axios'
import {Redirect} from 'react-router-dom'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
                email:'',
                password:'',
                redirect_to:false

        }
    }
    onChange(e){
        console.log(e.target.value)
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    login(){
        Axios({
            method:"post",
            url:"http://127.0.0.1:5000/login",
            data:{
                email:this.state.email,
                password:this.state.password
            }
        })
        .then(resp=> {
            return this.props.set(resp.data),
        this.setState({
            redirect_to:true
        })
        }
        )
        .catch(err=>console.log(err))
    }
    render(){
        console.log(this.props.set)
        return(
            <div className="container">
                <h3 className="text-left mt-2 text-primary font-weight-light">Welcome Login to Check feeds</h3>
            <div className="container row">
                
                <div className="col-xl-1">
                    
                    <label className="mt-3" >Email</label>
                    <label className="mt-3 bg-white" >Password</label>
                    <button className="btn btn-dark" onClick={()=>this.login()}>Login</button>
                </div>
                <div className="col-xl-3">
                    
                    <input name="email" className="mt-3 bg-white rounded" onChange={(e)=>this.onChange(e)}></input>
                    <input name="password" type="password" className="mt-3 bg-white rounded" onChange={(e)=>this.onChange(e)}></input>
                    {
                        this.state.redirect_to ? (
                            <Redirect to="/friendpost"></Redirect>
                        ):('')
                    }
                </div>
                <br></br>
               </div>
            </div>
        )
    }
}
export default Login