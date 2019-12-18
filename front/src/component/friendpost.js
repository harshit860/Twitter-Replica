import React from 'react'
import Axios from 'axios'
import {Link, BrowserRouter,Route} from 'react-router-dom'
import GetComment from './comment'

class Friendpost extends React.Component{
    constructor(props){
        super(props)
        this.state={
                postar:[]
        }
    }
    setme(val){
        let token = localStorage.getItem('tok')
        Axios({
            method:"post",
            url:"http://127.0.0.1:5000/friendpost",
            headers:{
                Authorization1: token,
                limit:val
              }
        })
        .then(resp=>this.setState({
            postar:resp.data.post
        }))
        .catch(err=>console.log(err))
    }
    componentDidMount(){
      this.setme()
    }
    render(){
        console.log(this.state)
        let disp = this.state.postar.map(a=>{
            return <div className="row border card-body shadow-sm col-xl-10 mt-3">
                <div className="text-left col-xl-6">
                    <Link to={`/comments/${a.post_id}`}><h5>{a.post_title}</h5></Link>
                    <img style={{ height: "150px" }} className="rounded border border-primary" src={"http://127.0.0.1:5000/" + a.post_pic}></img>
                    <p>{a.post_body}</p>
                    <Link to={`/newcomment/${a.post_id}`} >Comment</Link>
                    
                </div>
                <div className="justify-content-end col-xl-6">
                    <p>By:- {a.username}</p>
                    <img className="rounded" style={{ height: "60px" }} src={"http://127.0.0.1:5000/" + a.userimage}></img>
                </div>
                </div>
        })
        return(
            
            <div  className="container ">
                    <div>
                        <h1 className="text-left">Home</h1>
                        {disp}
                    </div>
                    <div className="row justify-content-center">
                        
                        <button className="btn btn-warning" onClick={()=>this.setme(1)}>{"1"}</button>
                        <button className="btn btn-warning" onClick={()=>this.setme(2)}>{"2"}</button>
                    </div>
                    
                </div>
            
                
        )
    }
}
export default Friendpost