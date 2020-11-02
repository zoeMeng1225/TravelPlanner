import React, {Component} from 'react';
import { Menu, Col, Row, SubMenu } from 'antd';
import {Link} from 'react-router-dom';
import Travel_planner_logo from '../asset/image/travel_planner_logo.svg';
import User_icon from "../asset/image/user.svg";
import "../styles/Registration.css";

class RegistrationHeader extends Component{

    render(){
        return (
            <div className = "deletePadding">
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
                <Link to = "/login">
                  <span className ="rigiSpan">Sign in</span>
                </Link>
                  <img src={User_icon} className="user-icon" alt="user" />
                </Col>
              </Row>
          </div>
        )
    }
}

export default RegistrationHeader;