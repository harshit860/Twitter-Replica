import React from 'react';
import Axios from 'axios'
import './App.css';
import { BrowserRouter, Link, Route, Redirect } from 'react-router-dom'
import Register from './component/Register';
import Login from './component/Login';
import Post from './component/post.js';
import Friendpost from './component/friendpost';
import GetComment from './component/comment';
import Newcomment from './component/newcomment';
import Follow from './component/follow';
import My from './component/mypost';
import Allpost from './component/allpost';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      profile: '',
      flag: false,
      loginflag: false,
      change: false,
      pic: ''
    }
  }


  setuser(val) {
    console.log(val.token)
    localStorage.setItem('tok', val.token)

    this.setState({
      username: val.username,
      profile: val.picture,
      flag: true

    })
  }


  componentDidMount() {
    let token = localStorage.getItem('tok')
    Axios({
      method: "get",
      url: "http://127.0.0.1:5000/retain",
      headers: {
        Authorization1: token
      }
    })
      .then(resp => this.setState({
        username: resp.data.username,
        profile: resp.data.picture,
        flag: true
      }))
      .catch(err => console.log(err))
  }
  logout() {
    localStorage.removeItem('tok')
    this.setState({
      loginflag: true,
      flag: false
    })


  }

  changeprofile() {
    console.log(this.state)
    var formdata = new FormData()
    formdata.append('picture', this.state.pic)
    let token = localStorage.getItem('tok')
    Axios({
      method: "post",
      url: "http://127.0.0.1:5000/profile",
      headers: {
        Authorization1: token
      },
      data: formdata
    })
      .then(resp => this.setState({
        change: false
      }))
  }

  changepic(e) {
    this.setState({
      pic: e.target.files[0]
    })
  }
  render() {
    console.log(this.state)
    return (
      <BrowserRouter>
        <div className="App">
          <div className="bg-white shadow-lg border text-primary  row">

            {this.state.flag ? (
              <div className="container justify-content-around mt-3 col-xl-12 row">
                <Link to="/allpost" className="mr-4   "><img src="https://image.flaticon.com/icons/png/512/145/145812.png" className="offset-1" style={{ height: "30px" }}></img></Link>
                {/* <img src="https://image.flaticon.com/icons/png/512/145/145812.png" className="offset-1" style={{height:"30px"}}></img> */}
                <Link to="/friendpost" className="text-primary "><h5>Home</h5></Link>
                <Link to="/new" className=" text-dark"><h5>Tweet</h5></Link>
                <Link to="my" className=" text-dark"><h5>MyPost</h5></Link>
                <Link to="/follow" className="text-dark"><h5>Follow</h5></Link>
                {/* <input className="md-5 rounded-pill text-center" placeholder="Search Twitter"></input> */}
                <p className="justify-content-end"><h5>Welcome: {this.state.username}</h5></p>
                <img className="rounded" style={{ height: "50px" }} src={"http://127.0.0.1:5000/" + this.state.profile}></img>
                <button className="btn btn-primary p-3" onClick={() => {
                  this.setState({
                    change: true
                  })
                }}><img src="https://image.flaticon.com/icons/png/512/2/2066.png" height={"17px"} ></img></button>

                <button className="btn text-danger" onClick={() => this.logout()}><h5>Logout</h5></button>

              </div>

            ) : (
                <div className="container-fluid row">
                  <Link to="/allpost" className="mr-4 offset-2"><img src="https://image.flaticon.com/icons/png/512/145/145812.png" className="offset-1" style={{ height: "30px" }}></img></Link>
                  <Link to="/register" className=" mr-3"><h5>Register</h5></Link>
                  <Link to="/login" className=" mr-3"><h5>Login</h5></Link>
                </div>

              )}

          </div>
          <div>
            {this.state.change ? (
              <React.Fragment>
                <input type="file" className="mt-3" onChange={(e) => this.changepic(e)}></input>
                <button className="btn btn-primary mt-3 " onClick={() => this.changeprofile()}>Upload</button>
              </React.Fragment>

            ) : (<Redirect to="/allpost" ></Redirect>)}
            <Route path="/register" component={Register} ></Route>
            <Route path="/my" component={My}></Route>
            <Route path="/new" component={Post}></Route>
            <Route path="/friendpost" component={Friendpost} ></Route>
            <Route path="/comments/:id" component={GetComment} ></Route>
            <Route path="/newcomment/:id" component={Newcomment} ></Route>
            <Route path="/follow" component={Follow} ></Route>
            <Route path="/login" render={() => <Login set={(r) => this.setuser(r)} />}></Route>
            <Route path="/allpost" component={Allpost} ></Route>
            {this.state.loginflag ? (
              <Redirect to="/login" ></Redirect>
            ) : (<div></div>)}

          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
