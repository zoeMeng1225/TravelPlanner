import React, { Component } from 'react';
import { Table, Space,Tabs,Button, Timeline } from 'antd';
import {Link} from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';
import MapContainer from "./MapContainer";
import { BrowserRouter, Route, Router, Switch } from "react-router-dom";
import { Travel_Plan_BASE_URL } from "../constant";
import axios from "axios";
import { sendRequest, zoomBefore, zoomAfter } from "./RouteUtils";
import SearchResultHeader from "./SearchResultHeader";
import backAarrow from "../asset/image/back-arrow.svg";
import history from "../history";

const { TabPane } = Tabs;
class SavedPlans extends Component {
    state = {
        cityName: "Los Angeles",
        cityCoordinate: null,
        zoom: 12,
        cityImg: "https://media.nomadicmatt.com/laguide1.jpg",
        markers: [],
        result: [],
        isDraw: false,
        // needed by modal
        modalVisible: false,
        // needed by functions in RecommendedPlanList
        selectedPlanName: "",
        selectedPlanDetail: [],
        savedPlanList: [],
        savedRoutes: [],      //list of list
      };

    showOnMap = (plan) => {
      const routes = [];
      let markers = [];
      plan.map((day) =>{
          routes.push(day.route)
          markers = markers.concat(day.route);
      });
      for(let i = 0; i < markers.length; i++) {
        markers[i].key = i;
      }

      this.setState({
          savedRoutes: routes,
          markers: markers,
      },this.sendRequest);
    };
    
    color = ['#411b5e', '#0026ff', '#22bab5', '#55ff00', '#aaff00', '#ffff00', '#ffbb00', '#ff9900', '#ff5500', '#ff3300', '#bf2a2a', '#780765', '#000000'];

    //send route request
    sendRequest = () => {

        const routes = this.state.savedRoutes;
        const markers = this.state.markers;

        this.setState({
          result: [],
          markers: [],
          zoom: zoomBefore,
        }, ()=> {
          let lat = [];
          let lng = [];
          for(let i = 0; i < routes.length; i++) {
            for(let j = 0; j < routes[i].length; j++) {
              lat.push(routes[i][j].geometry.location.lat);
              lng.push(routes[i][j].geometry.location.lng);
            }
            if(routes[i].length < 2) {
              continue;
            }
            sendRequest(routes[i], (response) => {
                let newResult = this.state.result;
                // response.color=randomColor({
                //     luminosity: 'random',
                //     hue: 'random'
                //  });
                response.color=this.color[newResult.length];
                response.actualColor=response.color;
                response.key=i+1;
                newResult.push(response);
                // newResult = [response];
                this.setState(
                    { 
                        result: newResult,
                        markers: markers,
                        isDraw: true,
                        zoom: zoomAfter
                    });
            });
        }

        function avg(array)  {
          if(array.length === 0) {
            return null;
          } else if(array.length === 1) {
            return array[0];
          } else {
            let max = array[0];
            let min = array[0];
            for(let k = 0; k < array.length; k++) {
              max = array[k] > max ? array[k] : max;
              min = array[k] < min ? array[k] : min;
            }
            return (max + min) / 2;
          }
          
        }
        let latAvg = avg(lat);
        let lngAvg = avg(lng);
        if(latAvg !== null) {
          const cityCoordinate = {
            lat: latAvg,
            lng: lngAvg
          }
          this.setState({
            cityCoordinate: cityCoordinate,
            
          })
        }


        })
    }

    getSavedPlans = () =>{
      const username = JSON.parse(localStorage.getItem('userInfo')).userName;
      const url = Travel_Plan_BASE_URL + `/allplans?username=${username}`;
      console.log(url);
      axios
        .get(url)
        .then((response)=>{
          let planList = response.data.responseObj.planDataList;
          let newPlanList = [];
          // i = index of a plan
          for (let i = 0; i < planList.length; i++) {
            let key = planList[i].planId;
            let name = planList[i].planName;
            let days = planList[i].routeDataList.length;
            let planDetail = [];
            // j = index of route of a routeDataList
            for (let j = 0; j < days; j++) {
              // let day = j + 1;
              let attractions = [];
              // k = index of an attraction in routeDataList.attractionDataList
              for (let k = 0; k < planList[i].routeDataList[j].attractionDataList.length; k++) {
                let attractionItem = {
                  name: planList[i].routeDataList[j].attractionDataList[k].attractionName,
                  geometry: planList[i].routeDataList[j].attractionDataList[k].geometry,
                }
                attractions.push(attractionItem);
              }
              let routeItem = {
                day: planList[i].routeDataList[j].day,
                route: attractions,
              }
              planDetail.push(routeItem);
            }
            let plan = {
              key: key,
              name: name,
              days: days,
              planDetail: planDetail,
            }
            newPlanList.push(plan);
          }
          this.setState({
            savedPlanList: newPlanList,
          })
        })
        .catch((error)=> {
          console.log("err in fetching user plan -> ", error);
        })
    }

    deleteSavedPlans = (planId) =>{
      const username = JSON.parse(localStorage.getItem('userInfo')).userName;
      const url = Travel_Plan_BASE_URL + `/deleteplan?username=${username}&planid=${planId}`;
      axios
        .delete(url)
        .then((response)=>{
          console.log(response);
          if(response.data.responseCode === "200") {
            // delete plan from display
            let newPlanList = this.state.savedPlanList;
            newPlanList = newPlanList.filter(entry=>{
              return entry.key !== planId;
            });
            this.setState({
              savedPlanList: newPlanList,
            });
          } else if (response.data.responseCode === "500") {
            console.log("err in deleting user plan -> responseCode: 500");
          }
        })
        .catch((error)=> {
          console.log("err in deleting user plan ->", error);
        })
    }


    componentDidMount() {
      // todo: put into const file
      // const url =
      //     Travel_Plan_BASE_URL + `/search?city=${this.props.match.params.city}`;
      const cityName = history.location.state.target;
      this.setState({
        cityName: cityName === null ? "Boston" : cityName
      })
      const url =
          Travel_Plan_BASE_URL + `/search?city=Boston`;
      axios
          .get(url)
          .then((response) => {
              //console.log('response: ',response);
              //console.log('response: ',response.data.responseObj.results);
              //console.log(response.data.responseObj.allTypes);
              this.setState({
                  cityCoordinate: {
                      lat: response.data.responseObj.coordinate[0],
                      lng: response.data.responseObj.coordinate[1],
                  },
                  markers: []
                  // citySearchResult: response.data.responseObj.results,
                  // allTypes: response.data.responseObj.allTypes,
              });
              this.getSavedPlans();
          })
          .catch((error) => {
              console.log("err in fetch cityInfo -> ", error);
          });
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
              this.showOnMap(record.planDetail);
            }}>Show on map</Button>
            <Button onClick={()=>{
              this.deleteSavedPlans(record.key);
            }}>Delete</Button>
          </Space>
        )
      },
    ];
    // 原来：
    // setModalVisible(modalVisible) {
    setModalVisible = (modalVisible) =>{
      this.setState({ modalVisible });
    }

    setPlanDetail = (routes) =>{
      this.setState( {selectedPlanDetail: routes });
    }

    setPlanName = (planName) =>{
      this.setState({selectedPlanName: planName});
    }

    updateCenter = (newCenter) => {
      this.setState({
        cityCoordinate: newCenter,
      })
    }

    render() {
        return (
          <BrowserRouter>
            <Router history={history}>
                <div className="searchResult-container">
                  <SearchResultHeader />
                  <div className="main">
                    <div className="left-side">    
                      <div className='tableContainer'>
                          <Table
                              columns={this.columns}
                              dataSource={this.state.savedPlanList}
                              pagination={{ pageSize: 5 }}
                          />
                          <Modal
                          className = "jsj"
                          title={this.state.selectedPlanName}
                          style={{float: "left", marginLeft:"3%", top:"30%"}}
                          visible={this.state.modalVisible}
                          onOk={() => this.setModalVisible(false)}
                          onCancel={() => this.setModalVisible(false)}
                          >
                  
                            <Tabs defaultActiveKey="1" tabPosition="top" onChange={(key) =>{console.log(key)}} style={{ height: "70%" }}>
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

                        <span className = "backg" >
                          <p onClick={() => history.push(`/searchResult/${this.state.cityName}`)}>
                            <img src={backAarrow} alt=""/>
                            Back to result page
                          </p>
                        </span>
                    </div>
                    
                    <div className="right-side">
                      <MapContainer
                        cityCoordinate={this.state.cityCoordinate}
                        selected={this.state.markers}
                        responseData={this.state.result}
                        zoom={this.state.zoom}
                        updateCenter={this.updateCenter}
                      />
                    </div>
                  </div>
                </div>
             </Router>
          </BrowserRouter>
        );
    }
}

export default SavedPlans;
