import React, { Component } from 'react';
import { Table, Space,Tabs,Button, Timeline } from 'antd';
//import Modal from 'antd/lib/modal/Modal';
import axios from "axios";
import { Travel_Plan_BASE_URL } from "../constant";
import history from "../history";
import { Modal } from 'antd';

const { TabPane } = Tabs;

class RecommendPlanList extends Component {
    state = {
      modalVisible: false,
      selectedPlanName: "",
      selectedPlanDetail: [],
      isSaved: false,
      saveStatus: "Save",
      recommendPlanList: [],
    };

    setModalVisible(modalVisible) {
      this.setState({ modalVisible });
      
    }

    setPlanDetail = (routes) =>{
      this.setState( {selectedPlanDetail: routes });
    }

    setPlanName = (planName) =>{
      this.setState({selectedPlanName: planName});
    }
    

    columns= [
        {
          title: 'Name',
          dataIndex: 'name',
          width: '40%',
        },
        {
          title: 'Days',
          dataIndex: 'days',
          width: '5%',
          sorter: (a, b) => a.days - b.days,
        },
        {
          title: 'Actions',
          key: 'action',
          width: '55%',
          render: (record) => (
            <Space size="middle">
              <Button onClick={() => {
                this.setModalVisible(true);
                this.setPlanDetail(record.planDetail);
                this.setPlanName(record.name);
                }}>
                Details
              </Button>
              <Button onClick={()=>{
                this.props.showOnMap(record.planDetail);
              }}>Show on map</Button>
              <Button 
                disabled = {this.state.isSaved}
                onClick = {()=>{
                  //take care!! check whether record.key is planid in planList when integration
                  const username = JSON.parse(localStorage.getItem('userInfo')).userName;
                  const url = Travel_Plan_BASE_URL + `/saverecommendedplan?username=${username}&planid=${record.key}`
                  axios
                    .post(url)
                    .then((res) => {
                      if(res.data.responseCode === "200"){
                        this.setState({
                          isSaved: true,
                          saveStatus: "Saved"
                        });
                        history.push({pathname: '/savedRoute', state: {target: this.props.cityName}});
                      } else if(res.data.responseCode === "500"){
                        Modal.error({
                          Title: 'An error occurred! Try it again.'
                        })
                      }
                    })
                    .catch((error) =>{
                      console.log(error)
                    })
                }}>{this.state.saveStatus}</Button>
            </Space>
          )
        },
      ];

    componentDidMount() {
      const username = JSON.parse(localStorage.getItem('userInfo')).userName;
      const cityname = this.props.cityName;
      //how to define cityid? Make a change in back end URL from cityid to cityname
      const url = Travel_Plan_BASE_URL + `/getrecommendationplans?username=${username}&cityname=${cityname}`;
      axios
        .get(url)
        .then((response)=>{
          console.log(response);
          const responseObj = response.data.responseObj;
          if(responseObj == null){
            Modal.info({
              title: 'Sorry, there is no recommended plan currently. Try it Later!',
            });
          } else if(response.data.responseCode === "500"){
            Modal.error({
              Title: 'An error occurred! Try it again.'
            })
          }else if(response.data.responseCode === "200"){
            const planList = response.data.responseObj.planDataList;
            const plans = [];
            // const plansWithUsername = [];
            for(let i = 0; i < planList.length; i++){
              let key = planList[i].planId;
              let name = planList[i].planName;
              let days = planList[i].routeDataList.length;
              let planDetail = [];
              for(let j = 0; j < days; j++){
                let attractions = [];
                for(let k = 0; k < planList[i].routeDataList[j].attractionDataList.length; k++){
                  let attraction = {
                    name: planList[i].routeDataList[j].attractionDataList[k].attractionName,
                    geometry: planList[i].routeDataList[j].attractionDataList[k].geometry,
                  }
                  attractions.push(attraction);
                }
                let route = {
                  day: planList[i].routeDataList[j].day,
                  route: attractions,
                }
                planDetail.push(route);
              }
              let plan = {
                key: key,
                name: name,
                days: days,
                planDetail: planDetail,
              }
              plans.push(plan);
            }
            this.setState({
              recommendPlanList: plans,
            });

            this.props.getRecommendsBack(this.state.recommendPlanList);
          }})
          .catch((error)=> {
            console.log("err in fetch cityInfo -> ", error);
          })
    }

    render() {
        return(
            <div className='tableContainer'>
                <Table
                    bodyStyle={{fontSize:"6em"}}
                    className = 'tableChild'
                    columns={this.columns}
                    dataSource = {this.state.recommendPlanList}
                    pagination={{ pageSize: 5 }}
                />
                <Modal
                  className = "jsj"
                  title={this.state.selectedPlanName}
                  cancelButtonStyle = {{width:"100px"}}
                  style={{float: "left", marginLeft:"3%", top:"30%"}}
                  visible={this.state.modalVisible}
                  onOk={() => this.setModalVisible(false)}
                  onCancel={() => this.setModalVisible(false)}
                >
                  <Tabs defaultActiveKey="1" tabPosition="top" onChange={(key) =>{console.log(key)}}>
                    {this.state.selectedPlanDetail.map(i => (
                      <TabPane tab={`Day ${i.day}`} key={i.day}>
                        <Timeline>
                          {
                            i.route.map(j =>(
                              <Timeline.Item>{j.name}</Timeline.Item>
                            ))
                          }
                        </Timeline>
                      </TabPane>
                    ))}
                  </Tabs>
                </Modal>
            </div>
            
        );  
    }
}

export default RecommendPlanList;

  
 