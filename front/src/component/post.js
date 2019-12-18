import React from 'react'
import Axios from 'axios'

class Post extends React.Component{
    constructor(props){
        super(props)
        this.state={
            posttitle:'',
            postbody:'',
            picture:''
        }
    }
    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    pic(e){
        this.setState({
                picture:e.target.files[0]
        })
    }

    post(){
        const formdata = new FormData()
        formdata.append('picture',this.state.picture)
        formdata.append('postbody',this.state.postbody)
        formdata.append('posttitle',this.state.posttitle)
        let token = localStorage.getItem('tok')
        
        Axios({
            method:'post',
            url:"http://127.0.0.1:5000/post",
            data:formdata,
            headers:{
                Authorization1: token
              }
        })
        .then(resp=> console.log(resp))
        .catch(err=>console.log(err))
    }

    render(){
        return(
            <div>
                <div className="container mt-5"></div>
                <h1 className="text-primary">Tweet Your Thoughts</h1>
                <label className="col-xl-12 ">Post Title</label>
                <textarea className="col-xl-5 border border-primary rounded" style={{height:"30px"}} name="posttitle" onChange={(e)=>this.onChange(e)}></textarea>
                <br></br>
                <label className="col-xl-12">Post Body</label>
                <textarea className="col-xl-5 border border-primary rounded" name="postbody" style={{height:"250px"}}  onChange={(e)=>this.onChange(e)}></textarea>
                <label className="col-xl-12">Add Image</label>
                <input type="file" onChange={(e)=>this.pic(e)}></input>
                <br></br>
                <button className="mt-3 btn btn-primary " onClick={()=>this.post()}>Post It!</button>
            </div>
        )
    }
}
export default Post