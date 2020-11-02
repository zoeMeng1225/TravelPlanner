import React, { Component } from 'react';
import "../styles/Registration.css";
import {Link} from 'react-router-dom';
import { Form, Input,Modal } from 'antd';
import Axios from 'axios';
import RegistrationHeader from './RegistrationHeader';
import { Travel_Plan_BASE_URL } from '../constant';
import history from "../history";


const layout = {
    labelCol: {
      span: 40,
    },
    wrapperCol: {
      span: 40,
    },
  };

class Registration extends Component{

    constructor(){
        super();
        this.state = {
            password: "",
            email: "",
            isValidPassword: false,
            userExistVisible: false
        }
    }

    showInvalidPassword = e => {
        Modal.error({
            title: 'Unmatch password',
            content: 'Unmatch password and confirm password. Please try again',
          });
    }

    checkValidPassword = (values) => {
        if(values.password==values.confirm){
            this.setState({
                isValidPassword: true
            })
        }else{
            this.setState({
                isValidPassword: false
            })
        }
    }


    onFinishing = (values) => {
        this.checkValidPassword(values);
         if(this.state.isValidPassword){
            Axios.post(
                Travel_Plan_BASE_URL + '/registration',
                 {
                  username: values.email,
                  password: values.password,
                }
            ).then(function(response){
                // Show successful
                if(response.data.responseCode === "200"){
                    Modal.success({
                        content: "Congratulations! Successfully registered! Welcome to join us!"
                    })
                    history.push({pathname: `/login`, 
                    state: {
                        target: history.location.state.target,
                        planId: history.location.state.planId !== null ? history.location.state.planId : null
                    }});
                }

                // Show username duplicate
                if(response.data.responseCode === "409"){
                    Modal.error({
                        title: 'Unable to create an account',
                        content: 'The user name has already existed. Please use another user name',
                    });
                }

                if(response.data.responseCode === "500"){
                    Modal.error({
                        title: 'Unable to create an account',
                        content: 'Please try again later',
                    });
                }

            }).catch(function(e){
                Modal.error({
                    title: 'Connection fail',
                    content: 'Fail to register!',
                  });
            }).then(function(response){

            });
         }else{
             this.showInvalidPassword();
         }

    }

    render(){
        return (
            <div className="">
                <RegistrationHeader />
                <div className="registerarea">
          
                    <Form {...layout} ref={this.formRef} name="control-ref" className="registerBox" onFinish={this.onFinishing}>
                        <Link to = "/">
                          <span id = "close-login">&times;</span>
                        </Link>
                        <h3 className="boxHeader"> Register.</h3>

                        <Form.Item name="email" rules={[{required: true, message: 'Username should not be empty!'}]} className="regiForm">
                            <Input placeholder="Username" className="regiInput" id = "input1"/>
                        </Form.Item>

                        <Form.Item name="password" rules={[{required: true, message: 'Password should not be empty!'}]} className="regiForm">
                            <Input.Password placeholder="Password" className="regiInput" id = "input2" style={{width: "100%"}}/>
                        </Form.Item>

                        <Form.Item name="confirm" rules={[{required: true, message: 'Confirmed password should not be empty!'}]} className="regiForm">
                            <Input.Password placeholder="Confirm password" style={{width: "100%"} } id = "input3" className="regiInput"/>
                        </Form.Item>
                       
                      
                      <div className = "button">
                        <button type="primary" htmlType="submit" onClick={this.onFinish}  className="button button2"> 
                            Join Us
                        </button>
                      </div>
  
                    </Form>
                </div>
            </div>            
        );
    }
}

export default Registration;