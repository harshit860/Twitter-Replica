import React from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'

class Follow extends React.Component{
    constructor(props){
        super(props)
        this.state={
                users:[]
        }
    }
    componentDidMount(){
        Axios({
            method:"get",
            url:"http://127.0.0.1:5000/alluser"
        })
        .then(resp=>this.setState({
            users:resp.data.users
        })
        )
        .catch(err=>console.log(err))
    }
    follow(val){
        let token = localStorage.getItem('tok')
        console.log(val)
        Axios({
            method:"post",
            url:"http://127.0.0.1:5000/follow",
            headers:{
                Authorization1: token
              },
            data:{
                friend_id:val
            }

        })
        .then(resp=>alert("you followed "+resp.data.follow[0][1]))
        .catch(err=>console.log(err))
    }
    render(){
        console.log(this.state)
        let disp = this.state.users.map(a=>{
            return <div className="mt-5 border shadow-lg rounded">
                <p className="col-xl-12">{a[1 ]}</p>
                <img style={{ height: "100px" }} src={"http://127.0.0.1:5000/" + a[5]}></img>
                <br></br>
                <button onClick={()=>this.follow(a[0])} className="btn btn-warning mt-2">Follow</button>
            </div>
        })
        return(
            <div>
                <h1 className="display-4">Registered Users</h1>
                <div className=" col-xl-2">
                    {disp}  
                </div>
                    
            </div>
        )
    }
}
export default Follow