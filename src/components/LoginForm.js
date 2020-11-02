import React,{Component}from 'react';
import { Layout, Row, Col, Modal} from 'antd';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../styles/loginStyle.css';
import User_icon from "../asset/image/user.svg";
import Travel_planner_logo from "../asset/image/travel_planner_logo.svg";
import history from "../history";
import { Travel_Plan_BASE_URL } from '../constant';
const { Header} = Layout;

class LoginForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      login: false,
    }
  }
  
  updateUserInfo = () => {
    const userName = JSON.parse(localStorage.getItem("userInfo"));
    this.props.updateUserInfo(userName.userName);
  }
  
  render(){
    let target = null; 
    if(typeof history.location.state !== "undefined") {
      let state = history.location.state;
      if(typeof state.target !== "undefined") {
        target = history.location.state.target;
      }
    }
    
      return(
        <Layout className = 'loginWrapper'>
           <Header className="home-header">
              <Row className="row-class main-header">
                <Col span={12}>
                <Link to = "/">
                  <img
                    src={Travel_planner_logo}
                    className="app-logo"
                    alt="logo"
                  />
                </Link>
                </Col>
               
               
                <Col span={12} className="id-class"> 
                  {
                    this.state.login ? <span>Log out</span> : <span>Log in</span>
                  }
                  <img src={User_icon} className="user-icon" alt="user"/>
                </Col>
              </Row>
          </Header>
          <Layout className = "loginarea">
            <div className ='loginBox'>
            <Link to = "/">
                <span id = "close-login">&times;</span>
            </Link>
                <h3>Log in.</h3>
                <form className = 'input' ref={fm => {this.form=fm}}>
                    <input type="text" name="username" placeholder= "Username" required={true}  id = 'input1'/>
                    <input type="password" name="password" placeholder= "Password"  id = 'input2' onKeyDown={(e)=>{this.onKeyDown(e)}}/>
                </form>
  
                <div className = "button">
                  <button onClick = {() => this.login()}>Log in</button>
                </div>

        
                <p className= 'signupLink'>Don't have an account? 
                <Link to = {{ pathname: "/Registration", state: {
                  target: target === null ? "/" : target,
                  planId: history.location.state.planId === null ? null : history.location.state.planId
                   }}}>
                {/* <Link to = "/Registration"> */}
                  <span>Sign up</span>
                </Link>
                </p>
            </div>
          </Layout>
        </Layout>
      )
    }
 
  onKeyDown(event){
    // if key is enter
    if (event.keyCode === 13) {
      this.login();
    }
  }

  login(){
      const formData = new FormData(this.form);
      // console.log('username is '+ formData.get('username'));
      // console.log('username is ' + username)
      // console.log('password is ' + password)
      // console.log(history.location.state);

      //axios call
      axios.post(Travel_Plan_BASE_URL + '/login', new URLSearchParams(formData))
        .then(res => {
          
          if(res.data.responseCode === "400"){
            Modal.error({
              title: 'Wrong username or password',
              content: 'Please check your username or password and try again',
            });
          }
          else if(res.data.responseCode === "500"){
            Modal.error({
              title: 'LogIn fail. Please try again later',
              content: 'Try again',
            });
          }
          else if(res.status === 200){
            localStorage.setItem("userInfo", JSON.stringify({"userName": formData.get("username")}));
            this.updateUserInfo();
            Modal.success({
              content: "Successfully logged in!",
              onOk(){

                //localStorage.setItem("userInfo", JSON.stringify({"userName": formData.get("username")}));
                const target = history.location.state.target;

                //From Travel Schedule
                if(target.includes("/travelSchedule")) {

                  const url = Travel_Plan_BASE_URL + `/addplan`;
                  const uuid = history.location.state.planId;
                  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                  const plan = JSON.parse(localStorage.getItem(uuid));
                  plan.username = userInfo.userName;

                  // history.push("/savedRoute");

                  axios
                    .post(url, plan)
                    .then((res) => {
                      if(res.data.responseCode === "200") {
                        const city = target.split("/")[0];
                        history.push({
                          pathname: `/savedRoute`,
                          state: {
                            target: `${city}`
                          }
                        });
                        //window.location.reload();
                      }
                    })
                    .catch((error) => {
                      console.log("err in saving plan -> ", error);
                    });

                } else {

                  //Click on recommendPlans
                  if(target.includes("/recommendPlans")) {
                    
                    history.push(`/searchResult/${target}`);
                    
                  }
                  //From Search Result
                  else if(target.includes("/searchResult")) {
                    
                    history.push("/");
                    
                  } 

                  else if(target.includes("/savedRoute")) {
                    const array = target.split("/");
                    if(array.length === 3) {
                      const city = array[array.length - 1]
                      history.push({
                        pathname: `/savedRoute`,
                        state: {
                          target: `${city}`
                        }
                        
                      })
                    } else {
                      history.push(`/savedRoute`);
                    }
                    
                    
                  }

                  //From Home Page
                  else {

                    history.push("/");

                  }

                  //window.location.reload();

              }

                
              }
            })
            
            this.setState({
              login: true,
            })
            
            
        }
        }).catch((error) => {
          Modal.error({
            title: 'LogIn fail. Please try again later',
            content: 'Try again',
          });
        })      
    }
  }

export default LoginForm;

