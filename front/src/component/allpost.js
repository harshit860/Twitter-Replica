// THis is the component to get all post 
import React from 'react'
import Axios from 'axios'
import {Link, BrowserRouter,Route} from 'react-router-dom'

class Allpost extends React.Component{
    constructor(props){
        super(props)
        this.state={
                ar:[]
        }
    }

    componentDidMount() {
        Axios({
            method: "get",
            url: "http://127.0.0.1:5000/allpost",
         
        })
            .then(resp => this.setState({
                ar:resp.data.all
            }))
            .catch(err => console.log(err))
    }

    render(){
        console.log(this.state)

        let disp = this.state.ar.map(a=>{
            return <div className="row rounded border card-body shadow-sm col-xl-10 mt-3">
            <div className="text-left col-xl-6">
                <h5>{a[11]}</h5>
                <img style={{ height: "150px" }} className="rounded border border-primary" src={"http://127.0.0.1:5000/" + a[8]}></img>
                <p>{a[7]}</p>
               
                
            </div>
            <div className="justify-content-end col-xl-6">
                <p>By:- {a[1]}</p>
                <img className="rounded" style={{ height: "60px" }} src={"http://127.0.0.1:5000/" + a[5]}></img>
            </div>
            </div>
    })
        return(
            <div  className="container ">
                <h3 className="text-left mt-2 text-primary font-weight-light">Welcome Login to Check feeds</h3>
                {disp}
            </div>
        )
    }
    
}
export default Allpost 