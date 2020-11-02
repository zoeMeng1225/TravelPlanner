import React, { Component } from "react";
import Main from "./components/Main";
import SearchResult from "./components/SearchResult";
import LoginForm from "./components/LoginForm";
import SavedPlans from "./components/SavedPlans";
import Registration from "./components/Registration";
import Travel_planner_logo from "./asset/image/travel_planner_logo.svg";
import User_icon from "./asset/image/user.svg";
import { Layout, Row, Col, Button} from "antd";
import "./App.css";
import { BrowserRouter, Route, Router, Switch, Link } from "react-router-dom";
import history from './history';

const { Header, Content } = Layout;

class App extends Component {
  state={
    userName: null
    // user: {
    //   //userName: "Peter"
    //   userName: null
    // }
  }

  updateUserInfo = (userName) => {
    this.setState({
      userName: userName,
    })
  }

  //* check if user loged in
  checkLoggedIn = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? "" : "Log In";
  }

  handleLogButtonClick = e => {
    this.setState({ current: e.currentTarget.id });
    // handle login and logout differently
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      localStorage.clear();
    }
    //history.push(`/login`);

    history.push({
      pathname: `/login`,
      state: {
        target: "/"
      }
    });
};


  // componentDidMount() {
  //   const userName = JSON.parse(localStorage.getItem("userName"));
  //   this.setState({
  //     userName: userName === null ? null : userName.userName
  //   })
  // }


  render() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    return (
      <BrowserRouter>
        <Router history={history}>
          <Switch>
            <Route exact path="/">
              <Layout>
                <Header className="home-header">
                  <Row className="row-class">
                    <Col span={16}>
                      <img
                        src={Travel_planner_logo}
                        className="app-logo"
                        alt="logo"
                      />
                    </Col>
                    <Col span={8} className="id-class">
                      <span id = "headner-hello1">Hi ! </span>
                      <div>{userInfo === null ? '' : userInfo.userName}</div>
                      {/* <div>{this.state.userName === null ? '' : this.state.userName}</div> */}
                      {/* <Divider type="vertical"/> */}
                      <span id ="headner-span">|</span>
                      <Button type="link" onClick={this.handleLogButtonClick} className="logButton" >
                            {/* {this.state.userName === null ? 'Sign In' : 'Sign Out'} */}
                            {userInfo === null  ? 'Log In' : 'Log Out'}
                      </Button>
                      <img src={User_icon} className="user-icon" alt="user" />
                    </Col>
                  </Row>
                </Header>
                <Content>
                  <Main />
                </Content>
              </Layout>
            </Route>
            <Route path="/searchResult/:city" component={SearchResult} />
            {/* <Route path='/login' component={LoginForm} /> */}
            <Route path='/login' render = {(props) => <LoginForm {...props} updateUserInfo={this.updateUserInfo} />} />
            <Route path='/savedRoute' component={SavedPlans} />
            <Route path='/registration' component={Registration}/>
          </Switch>
        </Router>
      </BrowserRouter>
    );
  }
}

export default App;
