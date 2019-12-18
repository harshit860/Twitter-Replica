import React from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'

class My extends React.Component{
    constructor(props){
        super(props)
        this.state={
                user:[]
        }
    }
    componentDidMount(){
        let token = localStorage.getItem('tok')
        Axios({
            method:"post",
            url:"http://127.0.0.1:5000/userpost",
            headers:{
                Authorization1: token
              }
        })
        .then(resp=>this.setState({
            
            user:resp.data.user_post
        })
        )
        .catch(err=>console.log(err))
    }
    render(){
        console.log(this.state)
        let disp = this.state.user.map(a=>{
            return <div className="row card-body shadow-lg mt-4 rounded">
                <div className="text-left col-xl-6">
                    <Link to={`/comments/${a[6]}`}><h5>{a[11]}</h5></Link>
                    <img style={{ height: "150px" }} src={"http://127.0.0.1:5000/" + a[8]}></img>
                    <p>{a[7]}</p>
                    <Link to={`/newcomment/${a[6]}`} >Comment</Link>
                    
                </div>
                <div className="justify-content-end col-xl-6">
                    <p>By:- {a[1]}</p>
                    <img className="rounded" style={{ height: "60px" }} src={"http://127.0.0.1:5000/" + a[5]}></img>
                </div>
                </div>
        })
        
        return(
            <div className="container rounded">
                    {disp}
            </div>
        )
    }
}
export default My