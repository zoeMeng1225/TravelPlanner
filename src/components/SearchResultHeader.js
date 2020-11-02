import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Menu, Row, Col, Divider, Button} from 'antd';
import { BarsOutlined, UserOutlined } from '@ant-design/icons';
import backSearch from '../asset/image/seach.svg';
import Travel_planner_logo from '../asset/image/travel_planner_logo.svg';
import '../styles/SearchResultHeader.css';
import history from "../history";
import User_icon from "../asset/image/user.svg";

const { SubMenu } = Menu;
class SearchResultHeader extends Component{
    state = {
        cityName: "New York",
        current: 'searchResult',
        userName: null,
    };
    
    handleMenuClick = e => {
        console.log(`/${e.key}`);
        this.setState({ current: e.key });
        if (e.key === "logOut") {
          localStorage.clear();
          history.push(`/login`);
        } else if (e.key === "savedRoute") {
          const username = JSON.parse(localStorage.getItem('userInfo'));
          if (username !== null) {
            history.push({
              pathname: `/savedRoute`,
              state: {
                target: `${this.props.cityName}`,
              }
            });
          } else {
            history.push({
              pathname: `/login`,
              state: {
                target: `/savedRoute/${this.props.cityName}`,
              }
            });
          }
        } else {
          history.push(`/${e.key}`);
        }
    };


    handleLogButtonClick = e => {
      this.setState({ current: e.currentTarget.id });
      // handle login and logout differently
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        localStorage.clear();
        
      }
      history.push({
        pathname: `/login`,
        state: {
          target: `/searchResult/${this.props.cityName}`,

        }
      });
      window.location.reload();
  };

  // componentDidMount() {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   this.setState({
  //     userName: userInfo === null ? null : userInfo.userName
  //   })
  // }

    render(){
        const { current } = this.state;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return(
            <div>
              <Row className = "header-row">
                <Col span= {8} className = "header-col">
                  <Menu className="nav-search" onClick={this.handleMenuClick} selectedKeys={[current]} mode="horizontal">
                      <SubMenu className="drop-down humIcon" icon={<BarsOutlined style={{fontSize: "26px", color: "#353535"}}/>}>
                          <Menu.Item key="savedRoute">Saved Plans</Menu.Item>
                          {/* <Menu.Item key="markedPoints">Marked Points History</Menu.Item>
                          <Menu.Item key="recommendation">Recommendation Routes</Menu.Item> */}
                      </SubMenu>
                    </Menu>
                    <Link to = "/">
                    <div className = "backSearch">
                      <span><img src= {backSearch} alt="back" /></span>
                      <p>Back to search</p>
                    </div>
                    </Link>
                </Col>
                <Col span= {8}>
                  <a href="/"><img src= {Travel_planner_logo} alt="logo" className = "logo2"/></a>
                </Col>
                <Col span= {8}  className="id-class">
                  <span id = "headner-hello1">Hi ! </span>
                  <div>{userInfo === null ? '' : userInfo.userName}</div>
                  {/* <Divider type="vertical"/> */}
                  <span id ="headner-span">|</span>
                  <Button type="link" onClick={this.handleLogButtonClick} className="logButton">
                    {userInfo === null ? 'Log In' : 'Log Out'}</Button>
                  <img src={User_icon} className="user-icon" alt="user" />
                </Col>
              </Row>
          </div>
        );
    }
}

export default SearchResultHeader;