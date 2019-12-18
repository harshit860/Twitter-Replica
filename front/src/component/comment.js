import React from 'react'
import Axios from 'axios'

class GetComment extends React.Component{
    constructor(props){
        super(props)
        this.state={
                comments:[]
        }
    }
    componentDidMount(){
        let token = localStorage.getItem('tok')
        Axios({
            method:"post",
            url:"http://127.0.0.1:5000/showcomments",
            data:  {
                    post_id:this.props.match.params.id
            },
            headers:{
                Authorization1: token
              }
        })
        .then(resp=>this.setState({
            comments:resp.data.comments})
        )
        .catch(err=>console.log(err))
    }
    render(){
        console.log(this.props.match.params.id)
        console.log(this.state)
        let disp  =this.state.comments.map(a=>{
            return <div className="row shadow-sm card-body">
                <div className="col-xl-3">{a[0]}</div>
                <div>By:-{a[1]}</div>

            </div>
        })
        return(
            <div className=" container">
                {disp}
            </div>
        )
    }
}
export default GetComment