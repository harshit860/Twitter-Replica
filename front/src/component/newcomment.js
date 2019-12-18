import React from 'react'
import Axios from 'axios'

class Newcomment extends React.Component{
    constructor(props){
        super(props)
        this.state={
            comment:''
        }
    }
    handleChange(e){
        this.setState({
            comment:e.target.value
        })
    }
    comment(){
        let token = localStorage.getItem('tok')
        console.log(this.state)
        Axios({
            method:"post",
            url:"http://127.0.0.1:5000/comment",
            data:{
                post_id:this.props.match.params.id,
                comment:this.state.comment
            },
            headers:{
                Authorization1: token
              }
        }).then(resp=>console.log(resp))
        .catch(err=>console.log(err))
    }
    render(){
        console.log(this.props.match.params.id)
        console.log(this.state)
        return(
            <div className="justify-content-start mt-4">
                <div className="container">
                    <label className="col-xl-12">Comment_body</label>
                    <textarea  style={{height:"200px",width:"400px"}} onChange={(e)=>this.handleChange(e)}></textarea>
                    <br></br>
                    <button className="btn btn-dark mt-3" onClick={()=>this.comment()}>Comment</button>
                </div>
            </div>
        )
    }
}
export default Newcomment